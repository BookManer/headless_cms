import { MediaModel } from "../../service-DB/models/index";
import { DBService } from "./DBService";
import { deleteFiles } from "../helpers/del";
import { v4 as uuid } from "uuid";

const path = require('path');

let instance = null;
let db: DBService<MediaModel> = null;

interface UpdloadDataMediaModel extends MediaModel {
  model_id?: string;
  entity_id?: string;
  relativePath?: string;
}
interface UpdateMediaPayload {
  id: string;
  alternative?: string;
  title?: string;
  lazy?: boolean;   
}

export class MediaService {
  private table: string;

  constructor(table: string) {
    this.table = table;
  }

  public static async Init(table = "qz_media") {
    if (!instance) {
      instance = new MediaService(table);
      db = await DBService.Init<MediaModel>();
    }

    return instance;
  }

  public async uploadMedia(params: UpdloadDataMediaModel) {
    const existsMedia = await db.hasRowTable(this.table, "id", params.id);
    if (!existsMedia) {
      const { entity_id, model_id, relativePath, ...withoutEntityAndModel } = params;
      const dateCreated = new Date(Date.now());
      const year = dateCreated.getFullYear();
      const month = dateCreated.getMonth() + 1;
      const day = dateCreated.getDay() - 1;
     
      const res = (await db.create(this.table, {
        ...withoutEntityAndModel,
        date_created: dateCreated,
        date_last_updated: dateCreated,
        relative_path: !relativePath?.length ? `${year}/${month}/${day}` : relativePath + '/',
      })) as MediaModel;

      await db.create("qz_taxonomy_media", {
        id: uuid(),
        media_id: res.id,
        model_id,
        entity_id,
      });
      return res;
    } else {
      throw new Error("❌ Данный медиа объект уже существует");
    }
  }
  public async uploadMedias(params: UpdloadDataMediaModel[]) {
    const uploadedMedias = [];
    for (let media of params) {
      const mediaData = await this.uploadMedia(media);
      uploadedMedias.push(mediaData)
    }

    return uploadedMedias;
  }
  public async updateMetaDataMedia(params: UpdateMediaPayload) {
    const existsMedia = await db.hasRowTable(this.table, "id", params.id);
    if(existsMedia) {
      const { id, alternative, title, lazy } = await db.update(this.table, params);
      return { id, alternative, title, lazy };
    } else {
      throw new Error("❌ Данного медиа объекта не существует");
    }
  }

  public async getMediaById(id: string) {
    const existsMedia = await db.hasRowTable(this.table, 'id', id);
    if (existsMedia) {
      const media: MediaModel = await db.findOnce(this.table, { column: 'id', val: id });
      return media;
    } else {
      throw new Error("❌ Данного медиа объекта не существует");
    }
  }
  public async getMediaByRelativePath(relativePath: string) {
    const existsMedia = await db.hasRowTable(this.table, 'relative_path', relativePath);
    if (existsMedia) {
      const media: MediaModel = await db.findOnce(this.table, { column: 'relative_path', val: relativePath });
      return media;
    } else {
      throw new Error("❌ Данного медиа объекта не существует");
    }
  }

  public async deleteMedia(params) {
    const existsMedia = await db.hasRowTable(this.table, "id", params.id);
    if (existsMedia) {
      const mediaObject: MediaModel = await db.delete(this.table, params.id);
      await deleteFiles(mediaObject.fullname, path.resolve(__dirname, '../../public'), mediaObject.date_last_updated);
      return mediaObject;
    } else {
      throw new Error("❌ Данного медиа объекта не существует");
    }
  }
}
