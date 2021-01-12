import { FieldModel } from "../../../service-DB/models";
import { TypeComponentFields } from "../config/enums";

export const addFieldsToNewEntity = async (props, field: any, entity_id: string, prefix: string) => {
    if (field.type === TypeComponentFields.List) {
        const fieldsByList = field.custom_field ? field.custom_field : props.fieldsStore.getFieldsByListId(field.id);
        let list_id = field.list_id ? `${prefix}${field.list_id}` : null;
        await props.fieldsStore.addField({ ...deleteModelId(field), id: `${prefix}${field.id}`, list_id, entity_id })
        for (let list_item of fieldsByList) {
            const withoutModel = deleteModelId(list_item);
            const list_id = field.list_id? `${field.list_id}` : null;
            await addFieldsToNewEntity(props, { ...withoutModel, list_id }, entity_id, prefix);
        }
        return;
    }

    const list_id = field.list_id ? `${prefix}${field.list_id}` : null;
    await props.fieldsStore.addField({ ...deleteModelId(field), id: `${prefix}${field.id}`, list_id, entity_id })
}

export const deleteModelId = (field: FieldModel) => {
    const { model_id, ...withoutModel } = field;
    return withoutModel;
}