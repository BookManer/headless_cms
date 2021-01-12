import { GroupEntityModel } from "../../service-DB/models/index";
import { DBService } from "./DBService";
import { deleteFiles } from "../helpers/del";

let instance = null;
let db: DBService<GroupEntityModel> = null;

export class GroupEntityService {
  private table: string;

  constructor(table: string) {
    this.table = table;
  }

  public static async Init(table = "qz_groups_entity") {
    if (!instance) {
      instance = new GroupEntityService(table);
      db = await DBService.Init<GroupEntityModel>();
    }

    return instance;
  }

  public async getGroupById(id: string): Promise<object> {
    const existsGroupEntity = await db.hasRowTable(this.table, "id", id);
    if (!existsGroupEntity) {
      throw new Error('❌ Операция не выполнена: Такой группы не существует."');
    }

    return await db.findOnce(this.table, { column: "id", val: id });
  }

  public async getAllGroups(): Promise<object[]> {
    const rows = await db.getAllRows(this.table);
    if (!rows.length) {
      throw new Error('❌ Операция не выполнена: Список групп пуст"');
    }

    return rows;
  }

  public async getAllEntityByGroupId(
    group_id: string
  ): Promise<object[]> {
    const foregins = [
      {
        key: "group_id",
        table: "qz_entity",
        conditional: `WHERE ${this.table}.id = '${group_id}'`,
      },
    ];
    const rows = await db.gettingAttachedRowsByOnceCondition(
      this.table,
      foregins
    );
    return rows;
  }
}
