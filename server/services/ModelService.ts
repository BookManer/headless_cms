import { brotliDecompress } from "zlib";
import { ModelEntityModel } from "../../service-DB/models/index";
import { DBService } from "./DBService";
let instance = null;
let db: DBService<ModelEntityModel> = null;

export class ModelService {
  private table: string;

  constructor(table: string) {
    this.table = table;
  }

  public static async Init(table = "qz_model") {
    if (!instance) {
      instance = new ModelService(table);
      db = await DBService.Init();
    }

    return instance;
  }
  public async createModel(params: ModelEntityModel) {
    const existsModelService = await db.hasRowTable(
      this.table,
      "name",
      params.name
    );
    if (!existsModelService) {
      return await db.create(this.table, params);
    } else {
      throw new Error("❌ Такая модель уже существует и настроенна");
    }
  }
  public async updateModel(params: any) {
    const existsModelService = await db.hasRowTable(
      this.table,
      "id",
      params.id
    );
    if (existsModelService) {
      return await db.update(this.table, params);
    } else {
      throw new Error(
        "❌ Операция невозможна: Такой модели нигде не настроенно и не создано"
      );
    }
  }
  public async deleteModel(id: string) {
    const existsModelService = await db.hasRowTable(this.table, "id", id);
    if (existsModelService) {
      return await db.delete(this.table, id);
    } else {
      throw new Error(
        "❌ Операция невозможна: Такой модели нигде не настроенно и не создано"
      );
    }
  }
  public async getAllModels() {
    const modeles = await db.getAllRows(this.table);
    return modeles;
  }
  public async getAllFieldsByIdModel(id: string): Promise<any> {
    const existsModel = await db.hasRowTable(this.table, "id", id);
    if (existsModel) {
      const foregins = [
        {
          key: "model_id",
          table: "qz_field_text",
          conditional: `WHERE ${this.table}.id = '${id}'`,
        },
        {
          key: "model_id",
          table: "qz_field_checkbox",
          conditional: `WHERE ${this.table}.id = '${id}'`,
        },
        {
          key: "model_id",
          table: "qz_field_list",
          conditional: `WHERE ${this.table}.id = '${id}'`,
        },
      ];

      return await db.gettingAttachedRowsByOnceCondition(this.table, foregins);
    } else {
      throw new Error("❌ Такой сущности не существует");
    }
  }
  public async getAllModelsByEntityId(entity_id: string) {
    const payload = {
      taxonomyTable: 'qz_taxonomy_models',
      primaryTable: this.table,
      innerJoinedTable: 'qz_entity',
      foreginKeys: {
        primaryKey: 'id_model',
        innerJoinedKey: 'id_entity',
      },
      conditional: `where qz_entity.id = '${entity_id}'`,
    };
    const models = await db.getAllRowsTaxonomy(this.table, payload);
    return models;
  }
}
