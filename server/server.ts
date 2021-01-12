require("dotenv").config();

const express = require("express");
const server = express();
const cors = require("cors");
const colors = require("colors");

server.use(cors());

// Controllers
import { onUploadMedia, onRemoveMedia, onUpdateMetaData, onGetMediaById, onUploadMedias } from "./controllers/media/controllers";
import {
  onCreateSEO,
  onUpdateSEO,
  onDeleteSEO,
  onGetSEO,
} from "./controllers/seo/controllers";
import {
  onCreatedEntity,
  onUpdateEntity,
  onDeletedEntity,
  onGetEntity,
  onGetAllFieldsById,
  onGetAllEntites,
  onGetAllEntitiesByModelId,
  onGetAllFields,
  onSyncEntityWithModel,
} from "./controllers/entity/controllers";
import {
  onCreateFieldText,
  onUpdateFieldText,
  onDeleteFieldText,
  onGetFieldText,
} from "./controllers/fieldText/controllers";
import {
  onCreateFieldList,
  onUpdateFieldList,
  onDeleteFieldList,
  onGetFieldList,
} from "./controllers/fieldList/controllers";
import {
  onCreateFieldListItem,
  onUpdateFieldListItem,
  onDeleteFieldListItem,
  onGetFieldListItem,
  onGetAllFieldListItemsByListId,
} from "./controllers/fieldListItem/controllers";
import {
  onCreateFieldCheckbox,
  onUpdateFieldCheckbox,
  onDeleteFieldCheckbox,
  onGetFieldCheckbox,
} from "./controllers/fieldCheckbox/controllers";
import { onGetUser } from "./controllers/user/controllers";
import {
  onGetAllGroup,
  onGetGroupById,
  onGetAllEntityByGroupId,
} from "./controllers/groupEntity/controllers";

import { AuthService } from "./auth";
import { EntityService } from "./services/EntityService";
import { FieldCheckboxService } from "./services/FieldCheckboxService";
import { MediaService } from "./services/MediaService";
import { FieldTextService } from "./services/FieldTextService";
import observerAssertAuth from "./helpers/observerAssertAuth";
import { FieldListService } from "./services/FieldListService";
import { FieldListItemService } from "./services/FieldListItemService";
import { SEOService } from "./services/SEOService";
import { UserService } from "./services/UserService";
import { GroupEntityService } from "./services/GroupEntityService";
import { ModelService } from "./services/ModelService";
import {
  onCreateModel,
  onDeleteModel,
  onGetAllFieldsByIdModel,
  onGetAllModels,
  onGetAllModelsByEntityId,
  onUpdateModel,
} from "./controllers/modelEntity/controllers";
import { MarkdownService } from "./services/MarkdownService";
import { onCreateFieldMarkdown, onDeleteFieldMarkdown, onGetFieldMarkdown, onUpdateFieldMarkdown } from "./controllers/fieldMarkdown/controllers";
import { UploadFSService } from "./services/UploadFS";
import { onGetAllUploadFS } from "./controllers/UploadFS/controllers";

const majorVersion = 2;
const apiURL = `/api/v${majorVersion}`;

