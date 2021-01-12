import { FieldTextModel } from "../../service-DB/models/index";
import { DBService } from "./DBService";

let instance = null;
let db: DBService<FieldTextModel> = null;

export class FieldTextService {
  private table: string;

  constructor(table: string) {
    this.table = table;
  }

  public static async Init(table = "qz_field_text") {
    if (!instance) {
      instance = new FieldTextService(table);
      db = await DBService.Init<FieldTextModel>();
    }

    return instance;
  }

  public async createFieldText(params: FieldTextModel) {
    const existsFieldText = await db.hasRowTable(this.table, "id", params.id);
    if (!existsFieldText) {
      return await db.create(this.table, params);
    } else {
      throw new Error("❌ Такое поле уже существует");
    }
  }
  public async updateFieldText(params) {
    const existsFieldText = await db.hasRowTable(this.table, "id", params.id);
    if (existsFieldText) {
      return await db.update(this.table, params);
    } else {
      throw new Error("❌ Такого поля не существует");
    }
  }
  public async deleteFieldText(id: string) {
    const existsFieldText = await db.hasRowTable(this.table, "id", id);
    if (existsFieldText) {
      return await db.delete(this.table, id);
    } else {
      throw new Error("❌ Такого поля не существует");
    }
  }
  public async getFieldTextById(id: string) {
    const existsFieldText = await db.hasRowTable(this.table, "id", id);
    if (existsFieldText) {
      return await db.findOnce(this.table, { column: "id", val: id });
    } else {
      throw new Error("❌ Такого поля не существует");
    }
  }
}
