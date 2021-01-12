const path = require("path");
/**
 * @module multerInstance - экземпляр multer.js
 * @module verifyUpload - загрузка файла на локальную машину
 */
import { multerInstance, verifyUpload } from "../../multer";

/**
 * @description Получение файла из http-запроса по параметру name = media_upload.
 * @param useService - сервис для управления с конкретной сущностью БД
 * @param {object} params - данные из http запросы, req.query
 * @param {Request} req - http-запрос
 * @param {Response} res - http-ответ
 */
export async function onUploadMedia(useService, params, req, res) {
  const file: any = await verifyUpload(
    req,
    res,
    multerInstance.single("media_upload")
  );
  
  return await useService.uploadMedia({
    ...params,
    extension: path.extname(file.filename),
    fullname: file.filename,
  });
}

export async function onUploadMedias(useService, params, req, res) {
  const result: any = await verifyUpload(req, res, multerInstance.array('media_upload', 12));
  return await useService.uploadMedias(JSON.parse(params.medias));
}

export async function onUpdateMetaData(useService, params) {
  const res = await useService.updateMetaDataMedia(params);
  return res;
}

export async function onGetMediaById(useService, { id }) {
  const res = await useService.getMediaById(id);
  return res;
}

export async function onRemoveMedia(useService, params) {
  try {
    const deletedMedia = await useService.deleteMedia(params);
    return deletedMedia;
  } catch (err) {
    return err.message;
  }
}