server.get(`${apiURL}/cms/getUploadFS`, async (req, res) => {
  await observerAssertAuth(req, res, UploadFSService, onGetAllUploadFS)
})
// ========================= Authorization/Authication =========================   ✅ SOLVED
server.get(`${apiURL}/auth/signUp`, async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "POST, GET, PUT, UPDATE, DELETE, OPTIONS"
  );
  res.header("Access-Control-Allow-Methods", "*");
  const auth = await AuthService.Init();
  try {
    const {
      first_name,
      last_name,
      third_name,
      email,
      nickname,
      password,
    } = req.query;
    const fullName = { first_name, last_name, third_name };
    const token = await auth.SignUp(fullName, nickname, email, password);
    res.header("Authorization", `Bearer ${token}`);
    res.end("ok");
  } catch (e) {
    res.end(e);
  }
});
server.get(`${apiURL}/auth/signIn`, async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "POST, GET, PUT, UPDATE, DELETE, OPTIONS"
  );
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json;charset=UTF-8");
  const auth = await AuthService.Init();
  try {
    const { login, password } = req.query;
    const { user, token: newToken } = await auth.SignIn(login, password);
    res.send({ user, token: newToken });
  } catch (e) {
    res.status(401).send(e);
  }
});
server.get(`${apiURL}/cms/getUser`, async (req, res) => {
  await observerAssertAuth(req, res, UserService, onGetUser);
});
// ========================= Model ==========================   ✅ SOLVED
server.post(`${apiURL}/cms/createModel`, async (req, res) => {
  await observerAssertAuth(req, res, ModelService, onCreateModel);
});
server.put(`${apiURL}/cms/updateModel`, async (req, res) => {
  await observerAssertAuth(req, res, ModelService, onUpdateModel);
});
server.delete(`${apiURL}/cms/deleteModel`, async (req, res) => {
  await observerAssertAuth(req, res, ModelService, onDeleteModel);
});
server.get(`${apiURL}/cms/getAllModels`, async (req, res) => {
  await observerAssertAuth(req, res, ModelService, onGetAllModels);
})
server.get(`${apiURL}/cms/getAllModelsByEntityId`, async (req, res) => {
  await observerAssertAuth(req, res, ModelService, onGetAllModelsByEntityId);
})
server.get(`${apiURL}/cms/getAllFieldsByModelId`, async (req, res) => {
  await observerAssertAuth(req, res, ModelService, onGetAllFieldsByIdModel);
})
// ========================= Entity =========================   ✅ SOLVED
server.post(`${apiURL}/cms/createEntity`, async (req, res) => {
  await observerAssertAuth(req, res, EntityService, onCreatedEntity);
});
server.post(`${apiURL}/cms/addSyncEntityWithModel`, async (req, res) => {
  await observerAssertAuth(req, res, EntityService, onSyncEntityWithModel);
})
server.put(`${apiURL}/cms/updateEntity`, async (req, res) => {
  await observerAssertAuth(req, res, EntityService, onUpdateEntity);
});
server.delete(`${apiURL}/cms/deleteEntity`, async (req, res) => {
  await observerAssertAuth(req, res, EntityService, onDeletedEntity);
});
server.get(`${apiURL}/cms/getEntity`, async (req, res) => {
  await observerAssertAuth(req, res, EntityService, onGetEntity);
});
server.get(`${apiURL}/cms/getAllEntities`, async (req, res) => {
  await observerAssertAuth(req, res, EntityService, onGetAllEntites);
});
server.get(`${apiURL}/cms/getAllFieldsById`, async (req, res) => {
  await observerAssertAuth(req, res, EntityService, onGetAllFieldsById);
});
server.get(`${apiURL}/cms/getAllEntitiesByModelId`, async (req, res) => {
  await observerAssertAuth(req, res, EntityService, onGetAllEntitiesByModelId);
})
server.get(`${apiURL}/cms/getAllFields`, async (req, res) => {
  await observerAssertAuth(req, res, EntityService, onGetAllFields);
})
// ========================= GroupEntity =========================   ✅ SOLVED
server.get(`${apiURL}/cms/getGroupById`, async (req, res) => {
  await observerAssertAuth(req, res, GroupEntityService, onGetGroupById);
});
server.get(`${apiURL}/cms/getAllGroup`, async (req, res) => {
  await observerAssertAuth(req, res, GroupEntityService, onGetAllGroup);
});
server.get(`${apiURL}/cms/getAllEntityByGroupId`, async (req, res) => {
  await observerAssertAuth(
    req,
    res,
    GroupEntityService,
    onGetAllEntityByGroupId
  );
});
// ========================= FieldText =========================   ✅ SOLVED
server.post(`${apiURL}/cms/createFieldText`, async (req, res) => {
  await observerAssertAuth(req, res, FieldTextService, onCreateFieldText);
});
server.put(`${apiURL}/cms/updateFieldText`, async (req, res) => {
  await observerAssertAuth(req, res, FieldTextService, onUpdateFieldText);
});
server.delete(`${apiURL}/cms/deleteFieldText`, async (req, res) => {
  await observerAssertAuth(req, res, FieldTextService, onDeleteFieldText);
});
server.get(`${apiURL}/cms/getFieldText`, async (req, res) => {
  await observerAssertAuth(req, res, FieldTextService, onGetFieldText);
});
// ========================= FieldList =========================   ✅ SOLVED
server.post(`${apiURL}/cms/createFieldList`, async (req, res) => {
  await observerAssertAuth(req, res, FieldListService, onCreateFieldList);
});
server.put(`${apiURL}/cms/updateFieldList`, async (req, res) => {
  await observerAssertAuth(req, res, FieldListService, onUpdateFieldList);
});
server.delete(`${apiURL}/cms/deleteFieldList`, async (req, res) => {
  await observerAssertAuth(req, res, FieldListService, onDeleteFieldList);
});
server.get(`${apiURL}/cms/getFieldList`, async (req, res) => {
  await observerAssertAuth(req, res, FieldListService, onGetFieldList);
});
// ========================= FieldListItem =========================   ✅ SOLVED
server.post(`${apiURL}/cms/createFieldListItem`, async (req, res) => {
  await observerAssertAuth(
    req,
    res,
    FieldListItemService,
    onCreateFieldListItem
  );
});
server.put(`${apiURL}/cms/updateFieldListItem`, async (req, res) => {
  await observerAssertAuth(
    req,
    res,
    FieldListItemService,
    onUpdateFieldListItem
  );
});
server.delete(`${apiURL}/cms/deleteFieldListItem`, async (req, res) => {
  await observerAssertAuth(
    req,
    res,
    FieldListItemService,
    onDeleteFieldListItem
  );
});
server.get(`${apiURL}/cms/getFieldListItem`, async (req, res) => {
  await observerAssertAuth(req, res, FieldListItemService, onGetFieldListItem);
});
server.get(`${apiURL}/cms/getAllFieldListItemsByListId`, async (req, res) => {
  await observerAssertAuth(
    req,
    res,
    FieldListItemService,
    onGetAllFieldListItemsByListId
  );
});
// ========================= SEO =========================   ✅ SOLVED
server.post(`${apiURL}/cms/createSEO`, async (req, res) => {
  await observerAssertAuth(req, res, SEOService, onCreateSEO);
});
server.put(`${apiURL}/cms/updateSEO`, async (req, res) => {
  await observerAssertAuth(req, res, SEOService, onUpdateSEO);
});
server.delete(`${apiURL}/cms/deleteSEO`, async (req, res) => {
  await observerAssertAuth(req, res, SEOService, onDeleteSEO);
});
server.get(`${apiURL}/cms/getSEO`, async (req, res) => {
  await observerAssertAuth(req, res, SEOService, onGetSEO);
});
// ========================= FieldCheckbox =========================   ✅ SOLVED
server.post(`${apiURL}/cms/createFieldCheckbox`, async (req, res) => {
  await observerAssertAuth(
    req,
    res,
    FieldCheckboxService,
    onCreateFieldCheckbox
  );
});
server.put(`${apiURL}/cms/updateFieldCheckbox`, async (req, res) => {
  await observerAssertAuth(
    req,
    res,
    FieldCheckboxService,
    onUpdateFieldCheckbox
  );
});
server.delete(`${apiURL}/cms/deleteFieldCheckbox`, async (req, res) => {
  await observerAssertAuth(
    req,
    res,
    FieldCheckboxService,
    onDeleteFieldCheckbox
  );
});
server.get(`${apiURL}/cms/getFieldCheckboxById`, async (req, res) => {
  await observerAssertAuth(req, res, FieldCheckboxService, onGetFieldCheckbox);
});
// ========================= Markdown =========================   ✅ SOLVED
server.post(`${apiURL}/cms/createMarkdown`, async (req, res) => {
  await observerAssertAuth(req, res, MarkdownService, onCreateFieldMarkdown);
})
server.put(`${apiURL}/cms/updateMarkdown`, async (req, res) => {
  await observerAssertAuth(req, res, MarkdownService, onUpdateFieldMarkdown);
})
server.delete(`${apiURL}/cms/removeMarkdown`, async (req, res) => {
  await observerAssertAuth(req, res, MarkdownService, onDeleteFieldMarkdown);
})
server.get(`${apiURL}/cms/getMarkdownById`, async (req, res) => {
  await observerAssertAuth(req, res, MarkdownService, onGetFieldMarkdown);
})
// ========================= Media =========================   ✅ SOLVED
server.post(`${apiURL}/cms/uploadMedia`, async (req, res) => {
  await observerAssertAuth(req, res, MediaService, onUploadMedia);
});
server.post(`${apiURL}/cms/uploadMedias`, async (req, res) => {
  await observerAssertAuth(req, res, MediaService, onUploadMedias);
})
server.put(`${apiURL}/cms/updateMetaDataMedia`, async (req, res) => {
  await observerAssertAuth(req, res, MediaService, onUpdateMetaData);
})
server.delete(`${apiURL}/cms/deleteMedia`, async (req, res) => {
  await observerAssertAuth(req, res, MediaService, onRemoveMedia);
});
server.get(`${apiURL}/cms/getDataMedia`, async (req, res) => {
  await observerAssertAuth(req, res, MediaService, onGetMediaById)
});


server.listen(4760, function () {
  console.log("Server has been listened");
});
