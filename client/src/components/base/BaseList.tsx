import { Button, Popover, Table, Tag } from 'antd';
import { inject, observer } from 'mobx-react';
import React, { Fragment, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { ToastsStore } from 'react-toasts';
import { TypeComponentFields } from '../../config/enums';
import formsSchema from '../../config/forms.schema';
import { ContextActionFields } from '../../contexts/fieldActions.context';
import { whatIsTypeEntity, isTypeEqualsToModel } from '../../helpers/recursiveAddFields';
import EntityField from '../ComponentInstances/entity/EntityField';
import BaseGeneratorForm from './BaseGeneratorForm';

const BaseList: React.FC<any> = (props) => {
    const contextActionFields = useContext(ContextActionFields);
    let { items } = props;
    const columns = [{
        title: 'Field',
        dataIndex: 'fieldDisplay',
        key: 'fieldDisplay',
        render: (field) => (<EntityField field={field} lightDisplaying nested_list={true} />),
    }, {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: "Required",
        dataIndex: 'required',
        key: 'required',
        render: (is_required) => (<Tag color={is_required ? 'red' : 'green'}>{is_required ? 'Обазятельно' : 'Не обязательно'}</Tag>),
    }]
    items = items.map(field => ({ fieldDisplay: field, name: field.name, required: field.required }))

    const handleAddedElement = async (element: any, validForm: boolean) => {
        if (validForm) {
            try {
                const belongPayload = whatIsTypeEntity(props.match);
                if (isTypeEqualsToModel(props.match.path)) {
                    contextActionFields.onAdded({ ...element, list_id: props.field.id, ...belongPayload }, validForm);
                } else {
                    await addFieldFromType({ ...element, list_id: props.field.id, ...belongPayload });
                }
            } catch (e) {
                ToastsStore.error(`Почему-то не удалось создать поле :(\nПопробуйте ещё раз или перезагрузите страницу.\n${e.message}`);
            }
        } else {
            ToastsStore.warning('Заполните все поля');
        }
    }
    const addFieldFromType = async (field: any) => {
        if (field.type === TypeComponentFields.List) {
            const fieldsByList = field.custom_field;
            const list_id = field.list_id ? field.list_id : null;
            const newList = await props.fieldsStore.addField({ ...field, id: field.id, list_id, model_id: props.match.params.id })
            for (let list_item of fieldsByList) {
                await addFieldFromType({ ...list_item, model_id: props.match.params.id, list_id: `${newList.id}` });
            }
            return newList;
        }
        return await props.fieldsStore.addField({ ...field, id: field.id, list_id: field.list_id, model_id: props.match.params.id })
    }
    // const addFieldFromType = async (field: any, belongPayload: object) => {
    //     if (field.type === TypeComponentFields.List) {
    //         const fieldsByList = field.custom_field;
    //         const notList = fieldsByList.filter(field => field.type !== TypeComponentFields.List);
    //         const fieldsList = fieldsByList.filter(field => field.type === TypeComponentFields.List);
    //         const list_id = field.list_id ? field.list_id : null;
    //         const newList = await props.fieldsStore.addField({ ...field, id: field.id, list_id })

    //         for (let list_item of fieldsList) {
    //             await addFieldFromType({ ...list_item, list_id: newList.id }, belongPayload);
    //         }
    //         for (let list_item of notList) {
    //             await addFieldFromType({ ...list_item, list_id: newList.id }, belongPayload);
    //         }

    //         return;
    //     }
    //     await props.fieldsStore.addField({ ...field, id: field.id, list_id: field.list_id, ...belongPayload })
    // }

    return (
        <Fragment>
            <Table columns={columns} dataSource={items}></Table>
            <Popover title="Добавить элемент" content={(<BaseGeneratorForm schema={formsSchema.addFieldForEntity} onSubmitForm={handleAddedElement} submitButton={{ text: 'Добавить' }} />)}>
                { props.field?.id ? <Button type="link">Добавить элемент</Button> : null}
            </Popover>
        </Fragment>
    );
}

export default inject('entityStore', 'fieldsStore')(withRouter(observer(BaseList)));