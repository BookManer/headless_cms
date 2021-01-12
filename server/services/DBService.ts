require("dotenv").config();
import { DBModel, ModelEntityModel } from "../../service-DB/models/index";
import { Client } from "pg";
const colors = require("colors");
import { DBEnum } from "../../service-DB/enums/index";

const log = console.log;
let instance: DBService<any> = null;
let clientDB: any = null;

interface BinaryTaxanomyForegins<FK, SK> {
  firstForeginKey: FK;
  secondForeginKey: SK;
  firstTable: string;
  secondTable: string;
}

/**
 * @author BorshBlack(Андрей Ноготков)
 * @class
 * @classdesc DBService - сервис для взаимодействия с БД.
 * Данный сервис инициирует БД, подключается к ней, создание,
 * обновление, удаление, поиск, соединение таблиц, возврат всех строк,
 * проверка на существование строки по определенному параметру.
 * СУБД PostgreSQL
 * @constructor
 * @param {string} db_name - Название базы данных
 * @param {string} db_user - Имя пользователя базы данных
 * @param {string} db_password -  пароль от базы данных
 */
export class DBService<TypeModel> implements DBModel<TypeModel> {
  db_name = process.env.DB_NAME_DATABASE;
  db_user = process.env.DB_USER;
  db_password = process.env.DB_PASSWORD;

  private constructor(
    db_name?: string,
    db_user?: string,
    db_password?: string
  ) {
    this.db_name = db_name || this.db_name;
    this.db_password = db_password || this.db_password;
    this.db_user = db_user || this.db_user;
  }

