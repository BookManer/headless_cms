import { FieldListItemModel, FieldListModel } from "../../service-DB/models/index";
import { DBService } from "./DBService";
let instance = null;
let db: DBService<FieldListItemModel> = null;

export class FieldListItemService {
  private table: string;

  constructor(table: string) {
    this.table = table;
  }

  public static async Init(table = "qz_field_list_item") {
    if (!instance) {
      instance = new FieldListItemService(table);
      db = await DBService.Init<FieldListItemModel>();
    }

    return instance;
  }
  public async createFieldListItem(params: FieldListItemModel) {
    const existsFieldListItem = await db.hasRowTable(
      this.table,
      "id",
      params.id
    );
    if (!existsFieldListItem) {
      return await db.create(this.table, params);
    } else {
      throw new Error("❌ Такой элемент списка уже существует");
    }
  }
  public async updateFieldListItem(params: any) {
    const existsFieldListItem = await db.hasRowTable(
      this.table,
      "id",
      params.id
    );
    if (existsFieldListItem) {
      return await db.update(this.table, params);
    } else {
      throw new Error("❌ Такого элемента списка не существует");
    }
  }
  public async deleteFieldListItem(id: string) {
    const existsFieldListItem = await db.hasRowTable(this.table, "id", id);
    if (existsFieldListItem) {
      return await db.delete(this.table, id);
    } else {
      throw new Error("❌ Такого элемента списка не существует");
    }
  }
  public async getFieldListItem(id: string) {
    const existsFieldListItem = await db.hasRowTable(this.table, "id", id);
    if (existsFieldListItem) {
      return await db.findOnce(this.table, { column: "id", val: id });
    } else {
      throw new Error("❌ Такого элемента списка не существует");
    }
  }
}
