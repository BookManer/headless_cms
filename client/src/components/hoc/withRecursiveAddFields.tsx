import React from 'react';
import { FieldModel } from '../../../../service-DB/models';
import { TypeComponentFields } from '../../config/enums';

const withRecursiveAddFields = (Component, doDeleteModelId: boolean) => {
    return (props) => {
        const deleteModelId = (field: FieldModel) => {
            const { model_id, ...withoutModel } = field;
            return withoutModel;
        }
    
        const addFieldsToNewEntity = async (field: any, entity_id: string, prefix: string) => {
            if (field.type === TypeComponentFields.List) {
                field = doDeleteModelId ? deleteModelId(field) : field;
                const fieldsByList = props.fieldsStore.getFieldsByListId(field.id);
                const list_id = field.list_id ? `${prefix}${field.list_id}` : null;
                await props.fieldsStore.addField({ ...deleteModelId(field), id: `${prefix}${field.id}`, list_id, entity_id })
                for (let list_item of fieldsByList) {
                    const withoutModel = deleteModelId(list_item);
                    const list_id = list_item.list_id ? `${prefix}${field.list_id}` : null;
                    await addFieldsToNewEntity({ ...withoutModel, list_id }, entity_id, prefix);
                }
                return;
            }
    
            const list_id = field.list_id ? `${prefix}${field.list_id}` : null;
            await props.fieldsStore.addField({ ...deleteModelId(field), id: `${prefix}${field.id}`, list_id, entity_id })
        }

        return <Component {...props} />
    }
}

export default withRecursiveAddFields;