import { SeoModel } from "../../service-DB/models/index";
import { DBService } from "./DBService";
let instance = null;
let db: DBService<SeoModel> = null;

export class SEOService {
  private table: string;

  constructor(table: string) {
    this.table = table;
  }

  public static async Init(table = "qz_seo") {
    if (!instance) {
      instance = new SEOService(table);
      db = await DBService.Init();
    }

    return instance;
  }
  public async createSEO(params: SeoModel) {
    const existsSEOService = await db.hasRowTable(this.table, "id", params.id);
    if (!existsSEOService) {
      return await db.create(this.table, params);
    } else {
      throw new Error("❌ Такое SEO уже существует и настроенно");
    }
  }
  public async updateSEO(params: any) {
    const existsSEOService = await db.hasRowTable(this.table, "id", params.id);
    if (existsSEOService) {
      return await db.update(this.table, params);
    } else {
      throw new Error(
        "❌ Операция невозможна: Такого SEO нигде не настроенно и не создано"
      );
    }
  }
  public async deleteSEO(id: string) {
    const existsSEOService = await db.hasRowTable(this.table, "id", id);
    if (existsSEOService) {
      return await db.delete(this.table, id);
    } else {
      throw new Error(
        "❌ Операция невозможна: Такого SEO нигде не настроенно и не создано"
      );
    }
  }
  public async getSEO(id: string) {
    const existsSEOService = await db.hasRowTable(this.table, "id", id);
    if (existsSEOService) {
      return await db.findOnce(this.table, { column: "id", val: id });
    } else {
      throw new Error(
        "❌ Операция невозможна: Такое SEO нигде не настроенно и не создано"
      );
    }
  }
}
