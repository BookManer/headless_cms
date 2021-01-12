import { Button, Modal } from 'antd';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import React, { Fragment, useState } from 'react';
import BaseGeneratorForm from '../base/BaseGeneratorForm';

const ModalAddModel: React.FC<any> = (props) => {
    const [visible, toggleVisible] = useState<boolean>(false);
    const addModelSchema = props.schema;
    // Handlers
    const handlerAddModel = (dataForm: object, validForm: boolean) => {
        if (validForm) {
            props.modelsStore.addModel(dataForm);
            toggleVisible(false);
        }
    }

    return (
        <Fragment>
            <Button type="link" onClick={() => toggleVisible(true)}>+ Добавить модель</Button>
            <Modal title={`Добавить новую модель`}
                footer={null}
                visible={visible}
                onCancel={() => toggleVisible(false)}>
                <BaseGeneratorForm onSubmitForm={handlerAddModel} schema={addModelSchema} submitButton={{ text: "Добавить" }}></BaseGeneratorForm>
            </Modal>
        </Fragment>
    )
}

export default inject('modelsStore')(observer(ModalAddModel));