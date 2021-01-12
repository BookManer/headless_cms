import { Button, Input } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { inject } from 'mobx-react';
import React, { Fragment, useContext, useState } from 'react';
import formsSchema from '../../../config/forms.schema';
import { BaseFieldText } from '../../base/BaseFieldText';
import BaseGeneratorForm from '../../base/BaseGeneratorForm';
import { TypeComponentFields } from '../../../config/enums';
import { observer } from 'mobx-react-lite';
import { withRouter } from 'react-router-dom';
import { ToastsStore } from 'react-toasts';
import { ContextActionFields } from '../../../contexts/fieldActions.context';

const FieldTextLine: React.FC<any> = (props) => {
    const [doOpenPanel, togglePanel] = useState<boolean>(false);
    const { content, name, custom_field } = props.field;
    const fieldActionContext = useContext(ContextActionFields);

    const initSchema = () => {
        formsSchema.editField.fields[0].component = BaseFieldText;
        formsSchema.editField.fields[0].defaultValue = content;
        formsSchema.editField.fields[1].defaultValue = name;
        return formsSchema.editField;
    }

    const handlerSubmitForm = async (dataForm: object, validForm: boolean) => {
        if (validForm) {
            const updatedField = await props.fieldsStore.updateField({ ...dataForm, id: props.field.id }, TypeComponentFields.Text);
            fieldActionContext.onUpdated(updatedField);
            togglePanel(false);
        } else {
            ToastsStore.warning('Не все поля заполнены');
        }
    }

    return (
        <Fragment>
            <Input value={content || custom_field} onChange={() => false}></Input>
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

export default inject('entityStore', 'fieldsStore')(withRouter(observer(FieldTextLine)));