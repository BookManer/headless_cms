import { Button, Switch } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { inject } from 'mobx-react';
import React, { Fragment, useContext, useState } from 'react';
import formsSchema from '../../../config/forms.schema';
import { BaseFieldCheckbox } from '../../base/BaseFieldCheckbox';
import BaseGeneratorForm from '../../base/BaseGeneratorForm';
import { TypeComponentFields } from '../../../config/enums';
import { observer } from 'mobx-react-lite';
import { withRouter } from 'react-router-dom';
import { ToastsStore } from 'react-toasts';
import { ContextActionFields } from '../../../contexts/fieldActions.context';

const FieldCheckbox: React.FC<any> = (props) => {
    const { is_checked, custom_field, title, name } = props.field;
    const [doOpenPanel, togglePanel] = useState<boolean>(false);
    const fieldActionContext = useContext(ContextActionFields);

    const initSchema = () => {
        formsSchema.editField.fields[0].component = BaseFieldCheckbox;
        formsSchema.editField.fields[0].defaultValue = is_checked;
        formsSchema.editField.fields[1].defaultValue = name;
        return formsSchema.editField;
    }
    const handlerSubmitForm = async (dataForm: object, validForm: boolean) => {
        if (validForm) {
            const updatedField = await props.fieldsStore.updateField({
                ...dataForm,
                id: props.field.id
            },
                TypeComponentFields.Checkbox);
            if ('onUpdated' in fieldActionContext) {
                fieldActionContext.onUpdated(updatedField);
            }
            togglePanel(false);
            ToastsStore.success(`Все поля заполнены!\n${Object.keys(dataForm).map(key => key).join(', ')}`);
        } else {
            ToastsStore.warning(`Не все поля заполнены!\n${Object.keys(dataForm).map(key => key).join(', ')}`);
        }
    }

    return (
        <Fragment>
            <Switch checked={is_checked || custom_field} onChange={() => false}></Switch>
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

export default inject('entityStore', 'fieldsStore')(withRouter(observer(FieldCheckbox)));