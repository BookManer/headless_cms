import { FieldListModel } from "../../service-DB/models/index";
import { DBService } from "./DBService";
let instance = null;
let db: DBService<FieldListModel> = null;

export class FieldListService {
  private table: string;

  constructor(table: string) {
    this.table = table;
  }

  public static async Init(table = "qz_field_list") {
    if (!instance) {
      instance = new FieldListService(table);
      db = await DBService.Init<FieldListModel>();
    }

    return instance;
  }
  public async createFieldList(params: FieldListModel) {
    const existsFieldList = await db.hasRowTable(this.table, "id", params.id);
    if (!existsFieldList) {
      return await db.create(this.table, params);
    } else {
      console.log("❌ Такой список уже существует")
      throw new Error("❌ Такой список уже существует");
    }
  }
  public async updateFieldList(params: any) {
    const existsFieldList = await db.hasRowTable(this.table, "id", params.id);
    if (existsFieldList) {
      return await db.update(this.table, params);
    } else {
      throw new Error("❌ Операция не выполнена: Такого списка не существует.");
    }
  }
  public async deleteFieldList(id: string) {
    const existsFieldList = await db.hasRowTable(this.table, "id", id);
    if (existsFieldList) {
      return await db.delete(this.table, id);
    } else {
      throw new Error("❌ Операция не выполнена: Такого списка не существует.");
    }
  }
  public async getFieldList(id: string) {
    const existsFieldList = await db.hasRowTable(this.table, "id", id);
    if (existsFieldList) {
      return await db.findOnce(this.table, { column: "id", val: id });
    } else {
      throw new Error("❌ Операция не выполнена: Такого списка не существует.");
    }
  }
}
