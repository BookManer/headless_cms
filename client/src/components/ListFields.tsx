import React, { Fragment, useEffect, useState, useContext } from 'react';
import { inject, observer } from 'mobx-react';
import { FieldModel } from '../../../service-DB/models';
import { Button, Popover } from 'antd';
import BaseGeneratorForm from './base/BaseGeneratorForm';
import formsSchema from '../config/forms.schema';
import { ToastsStore } from 'react-toasts';
import { withRouter } from 'react-router-dom';
import EntityField from './ComponentInstances/entity/EntityField';
import BaseList from './base/BaseList';
import { v4 as uuid } from 'uuid';
import { TypeComponentFields } from '../config/enums';

let newList = null;
const ListFields: React.FC<any> = (props: any) => {
    const [items, changeItems] = useState<any[]>([]);
    useEffect(() => {
        return () => {
            newList = null;
        }
    })

    // Handlers
    const handlerAddElementList = async (dataForm: any, validForm: boolean) => {
        try {
            if (validForm) {
                console.log(dataForm);
                let item = {
                    ...dataForm,
                    nested_list: false,
                    list_id: props.field.id,
                }
                changeItems([...items, item]);
                props.emmit({ name: props.field.attrs.name, value: [...items, item], valid: true });
                ToastsStore.success(`Успешно добавлен ${dataForm.name}`);
            } else {
                ToastsStore.warning('Заполните все поля');
            }
        } catch (e) {
            ToastsStore.error(e.message);
        }
    }
    const handlerElementList = async (deletedId: string) => {
        changeItems(items.filter(item => item.id !== deletedId));
    }

    return (
        <Fragment>
            <BaseList items={items} onDeleteField={handlerElementList}></BaseList>
            <Popover title="Добавить элемент" content={(<BaseGeneratorForm schema={formsSchema.addFieldForEntity} onSubmitForm={handlerAddElementList} submitButton={{ text: 'Добавить' }} />)}>
                <Button type="link">Добавить элемент списка</Button>
            </Popover>
        </Fragment>
    )
}

export default inject('entityStore', 'fieldsStore')(withRouter(observer(ListFields)));