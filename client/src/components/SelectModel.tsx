import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { BaseSelect } from './base/BaseSelect';

const SelectModel: React.FC<any> = (props) => {

    const models = props.modelsStore.models.map(model => ({ text: model.title, value: model.id }));
    const handlerChooseItem = (selected: { name: string, value: unknown, valid: boolean }) => {
        props.emmit({...selected, name: 'choosed_model'});
    }

    return (
        <Fragment>
            {props.field.name}
            <BaseSelect items={models} emmit={handlerChooseItem}></BaseSelect>
        </Fragment>
    )
}

export default inject('modelsStore', 'fieldsStore')(withRouter(observer(SelectModel)));