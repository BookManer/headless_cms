import { observable, action, computed, makeAutoObservable } from "mobx";
import { ToastsStore } from "react-toasts";
import {
  GroupEntityModel,
  EntityWithFieldsModel,
  ModelEntityModel,
} from "../../../service-DB/models/index";
import QuetzalAPI from "../api/Quetzal.api";
import { TypeComponentFields } from "../config/enums";
import { v4 as uuid } from "uuid";

const api = QuetzalAPI.Init();

type AdditionalFieldModel = {
  id?: string;
  is_required?: boolean | number;
  is_checked?: boolean;
  name_field?: string;
  custom_field?: string;
  placeholder_field?: string;
};

export class EntityStore {
  @observable public entities: EntityWithFieldsModel[] = [];
  @observable public groupsEntity: GroupEntityModel[] = [];

  constructor() {
    try {
      if (!this.entities.length && !this.groupsEntity.length) {
        this.initEntity();
        this.initGroupEntity();
      }
      makeAutoObservable(this);
    } catch (e) {}
  }

  // COMPUTEDS
  @computed get entitiesByGroupId() {
    return (group_id: string) => {
      const res = this.entities.length
        ? this.entities?.filter((entity) => entity.group_id === group_id)
        : [];
      return res;
    };
  }
  @computed get getEntityById() {
    return (id: string) => {
      return this.entities.length
        ? this.entities.find((entity) => entity.id === id)
        : null;
    };
  }
  @computed get getFieldsByEntityId(): (
    id: string
  ) => EntityWithFieldsModel[] | object[] {
    return (id) => {
      if (this.entities.length) {
        const entity = this.entities.find((entity) => entity.id === id);
        return entity.fields;
      }
      return [];
    };
  }
  @computed get getFieldsByListId() {
    return (list_id: string, entity_id: string) => {
      if (this.entities?.length) {
        const entity = this.entities.find((entity) => entity.id === entity_id);
        return entity?.fields?.filter((field) => field?.list_id === list_id);
      }
    };
  }
  @computed get getEntitiesByModelId() {
    return (model_id: string) =>
      this.entities?.filter((entity) =>
        entity.models?.some((model) => model.id === model_id)
      );
  }

  // ACTIONS
  @action async addEntity(payloadEntity, group_id: string, models: ModelEntityModel[] | any[]) {
    const {model_id, ...withoutModelIdPayload} = payloadEntity;
    const addedEntity = await api.addEntity({
      id: uuid(),
      date_created: new Date(Date.now()),
      date_last_updated: new Date(Date.now()),
      ...withoutModelIdPayload,
      group_id,
    });

    if (model_id) {
      await api.post('/cms/addSyncEntityWithModel', {
            id_entity: addedEntity.id,
            id_model: model_id,
      });
    }
    this.entities.push({ ...addedEntity, models });

    return addedEntity;
  }
  @action async initEntity() {
    try {
      let entities = await api.get("cms/getAllEntities");
      let entitiesWithFields = [];

      for (let entity of entities) {
        let models = await api.get("cms/getAllModelsByEntityId", {
          id: entity.id,
        });
        entitiesWithFields.push({ ...entity, models });
      }

      this.entities = entitiesWithFields;
      ToastsStore.success("Сущности и поля добавлены!");
    } catch (e) {
      ToastsStore.error("Сущности и поля не добавлены");
    }
  }
  @action async addField(
    payloadField: AdditionalFieldModel,
    entity_id: string
  ) {
    const newField = await api.addField(payloadField, entity_id);
    const entityById = entity_id && this.getEntityById(entity_id);
    if (entityById) {
      this.entities = this.entities.map((entity) => {
        if (entity.id === entityById.id) {
          if (!entity.fields) {
            entity.fields = [];
          }
          entity.fields.push(newField);
        }

        return entity;
      });
    }

    return newField;
  }
  @action async updateField(
    payloadField: any,
    typeComponentFields: TypeComponentFields,
    entity_id: string
  ) {
    const updatedField = await api.updateField(
      payloadField,
      typeComponentFields
    );
    this.entities = this.entities.map((entity) => {
      if (entity.id === entity_id) {
        entity.fields = entity.fields.map((field) => {
          if (field.id === payloadField.id) {
            field = { ...updatedField };
          }
          return field;
        });
      }
      return entity;
    });
  }
  @action async deleteField(
    field_id: string,
    entity_id: string,
    typeComponentFields: TypeComponentFields
  ) {
    await api.deleteField(field_id, typeComponentFields);
    this.entities = this.entities.map((entity) => {
      if (entity.id === entity_id) {
        entity.fields = entity.fields.filter(
          (field) => !(field.id === field_id)
        );
      }
      return entity;
    });
  }
  @action async deleteEntity(entity_id: string) {
    await api.deleteEntity(entity_id);
    this.entities = this.entities.filter((entity) => entity.id !== entity_id);
  }

  @action initGroupEntity() {
    api.get("cms/getAllGroup").then((data) => {
      this.groupsEntity = data;
      ToastsStore.warning(
        `Groups store inited: ${this.groupsEntity
          ?.map((group) => group.title)
          .join(", ")}`
      );
    });
  }
}

