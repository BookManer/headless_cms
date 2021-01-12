import { observable, action, computed, makeAutoObservable } from "mobx";
import { ToastsStore } from "react-toasts";
import { ModelEntityModel } from "../../../service-DB/models/index";
import QuetzalAPI from "../api/Quetzal.api";
import { v4 as uuid } from "uuid";

const api = QuetzalAPI.Init();

interface PayloadUpdatedModel extends ModelEntityModel {}
type AdditionalFieldModel = {
  id?: string;
  is_required?: boolean | number;
  is_checked?: boolean;
  name_field?: string;
  custom_field?: string;
  placeholder_field?: string;
  model_id?: string;
};

export class ModelStore {
  @observable public models: ModelEntityModel[] = [];

  constructor() {
    if (!this.models.length) {
      this.initModels();
    }
    makeAutoObservable(this);
  }

  // Computeds
  @computed get getModelById() {
    return (idFoundedModel: string) =>
      this.models?.find((model) => model.id === idFoundedModel);
  }
  @computed get getFieldsByModel() {
    console.log(this.models);
    return (id_model: string) =>
      this.models?.find((model) => model.id === id_model)?.fields;
  }

  // Actions
  @action async initModels() {
    try {
      const newModels = (await api.getAllModels()) as ModelEntityModel[];
      this.models = newModels;
      // console.log(newModels);
      // const modelsWithEntities = [];
      // for (let model in newModels) {
      //     const modelWithEntities = await api.getAllEntitiesByModelId(model.id);
      //     modelsWithEntities.push();
      // }
    } catch (e) {
      ToastsStore.error(e?.message);
    }
  }
  @action async addField(payloadField: AdditionalFieldModel) {
    const newField = await api.addField(payloadField, null);
    const modelById = this.getModelById(payloadField?.model_id);
    if (modelById) {
      this.models = this.models.map((model) => {
        if (model.id === modelById.id) {
          if (!model.fields) {
            model.fields = [];
          }
          model.fields.push(newField);
        }

        return model;
      });
    }

    return newField;
  }
  @action async addModel(payloadModel: ModelEntityModel) {
    try {
      const newModel = await api.addModel({ ...payloadModel });
      this.models.push(newModel);
      ToastsStore.success(`Модель "${newModel.title}" успешно создана`);

      return newModel;
    } catch (e) {
      ToastsStore.error(e?.message);
    }
  }
  @action async updateModel(
    payloadUpdatedModel: PayloadUpdatedModel,
    modelId: string
  ) {
    try {
      const updatedModel = await api.updateModel({ ...payloadUpdatedModel });
      this.models = this.models.map((model) => {
        if (model.id === updatedModel.id) {
          model = updatedModel;
        }
        return model;
      });
    } catch (e) {
      ToastsStore.error(e?.message);
    }
  }
  @action async deleteModel(id: string) {
    try {
      const deletedModel = await api.deleteModel(id);
      this.models = this.models.filter((model) => model.id !== deletedModel.id);
      ToastsStore.success(`Модель "${deletedModel.title}" успешно удалена`);

      return deletedModel;
    } catch (e) {
      ToastsStore.error(e?.message);
    }
  }
}
