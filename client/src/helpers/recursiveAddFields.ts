import { FieldModel } from "../../../service-DB/models";
import { TypeComponentFields } from "../config/enums";

export const addFieldsTo = async (props, field: any, id, prefix: string) => {
  const belongs = whatIsTypeEntity(props.match);
  field = !isTypeEqualsToModel ? deleteModelId(field) : field;
  // Если поле является списком
  if (field.type === TypeComponentFields.List) {
    let fieldsByList = props.fieldsStore.getFieldsByListId(field.id);
    const list_id = field.list_id ? `${prefix}${field.list_id}` : null;
    await props.fieldsStore.addField({
      ...field,
      id: `${prefix}${field.id}`,
      list_id,
      ...belongs,
    });
    for (let list_item of fieldsByList) {
      const { model_id, ...withoutModel } = list_item;
      const list_id = list_item.list_id ? `${prefix}${field.list_id}` : null;
      await addFieldsTo(props, { ...withoutModel, list_id }, id, prefix);
    }
    return;
  }

  // Если у поля есть список прикрепляем его к новому списку
  const { model_id, ...withoutModel } = field;
  const list_id = field.list_id ? `${prefix}${field.list_id}` : null;
  await props.fieldsStore.addField({
    ...withoutModel,
    id: `${prefix}${field.id}`,
    list_id,
    ...belongs,
  });
};

const deleteModelId = (field: FieldModel) => {
  const { model_id, ...withoutModel } = field;
  return withoutModel;
};

export const whatIsTypeEntity = ({path, params: { id }}) => {
  const belongs = isTypeEqualsToModel(path)
    ? { model_id: id }
    : { entity_id: id };

  return belongs;
};

export const isTypeEqualsToModel = (path) => {
  return /\/models\//.test(path);
};
