import { MarkdownModel } from "../../service-DB/models/index";
import { DBService } from "./DBService";

let instance = null;
let db: DBService<MarkdownModel> = null;

export class MarkdownService {
  private table: string;

  constructor(table: string) {
    this.table = table;
  }

  public static async Init(table = "qz_field_markdown"): Promise<MarkdownModel> {
    if (!instance) {
      instance = new MarkdownService(table);
      db = await DBService.Init<MarkdownModel>();
    }

    return instance;
  }
  public async createMarkdown(params: MarkdownModel): Promise<MarkdownModel | Error> {
    const existsMarkdown = await db.hasRowTable(this.table, "name", params.name);
    if (!existsMarkdown) {
      return await db.create(this.table, { ...params });
    } else {
      throw new Error("❌ Такая сущность уже существует");
    }
  }

  public async updateMarkdown(params: any): Promise<MarkdownModel | Error> {
    const existsMarkdown = await db.hasRowTable(this.table, "id", params.id);
    if (existsMarkdown) {
      return await db.update(this.table, { ...params });
    } else {
      throw new Error("❌ Обновляемой сущности не существует");
    }
  }
  public async deleteMarkdown(id: string): Promise<any> {
    const existsMarkdown = await db.hasRowTable(this.table, "id", id);
    if (existsMarkdown) {
      return await db.delete(this.table, id);
    } else {
      throw new Error("❌ Удаляемой сущности не существует");
    }
  }
  public async getMarkdown(id: string): Promise<any> {
    const existsMarkdown = await db.hasRowTable(this.table, "id", id);
    if (existsMarkdown) {
      return await db.findOnce(this.table, { column: "id", val: id });
    } else {
      throw new Error("❌ Возращаемой сущности не существует");
    }
  }
  public async getAllMarkdowns(params: any): Promise<MarkdownModel[]> {
    const markdowns = await db.getAllRows(this.table);
    return markdowns;
  }
}
