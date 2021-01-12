import { Button, Modal } from 'antd';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import React, { Fragment, useState } from 'react';
import { FieldModel } from '../../../../service-DB/models';
import { TypeComponentFields } from '../../config/enums';
import BaseGeneratorForm from '../base/BaseGeneratorForm';
import {v4 as uuid} from 'uuid';
import { withRouter } from 'react-router-dom';
import { addFieldsToNewEntity } from '../../helpers/addFieldsToNewEntity';

const ModalAddEntity: React.FC<any> = (props) => {
    const [visible, toggleVisible] = useState<boolean>(false);
    const addEntitySchema = props.schema;
    const { id } = props.group;
    // Handlers
    const handlerAddEntity = async (dataForm: any, validForm: boolean) => {
        if (validForm) {
            const {choosed_model, ...withoutChoosedModel} = dataForm;
            const model = props.modelsStore.getModelById(choosed_model);
            const newEntity = await props.entityStore.addEntity({...withoutChoosedModel, model_id: choosed_model}, id, [model]);
            const prefix = `modeled${newEntity.id}`;
            if (choosed_model) {
                const id_model = choosed_model;
                const fieldsByModel = props.fieldsStore.getFieldsByModelId(id_model);
                const lists = fieldsByModel.filter(field => (field.type === TypeComponentFields.List));
                const withoutLists = fieldsByModel.filter(field => (field.type !== TypeComponentFields.List));
                for (let field of lists) {
                    await addFieldsToNewEntity(props, field, newEntity.id, prefix);
                }
                for (let field of withoutLists) {
                    await addFieldsToNewEntity(props, field, newEntity.id, prefix);
                }
            }
            toggleVisible(false);
        }
    }

    return (
        <Fragment>
            <Button type="link" onClick={() => toggleVisible(true)}>+ Добавить сущность</Button>
            <Modal title={`Добавить новую сущность`}
                footer={null}
                visible={visible}
                onCancel={() => toggleVisible(false)}>
                <BaseGeneratorForm onSubmitForm={handlerAddEntity} schema={addEntitySchema} submitButton={{ text: "Добавить" }}></BaseGeneratorForm>
            </Modal>
        </Fragment>
    )
}

export default inject('entityStore', 'fieldsStore', 'modelsStore')(withRouter(observer(ModalAddEntity)));