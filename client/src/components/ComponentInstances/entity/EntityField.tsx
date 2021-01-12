// React
import React, { Fragment, useState, useMemo, useContext } from 'react';
import { withRouter } from 'react-router-dom';
// Ant Design UI lib
import { Button, Checkbox, Col, Collapse, Input, Popconfirm, Row, Tag } from 'antd';
import Modal from 'antd/lib/modal/Modal';
// Enums
import { TypeComponentFields } from '../../../config/enums';
// Forms
import formsSchema from '../../../config/forms.schema';
import BaseGeneratorForm from '../../base/BaseGeneratorForm';
// Fields for calculate custom field
import { BaseFieldCheckbox } from '../../base/BaseFieldCheckbox';
import { BaseFieldText } from '../../base/BaseFieldText';
// Mobx-react
import { inject, observer } from 'mobx-react';
import { ToastsStore } from 'react-toasts';
import BaseList from '../../base/BaseList';
import FieldCheckbox from '../InteractiveDisplayFields/FieldCheckbox';
import FieldTextLine from '../InteractiveDisplayFields/FieldTextLine';
import FieldList from '../InteractiveDisplayFields/FieldList';
import { ContextActionFields } from '../../../contexts/fieldActions.context';
import { FieldModel } from '../../../../../service-DB/models';

const { Panel } = Collapse;

const EntityField: React.FC<any> = (props) => {
    // Assertion state
    const [doOpenPanel, changePanel] = useState(false);
    const { field, lightDisplaying } = props;
    const schema = formsSchema.editField;
    const fieldActionContext = useContext(ContextActionFields);

    // Handlers
    const handlerTogglePanel = () => {
        changePanel(!doOpenPanel);
    }
    const handlerSubmitForm = async (dataForm: object, validForm: boolean) => {
        try {
            if (validForm) {
                await props.entityStore.updateField({ ...dataForm, id: field.id }, whatIsComponentByProperties, props.match.params.id);
                changePanel(false);
            } else {
                changePanel(false);
                ToastsStore.warning('Нужно заполнить все обязательные поля')
            }
        } catch (e) {
            changePanel(false);
        }
    }
    const handlerAcceptRemoveField = async () => {
        const deletedField = await props.fieldsStore.deleteField(field.id, whatIsComponentByProperties);
        if ('onDeleted' in fieldActionContext) {
            fieldActionContext.onDeleted(deletedField);
        }
    }

    // Helper methods
    const renderCustomField = () => {
        switch (whatIsComponentByProperties) {
            case TypeComponentFields.Checkbox:
                return <FieldCheckbox field={field} />
            case TypeComponentFields.Text:
                return <FieldTextLine field={field} />;
            case TypeComponentFields.List:
                return (
                    <FieldList field={field}></FieldList>
                );
        }
    }
    const whatIsComponentByProperties = useMemo(() => {
        if (field?.type) {
            return field?.type;
        }

        if ('is_checked' in field) {
            return TypeComponentFields.Checkbox;
        } else if ('content' in field) {
            return TypeComponentFields.Text;
        } else {
            return TypeComponentFields.List;
        }
    }, [field]);
    const initSchemaWithCustomField = () => {
        let customReactComponent = null;
        let defaultValue: string | boolean | object[];
        switch (whatIsComponentByProperties) {
            case TypeComponentFields.Text:
                customReactComponent = BaseFieldText;
                defaultValue = field.content;
                break;
            case TypeComponentFields.Checkbox:
                customReactComponent = BaseFieldCheckbox;
                defaultValue = field.is_checked;
                break;
            case TypeComponentFields.List:
                customReactComponent = BaseList;
        }

        schema.fields[0] = schema.fields[0].interceptorParams({
            component: customReactComponent,
            defaultValue: defaultValue
        }) as any;
        return schema;
    }

    return (!field?.list_id || props.nested_list) ? (<Fragment>
        <h3>
            {!lightDisplaying && field.name}
            {!lightDisplaying && <Tag color={field.required ? "red" : "green"}>{field.required ? "Обязательно" : "Не обязательно"}</Tag>}
        </h3>
        <Row>
            <Col>{renderCustomField()}</Col>
            <Col>
                <Popconfirm title={`Вы правда хотите удалить?`}
                    onConfirm={handlerAcceptRemoveField}>
                    <Button danger type="link">Удалить</Button>
                </Popconfirm>
            </Col>
        </Row>
    </Fragment>
    ) : null;
}

export default inject('entityStore', 'fieldsStore')(withRouter(observer(EntityField)));