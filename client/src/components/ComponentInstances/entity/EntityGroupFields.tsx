import { Button, Modal, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { Fragment, useState } from 'react';
import schemas from '../../../config/forms.schema';
import BaseGeneratorForm from '../../base/BaseGeneratorForm';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import EntityField from './EntityField';
import { ToastsStore } from 'react-toasts';
import { TypeComponentFields } from '../../../config/enums';
import { withRouter } from 'react-router-dom';

const EntityGroupFields: React.FC<any> = (props) => {
    const [doOpenPanel, togglePanel] = useState(false);

    const handlerTogglePanel = () => {
        togglePanel(!doOpenPanel);
    }
    const handlerSubmitForm = async (dataForm: any, validForm: boolean) => {
        try {
            if (validForm) {
                await addFieldFromType({ ...dataForm, entity_id: props.match.params.id});
            }
            handlerTogglePanel(); // закрыть модалку
        } catch (e) {
            console.log(e);
        }
    }

    const addFieldFromType = async (field: any) => {
        if (field.type === TypeComponentFields.List) {
            const fieldsByList = field.custom_field;
            const list_id = field.list_id ? field.list_id : null;
            const newList = await props.fieldsStore.addField({ ...field, id: field.id, list_id })
            for (let list_item of fieldsByList) {
                await addFieldFromType({ ...list_item, entity_id: field.entity_id, list_id: `${newList.id}`});
            }
            return;
        }
        await props.fieldsStore.addField({ ...field, id: field.id, list_id: field.list_id })
    }

    return (
        <Fragment>
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
            <Button onClick={handlerTogglePanel} type={"link"} icon={<PlusOutlined />} >Добавить новое поле</Button>
            <Modal title="Добавить новое поле"
                footer={null}
                visible={doOpenPanel}
                onCancel={handlerTogglePanel}>
                <BaseGeneratorForm onSubmitForm={handlerSubmitForm} schema={schemas.addFieldForEntity} submitButton={{ text: 'Создать' }} />
            </Modal>

        </Fragment>
    )
}

export default inject('entityStore', 'fieldsStore')(withRouter(observer(EntityGroupFields)));