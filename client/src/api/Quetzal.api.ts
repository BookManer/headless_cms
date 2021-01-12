import BaseApi from "./base.api";
import { v4 as uuid } from "uuid";
import { TypeComponentFields } from "../config/enums";
import { MediaModel, ModelEntityModel } from "../../../service-DB/models";

let instanceAPI = null;

export default class QuetzalAPI extends BaseApi {
  constructor(payload: object) {
    super(payload);
  }

  public static Init(payload?: object) {
    if (!instanceAPI) {
      instanceAPI = new QuetzalAPI(payload);
    }

    return instanceAPI;
  }

  // Entity
  public async addEntity(payloadEntity: any) {
    return await this.post("/cms/createEntity", payloadEntity);
  }
  public async addField(payloadField: any) {
    // Custom field
    const {
      selected,
      type,
      id,
      custom_field,
      content,
      is_checked,
      name,
      nested_list,
      ...withoutExcessProperties
    } = payloadField;
    // Model database payload
    let payloadHttp = {
      id: id || uuid(),
      name,
      title: name,
      type,
      ...withoutExcessProperties,
    } as any;

    // Transform name to request field
    let withoutGeneralPrefix = type?.split("Base")[1]; // "BaseFieldCheckbox" -> "FieldCheckbox"
    let request = `/cms/create${withoutGeneralPrefix}`;
    // Select a type custom field: Checkbox, Text, List
    switch (type) {
      case TypeComponentFields.Checkbox:
        payloadHttp = {
          ...payloadHttp,
          is_checked: custom_field || is_checked ? 1 : 0,
        };
        break;
      case TypeComponentFields.Text:
        payloadHttp = { ...payloadHttp, content: custom_field || content };
      case TypeComponentFields.List:
        const { custom_field: items_list, ...other } = payloadHttp;
        payloadHttp = { ...other };
    }

    return await this.post(request, { ...payloadHttp }); // создать новое поле в БД
  }
  public async updateField(
    payloadField: any,
    typeComponentFields: TypeComponentFields
  ) {
    let payloadHttp = {};
    let { id, required, name, custom_field } = payloadField;
    let withoutGeneralPrefix = typeComponentFields.split("Base")[1]; // "BaseFieldCheckbox" -> "FieldCheckbox"
    let request = `/cms/update${withoutGeneralPrefix}`;
    let value: string | boolean;
    switch (typeComponentFields) {
      case TypeComponentFields.Checkbox:
        if ("is_checked" in payloadField) {
          value = payloadField.is_checked;
        } else {
          value = custom_field;
        }
        break;
      case TypeComponentFields.Text:
        value = payloadField.content || custom_field;
        break;
    }
    console.log(value, payloadField);

    if (typeComponentFields === TypeComponentFields.Text) {
      payloadHttp = { id, content: value, name };
    } else if (typeComponentFields === TypeComponentFields.Checkbox) {
      payloadHttp = { id, is_checked: value, name };
    } else if (typeComponentFields === TypeComponentFields.List) {
      payloadHttp = { id, name };
    }

    return await this.update(request, { ...payloadHttp, required });
  }
  public async deleteField(
    field_id: string,
    typeComponentFields: TypeComponentFields
  ) {
    let withoutGeneralPrefix = typeComponentFields.split("Base")[1]; // "BaseFieldCheckbox" -> "FieldCheckbox"
    let request = `/cms/delete${withoutGeneralPrefix}`;
    return this.delete(request, { id: field_id });
  }
  public async deleteEntity(entity_id: string) {
    const request = "/cms/deleteEntity";
    return this.delete(request, { id: entity_id });
  }
  public async addSyncEntityWithModel(taxonomyPayload: {
    id_entity: string;
    id_model: string;
  }) {
    return this.post("/cms/addSyncEntityWithModel", taxonomyPayload);
  }
  // End Entity

  // Model
  public async getAllEntitiesByModelId(model_id: string) {
    return await this.get("/cms/getAllEntitiesByModelId", { id: model_id });
  }
  public async addModel(payloadModel: ModelEntityModel) {
    return await this.post("/cms/createModel", {
      id: uuid(),
      date_created: new Date(Date.now()),
      date_last_updated: new Date(Date.now()),
      ...payloadModel,
    });
  }
  public async updateModel(payloadUpdatedModel: object | ModelEntityModel) {
    return await this.update("/cms/updateModel", payloadUpdatedModel);
  }
  public async deleteModel(id: string) {
    return await this.delete("/cms/deleteModel", { id });
  }
  public async getAllModels() {
    return this.get("/cms/getAllModels", null);
  }
  // End Model

  // Media
  public async uploadMedia(
    payload: MediaModel,
    formData: FormData,
    options?: object
  ) {
    return await this.instanceAPI.post("/cms/uploadMedia", formData, {
      params: { ...payload },
      headers: {
        "Content-Type": "multipart/form-data;",
      },
    });
  }
  public async uploadMedias(payload: MediaModel[], formData: FormData, options?: object) {
    return await this.instanceAPI.post("/cms/uploadMedias", formData, {
      params: { medias: JSON.stringify(payload) },
      headers: {
        "Content-Type": "multipart/form-data;",
      },
    })
  }
  // End Media
}
