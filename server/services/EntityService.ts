import { EntityModel } from "../../service-DB/models/index";
import { DBService } from "./DBService";
import { v4 as uuidv4 } from "uuid";

let instance = null;
let db: DBService<EntityModel> = null;

export class EntityService {
  private table: string;

  constructor(table: string) {
    this.table = table;
  }

  public static async Init(table = "qz_entity"): Promise<EntityModel> {
    if (!instance) {
      instance = new EntityService(table);
      db = await DBService.Init<EntityModel>();
    }

    return instance;
  }
  public async createEntity(params: EntityModel): Promise<EntityModel | Error> {
    const existsEntity = await db.hasRowTable(this.table, "name", params.name);
    if (!existsEntity) {
      return await db.create(this.table, { ...params });
    } else {
      throw new Error("❌ Такая сущность уже существует");
    }
  }

  public async updateEntity(params: any): Promise<EntityModel | Error> {
    const existsEntity = await db.hasRowTable(this.table, "id", params.id);
    if (existsEntity) {
      return await db.update(this.table, { ...params });
    } else {
      throw new Error("❌ Обновляемой сущности не существует");
    }
  }
  public async deleteEntity(id: string): Promise<any> {
    const existsEntity = await db.hasRowTable(this.table, "id", id);
    console.log(existsEntity);
    if (existsEntity) {
      return await db.delete(this.table, id);
    } else {
      throw new Error("❌ Удаляемой сущности не существует");
    }
  }
  public async getEntity(id: string): Promise<any> {
    const existsEntity = await db.hasRowTable(this.table, "id", id);
    if (existsEntity) {
      return await db.findOnce(this.table, { column: "id", val: id });
    } else {
      throw new Error("❌ Возращаемой сущности не существует");
    }
  }
  public async getAllEntities(params: any): Promise<EntityModel[]> {
    const entities = await db.getAllRows(this.table);
    return entities;
  }
  public async getAllFieldsById(id: string): Promise<any> {
    const existsEntity = await db.hasRowTable(this.table, "id", id);
    if (existsEntity) {
      const foregins = [
        {
          key: "entity_id",
          table: "qz_field_text",
          conditional: `WHERE ${this.table}.id = '${id}'`,
        },
        {
          key: "entity_id",
          table: "qz_field_checkbox",
          conditional: `WHERE ${this.table}.id = '${id}'`,
        },
        {
          key: "entity_id",
          table: "qz_field_list",
          conditional: `WHERE ${this.table}.id = '${id}'`,
        },
      ];

      return await db.gettingAttachedRowsByOnceCondition(this.table, foregins);
    } else {
      throw new Error("❌ Такой сущности не существует");
    }
  }
  public async getAllFields(): Promise<any[]> {
    const checkbox_fields = await db.getAllRows("qz_field_checkbox");
    const text_fields = await db.getAllRows("qz_field_text");
    const list_fields = await db.getAllRows("qz_field_list");

    return [...checkbox_fields, ...text_fields, ...list_fields];
  }
  public async getAllEntitiesByModelId(model_id: string): Promise<any[]> {
    const payload = {
      taxonomyTable: "qz_taxonomy_models",
      primaryTable: this.table,
      innerJoinedTable: "qz_model",
      foreginKeys: {
        primaryKey: "id_entity",
        innerJoinedKey: "id_model",
      },
      conditional: `where qz_model.id = '${model_id}'`,
    };
    const entities = await db.getAllRowsTaxonomy(this.table, payload);
    return entities;
  }
  public async syncEntityWithModel(payload: {
    id_entity: string;
    id_model: string;
  }) {
    const taxonomy = await db.create("qz_taxonomy_models", {
      id: uuidv4(),
      ...payload,
    });

    return taxonomy;
  }
}
