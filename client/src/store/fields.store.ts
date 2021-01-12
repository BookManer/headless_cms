import { action, computed, makeAutoObservable, observable } from "mobx";
import { FieldModel } from "../../../service-DB/models";
import { TypeComponentFields } from "../config/enums";
import { api } from "../http";

interface AdditionalFieldModel {
  id?: string;
  required?: boolean | number;
  checked?: boolean;
  name?: string;
  custom_field?: string;
  placeholder?: string;
  entity_id?: string;
  list_id?: string;
  model_id?: string;
}

export class FieldsStore {
  @observable public fields: FieldModel[] = [];

  constructor() {
    if (!this.fields.length) {
      this.initAllFields();
    }
    makeAutoObservable(this);
  }

  // Computed
  @computed get getFieldById() {
    return (id: string) => (
      this.fields.find(field => field.id === id)
    )
  }
  @computed get getFieldsByEntityId() {
    return (entity_id: string) =>
      this.fields.filter((field) => field.entity_id === entity_id);
  }
  @computed get getFieldsByModelId() {
    return (model_id: string): FieldModel[] =>
      this.fields?.filter((field) => field.model_id === model_id);
  }
  @computed get getFieldsByListIdEntity() {
    return (list_id: string, entity_id: string) =>
      this.fields.filter((field) => (field.list_id === list_id && field.entity_id === entity_id));
  }
  @computed get getFieldsByListId() {
      return (list_id: string, id: string) => {
        return Array.from(this.fields).filter((field) => (field.list_id === list_id && (field.model_id === id || field.entity_id === id)))
      }
  }
  @computed get getFieldsByListIdModel() {
    return (list_id: string, model_id: string) =>
      this.fields.filter((field) => (field.list_id === list_id && field.model_id === model_id));
  }

  // Actions
  @action async initAllFields() {
    const fields = await api.get("/cms/getAllFields");
    this.fields = fields;
  }
  @action async addField(payloadAddtionalField: AdditionalFieldModel) {
    const newField = await api.addField(payloadAddtionalField);
    this.fields.push({ ...newField });

    return newField;
  }
  @action async updateField(
    payloadUpdatedField: any,
    typeComponentFields: TypeComponentFields
  ) {
    const updatedField = await api.updateField(
      payloadUpdatedField,
      typeComponentFields
    );
    this.fields = this.fields.map((field) => {
      if (payloadUpdatedField.id === field.id) {
        field = { ...updatedField };
      }
      return field;
    });

    return updatedField;
  }
  @action async deleteField(
    id: string,
    typeComponentFields: TypeComponentFields
  ) {
    const deletedField = await api.deleteField(id, typeComponentFields);
    this.fields = this.fields.filter((field) => field.id !== deletedField.id);

    return deletedField;
  }
}
