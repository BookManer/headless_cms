import { FieldCheckboxModel } from "../../service-DB/models/index";
import { DBService } from "./DBService";

let instance = null;
let db: DBService<FieldCheckboxModel> = null;

export class FieldCheckboxService {
  private table: string;

  constructor(table: string) {
    this.table = table;
  }

  public static async Init(table = "qz_field_checkbox") {
    if (!instance) {
      instance = new FieldCheckboxService(table);
      db = await DBService.Init<FieldCheckboxModel>();
    }

    return instance;
  }
  public async createFieldCheckbox(params: FieldCheckboxModel) {
    const existsFieldCheckbox = await db.hasRowTable(
      this.table,
      "id",
      params.id
    );
    if (!existsFieldCheckbox) {
      return await db.create(this.table, params);
    } else {
      throw new Error("❌ Такое поле уже существует");
    }
  }
  public async updateFieldCheckbox(params: any) {
    const existsFieldCheckbox = await db.hasRowTable(
      this.table,
      "id",
      params.id
    );
    if (existsFieldCheckbox) {
      return await db.update(this.table, params);
    } else {
      throw new Error("❌ Такого поле не существует");
    }
  }
  public async deleteFieldCheckbox(id: string) {
    const existsFieldCheckbox = await db.hasRowTable(this.table, "id", id);
    if (existsFieldCheckbox) {
      return await db.delete(this.table, id);
    } else {
      throw new Error("❌ Такого поле не существует");
    }
  }
  public async getFieldCheckbox(id) {
    const existsFieldCheckbox = await db.hasRowTable(this.table, "id", id);
    if (existsFieldCheckbox) {
      return await db.findOnce(this.table, { column: "id", val: id });
    } else {
      throw new Error("❌ Такого поля не существует");
    }
  }
}