  /**
   *
   * @param {string} db_name - имя базы данных
   * @param {string} db_user - имя пользователя
   * @param {string} db_password - пароль базы данных
   * @returns {DBService<TypeModel>} - возвращает объект сервиса DBService с обобщенным типом TypeModel
   */
  static async Init<TypeModel>(
    db_name?: string,
    db_user?: string,
    db_password?: string
  ): Promise<DBService<any>> {
    try {
      if (instance === null) {
        instance = new DBService<TypeModel>(db_name, db_user, db_password);
      }
      await instance.connect();

      return Promise.resolve(instance);
    } catch (e) {
      log(
        colors.bold.red(
          `Не удалось проинициализировать Базу Данных, возможная причина:\n${e}`
        )
      );
      return Promise.reject(
        `Не удалось проинициализировать Базу Данных, возможная причина:\n${e}`
      );
    }
  }
  /**
   * @description Подключается к БД
   * @returns {DBService<TypeModel>} Возвращает объект сервиса DBService<TypeModel>
   */
  public async connect(): Promise<DBService<TypeModel> | Error> {
    try {
      clientDB = new Client({
        user: this.db_user,
        host: DBEnum.HOST,
        database: this.db_name,
        password: this.db_password,
        port: DBEnum.PORT,
      });
      await clientDB.connect();

      return Promise.resolve(instance);
    } catch (e) {
      log(colors.bold.red(e));
      return Promise.reject(e);
    }
  }
  /**
   *
   * @param {string} table - название таблицы
   * @param {object} payload - данные создаваемой сущности, данные строки таблцы <table>
   * @returns {Promise<TypeModel>} - возвращает обратно данные сущности, в случае неудачи - ошибку
   */
  public async create(table, payload): Promise<TypeModel | Error> {
    try {
      const res = await this.insertInto(table, payload);
      return Promise.resolve(res.rows[0]);
    } catch (e) {
      log(colors.bold.red(e));
      return Promise.reject(e);
    }
  }
  /**
   * @description Отвечает на вопрос: Существует ли строка в таблице по опредленному значению и его столбцу
   * @param {stirng} table - название таблицы
   * @param {stirng} column - наименование столбца таблицы
   * @param {string|number}foundRepeatedValue - значение предполагаемого повторяющегося значения в таблице
   * @returns {boolean} - существует ли строка в таблице?
   */
  public async hasRowTable(
    table: string,
    column: string,
    foundRepeatedValue: string | number
  ): Promise<Boolean> {
    const hasRows = await this.findOnce(table, {
      column,
      val: foundRepeatedValue,
    });
    if (hasRows === null || hasRows === undefined) {
      return false;
    }
    return true;
  }
  /**
   * @description Поиск строки в таблице по столбцу(ам)
   * @param {string} table - наименование таблицы
   * @param {{ column: string, val: string }} payload - данные столбцов таблицы, по которым будет вестись поиск
   * @returns {Promise<TypeModel>} - возвращает данные сущности
   */
  public async findOnce(table, payload): Promise<TypeModel> {
    const { column, val } = payload;
    const query = `SELECT * FROM ${table} WHERE ${column} = $1`;
    const res = await clientDB.query({
      text: query,
      values: [val],
    });

    return res.rows[0];
  }
  /**
   * @description Получение всех строк таблицы.
   * @param {string} table - наименование таблицы
   * @returns {Promise<Array<TypeModel>>} - массив строк из таблицы
   */
  public async getAllRows(table): Promise<Array<TypeModel>> {
    const query = `SELECT * FROM ${table}`;
    const res = await clientDB.query(query);

    return res.rows;
  }
  public async gettingAttachedRowsByOnceCondition(
    primaryTable: string,
    foregins: Array<any>
  ) {
    try {
      const queryLeftJoinStr = foregins
        .map(({ table: foreginTable, key: foreginKey, conditional }, id) => {
          let query = `
            SELECT ${foreginTable}.* FROM ${primaryTable}
            INNER JOIN ${foreginTable} ON ${foreginTable}.${foreginKey} = ${primaryTable}.id`;
          query += conditional ? "\n" + conditional + ";" : ";";

          return query;
        })
        .join(";");

      const query = queryLeftJoinStr;
      let res = await clientDB.query(query);
      if (res instanceof Array) {
        const rowsNotFlats: any = res.map((result) => result.rows);
        const flatedRows = rowsNotFlats.flat();

        return Promise.resolve(flatedRows);
      }

      return Promise.resolve(res.rows);
    } catch (e) {
      return Promise.reject(`Error:\n${e.message}`);
    }
  }
  /**
   *
   * @param {string} table - название таблицы
   * @param {object} params - данные создаваемой сущности, данные строки таблцы <table>
   * @returns {Promise<TypeModel>} - возвращает обратно данные сущности, в случае неудачи - ошибку
   */
  public async insertInto(table, params): Promise<any | Error> {
    try {
      const paramsTableStr = Object.keys(params).join(", ");
      const valuesTableStr = Object.entries(params)
        .map((val, key) => `$${key + 1}`)
        .join(", ");
      const values = Object.entries(params).map((val, key) => val[1]);

      const query = `INSERT INTO ${table}(${paramsTableStr}) VALUES(${valuesTableStr}) RETURNING *`;
      const res = await clientDB.query(query, values);

      return Promise.resolve(res);
    } catch (e) {
      log(colors.bold.red(e));
      return Promise.reject(e);
    }
  }
  /**
   * @description Обновляет данные строк определнной таблицы по определенному столбцу.
   * @param {string} table - наименование таблицы
   * @param {object} params - объект типа {column: value}, где column - столбец, value - новое значение.
   * @returns {Promise<TypModel>}
   */
  public async update(table: string, params): Promise<TypeModel> {
    const paramsSlicedById = Object.entries(params).filter(
      (val, key) => val[0] !== "id"
    );
    const columns = paramsSlicedById.map((val, key) => val[0]);
    const values = paramsSlicedById.map((val) => val[1]);
    const mappedParams = columns
      .map((column, id) => `${column} = '${values[id]}'`)
      .join(", ");
    const query = `UPDATE ${table} SET ${mappedParams} WHERE id = '${params.id}' RETURNING *`;

    const res = await clientDB.query(query);
    return res.rows[0];
  }
  /**
   * @description Удаляет строку из таблицы по primary key id, идентификатору
   * @param {string} table - наименование таблицы
   * @param {string} id - идентификатор сущности(строки) в таблице
   * @returns {Promise<TypeModel>} - возвращает данные сущности
   */
  public async delete(table: string, id: string): Promise<TypeModel> {
    const query = `DELETE from ${table} WHERE id = '${id}' RETURNING *`;
    const res = await clientDB.query(query);

    return res.rows[0];
  }
  public async binaryTaxanomy<FK, SK, ReturnModel>(
    table: string,
    foregins: BinaryTaxanomyForegins<FK, SK>[]
  ): Promise<ReturnModel[]> {
    const query = foregins.map((foreginPayload) => {
      const {
        firstForeginKey,
        secondForeginKey,
        firstTable,
        secondTable,
      } = foreginPayload;
      return `SELECT * from ${table}
              INNER JOIN ${firstTable} ON ${firstTable}.id = ${table}.${firstForeginKey}
              INNER JOIN ${secondTable} ON ${secondTable}.id = ${table}.${secondForeginKey}`;
    });

    let res = await clientDB.query(query.join(";"));
    return Promise.resolve(res.rows);
  }
  public async getAllRowsTaxonomy(
    table: string,
    payload: any
  ): Promise<ModelEntityModel[]> {
    const { primaryTable, innerJoinedTable, foreginKeys, conditional, taxonomyTable } = payload;
    const { primaryKey, innerJoinedKey } = foreginKeys;
    const query = `select ${primaryTable}.* from ${taxonomyTable}
                   inner join ${innerJoinedTable} on ${innerJoinedTable}.id = ${taxonomyTable}.${innerJoinedKey}
                   inner join ${primaryTable} on ${primaryTable}.id = ${taxonomyTable}.${primaryKey}
                   ${conditional}`;
    
      
    let res = await clientDB.query(query);
    return Promise.resolve(res.rows);
  }
}
