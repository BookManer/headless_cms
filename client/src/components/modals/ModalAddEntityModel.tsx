import { Button, Modal, Tag } from 'antd';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import React, { Fragment, useState } from 'react';
import { withRouter } from 'react-router-dom';
import BaseGeneratorForm from '../base/BaseGeneratorForm';
import { TypeComponentFields } from '../../config/enums';
import { addFieldsToNewEntity, deleteModelId } from '../../helpers/addFieldsToNewEntity';

const ModalAddEntityModel: React.FC<any> = (props) => {
    const [visible, toggleVisible] = useState<boolean>(false);
    const addEntitySchema = props.schema;
    const { id } = props.group;
    // Handlers
    const handlerAddEntity = async (dataForm: object, validForm: boolean) => {
        if (validForm) {
            await createFields(dataForm);
            toggleVisible(false);
        }
    }

    const createFields = async (dataForm: object) => {
        const newEntity = await props.entityStore.addEntity({
            ...dataForm,
            model_id: props.match.params.id
        },
            id,
            [props.modelsStore.getModelById(props.match.params.id)]);
        const modelFields = props.fieldsStore.getFieldsByModelId(props.match.params.id);
        const lists = modelFields.filter(field => (field.type === TypeComponentFields.List));
        const withoutLists = modelFields.filter(field => (field.type !== TypeComponentFields.List));
        const prefix = `modeled${newEntity.id}`;
        // Сначала добавляем все списки
        for (let modelField of lists) {
            await addFieldsToNewEntity(props, deleteModelId(modelField), newEntity.id, prefix);
        }
        // Затем добавляем остальные
        for (let modelField of withoutLists) {
            await addFieldsToNewEntity(props, deleteModelId(modelField), newEntity.id, prefix);
        }
    }

    return (
        <Fragment>
            <Button type="link" onClick={() => toggleVisible(true)}>+ Добавить <Tag color="purple">({props.model.title})</Tag></Button>
            <Modal title={`Добавить новую сущность`}
                footer={null}
                visible={visible}
                onCancel={() => toggleVisible(false)}>
                <BaseGeneratorForm onSubmitForm={handlerAddEntity} schema={addEntitySchema} submitButton={{ text: "Добавить" }}></BaseGeneratorForm>
            </Modal>
        </Fragment>
    )
}

export default inject('entityStore', 'fieldsStore', 'modelsStore')(withRouter(observer(ModalAddEntityModel)));