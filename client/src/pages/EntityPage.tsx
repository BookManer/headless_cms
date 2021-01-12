import React, { Fragment, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
// Components
import EntityGroupFields from '../components/ComponentInstances/entity/EntityGroupFields';
import { Button, Popconfirm, Tag } from 'antd';

import { observer, inject } from 'mobx-react';
import { Loader } from '../components/Loader';


const EntityPage: React.FC<any> = (props) => {
    const [visibleAceptingPanel, toggleVisibleAceptingPanel] = useState(false);
    const entity = props.entityStore.getEntityById(props.match.params.id);
    const fields = props.fieldsStore.getFieldsByEntityId(entity?.id);
    const handlerDeleteEntity = async () => {
        await props.entityStore.deleteEntity(entity.id);
        props.history.goBack();
    }

    return !!entity ? (
        <Fragment>
            <Link to="/">На главную</Link>
            <h1>
                {entity.name}
                <Tag color="green">{entity.status}</Tag>
                <Popconfirm title={`Вы правда хотите удалить?`}
                            onConfirm={handlerDeleteEntity}> 
                    <Button onClick={() => toggleVisibleAceptingPanel(true)} type="link" danger>удалить</Button>
                </Popconfirm>
            </h1>
            <p><b>Описание: </b>{entity.description}</p>
            <pre>Добавлен: <Tag color="cyan">{new Date(entity.date_created).toLocaleDateString()}</Tag></pre>
            <EntityGroupFields entity_id={entity.id} fields={fields}></EntityGroupFields>
        </Fragment>
    ): <Loader />
}

export default inject('entityStore', 'fieldsStore')(withRouter(observer(EntityPage)));