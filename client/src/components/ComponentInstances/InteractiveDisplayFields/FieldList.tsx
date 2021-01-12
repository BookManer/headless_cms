import { Button, Collapse } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { inject } from 'mobx-react';
import React, { Fragment, useContext, useState } from 'react';
import formsSchema from '../../../config/forms.schema';
import BaseGeneratorForm from '../../base/BaseGeneratorForm';
import { TypeComponentFields } from '../../../config/enums';
import { observer } from 'mobx-react-lite';
import { withRouter } from 'react-router-dom';
import { ToastsStore } from 'react-toasts';
import BaseList from '../../base/BaseList';
import { ContextActionFields } from '../../../contexts/fieldActions.context';
const { Panel } = Collapse;

const FieldList: React.FC<any> = (props) => {
    const [doOpenPanel, togglePanel] = useState<boolean>(false);
    const fieldActionContext = useContext(ContextActionFields);
    const { field } = props;
    const { name } = field;

    const initSchema = () => {
        formsSchema.editFieldList.fields[0].defaultValue = name;
        return formsSchema.editFieldList;
    }

    const handlerSubmitForm = async (dataForm: object, validForm: boolean) => {
        if (validForm) {
            const updatedField = await props.fieldsStore.updateField({ ...dataForm, value: undefined, id: field.id }, TypeComponentFields.List);
            if ('onUpdated' in fieldActionContext) {
                fieldActionContext.onUpdated(updatedField);
            }
            togglePanel(false);
        } else {
            ToastsStore.warning('Не все поля заполнены');
        }
    }

    return (
        <Fragment>
            <Collapse>
                <Panel header={field.name} key={field.id}>
                    <BaseList items={field.custom_field || props.fieldsStore.getFieldsByListId(field.id, props.match.params.id)} onDeleted={(field) => props.onDeleted(field)} field={field}></BaseList>
                </Panel>
            </Collapse>
            <Button type="link" onClick={() => togglePanel(true)}>Редактировать</Button>
            <Modal title={`Редактировать поле "${props.field.name}"`}
                footer={null}
                visible={doOpenPanel}
                onCancel={() => togglePanel(false)}>
                <BaseGeneratorForm onSubmitForm={handlerSubmitForm} schema={initSchema()} submitButton={{ text: 'Применить' }} />
            </Modal>
        </Fragment>
    )
}

export default inject('entityStore', 'fieldsStore')(withRouter(observer(FieldList)));