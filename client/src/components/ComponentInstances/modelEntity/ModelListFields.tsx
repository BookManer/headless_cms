import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import React, { Fragment, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { ToastsStore } from 'react-toasts';
import { FieldModel } from '../../../../../service-DB/models';
import formsSchema from '../../../config/forms.schema';
import BaseGeneratorForm from '../../base/BaseGeneratorForm';
import EntityField from '../entity/EntityField';
import { TypeComponentFields } from '../../../config/enums';
import { ContextActionFields } from '../../../contexts/fieldActions.context';
import { api } from '../../../http';
import { addFieldsToNewEntity, deleteModelId } from '../../../helpers/addFieldsToNewEntity';


const ModellistFields: React.FC<any> = (props) => {
    const [doOpenPanel, togglePanel] = useState<boolean>(false);
    // Handlers
    const handlerTogglePanel = () => {
        togglePanel(!doOpenPanel);
    }
    const handlerAddField = async (dataForm: any, validForm: boolean) => {
        if (validForm) {
            const { hasBelongsEntites, belongEntities } = hasBelongedEntites();
            const field = await addFieldFromType(dataForm);
            if (hasBelongsEntites) {
                for (let entity of belongEntities) {
                    await addFieldsToNewEntity(props, { ...deleteModelId(field) }, entity.id, `modeled${entity.id}`)
                }
            } else {
                ToastsStore.warning(`Пока что нет сущностей у данной модели :(`, 5000);
            }
            togglePanel(false);
        } else {
            ToastsStore.warning("Не все поля заполнены :(");
        }
    }
    const handlerDeletedField = async (deletedField: FieldModel) => {
        // await props.fieldsStore.deleteField(deletedField.id);
        const entitiesByCurrentModel = await api.getAllEntitiesByModelId(props.match.params.id);
        for (let entity of entitiesByCurrentModel) {
            const idDeletedField = `modeled${entity.id}${deletedField.id}`;
            if (props.fieldsStore.getFieldById(idDeletedField)) {
                await props.fieldsStore.deleteField(`modeled${entity.id}${deletedField.id}`, deletedField.type);
            } else {
                ToastsStore.warning(`Не удалось  удалить поле у сущности ${entity.name}\nСущность ${entity.name} не имеет поля ${deletedField.title}`, 6000);
            }
        }
    }
    const handlerUpdatedField = async (updatedField: FieldModel) => {
        const entitiesByCurrentModel = await api.getAllEntitiesByModelId(props.match.params.id);
        for (let entity of entitiesByCurrentModel) {
            const idUpdatedField = `modeled${entity.id}${updatedField.id}`;
            if (props.fieldsStore.getFieldById(idUpdatedField)) {
                await props.fieldsStore.updateField({ ...updatedField, id: idUpdatedField }, updatedField.type)
            } else {
                ToastsStore.warning(`Не удалось обновить поле у сущности ${entity.name}\nСущность ${entity.name} не имеет поля ${updatedField.title}`, 6000);
            }
        }
    }
    const hasBelongedEntites = () => {
        const belongEntities = props.entityStore.getEntitiesByModelId(props.match.params.id);

        return {
            hasBelongsEntites: belongEntities.length,
            belongEntities,
        };
    }

    const payloadContextDefault = {
        onDeleted: handlerDeletedField,
        onUpdated: handlerUpdatedField,
        onAdded: handlerAddField,
    }
    const addFieldFromType = async (field: any) => {
        if (field.type === TypeComponentFields.List) {
            const fieldsByList = field.custom_field;
            const list_id = 'list_id' in field ? field.list_id : null;
            const newList = await props.fieldsStore.addField({ ...field, list_id, model_id: props.match.params.id })
            for (let list_item of fieldsByList) {
                console.log(await addFieldFromType({ ...list_item, model_id: props.match.params.id, list_id: newList.id }));
            }
            return newList;
        }
        return await props.fieldsStore.addField({ ...field, model_id: props.match.params.id })
    }

    return (
        <Fragment>
            <ContextActionFields.Provider value={{ ...payloadContextDefault }}>
                {props.fields?.length ?
                    props.fields.map((field) => (
                        field && <Row key={field.id}>
                            <Col>
                                <EntityField field={field}></EntityField>
                            </Col>
                        </Row>
                    )) :
                    <p>Нет полей</p>
                }
            </ContextActionFields.Provider>

            <Button onClick={handlerTogglePanel} type={"link"} icon={<PlusOutlined />} >Добавить новое поле для модели</Button>
            <Modal title="Добавить новое поле"
                footer={null}
                visible={doOpenPanel}
                onCancel={handlerTogglePanel}>
                <BaseGeneratorForm onSubmitForm={handlerAddField} schema={formsSchema.addFieldForEntity} submitButton={{ text: 'Создать' }} />
            </Modal>
        </Fragment>
    )
}

export default inject('modelsStore', 'entityStore', 'fieldsStore')(withRouter(observer(ModellistFields)));