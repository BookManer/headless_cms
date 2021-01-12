import { List, Tag } from 'antd';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import ModelListFields from '../components/ComponentInstances/modelEntity/ModelListFields';
import { Loader } from '../components/Loader';
import ModalAddEntityModel from '../components/modals/ModalAddEntityModel';
import formsSchema from '../config/forms.schema';

const ModelPage: React.FC<any> = (props) => {
    const { match } = props;
    const model = props.modelsStore.getModelById(match.params.id);
    const fields = props.fieldsStore.getFieldsByModelId(match.params.id);
    const allEntities = props.entityStore.getEntitiesByModelId(match.params.id);

    return model ? (
        <Fragment>
            <h1>{model?.title}</h1>
            <List>
                {allEntities.length ? allEntities.map(entity => (
                    <List.Item key={entity.id}><Link to={`/entity/${entity.id}`}>{entity.name}</Link></List.Item>
                )) : <p>Нет сущностей</p>}
            </List>
            <ModalAddEntityModel model={model} schema={formsSchema.addEntity} group={{ id: '18c56e8a-2b34-11eb-adc1-0242ac120002' }}></ModalAddEntityModel>
            <p>Добавлен: <Tag color="cyan">{new Date(model.date_created).toLocaleDateString()}</Tag></p>
            <ModelListFields fields={fields}></ModelListFields>
        </Fragment>
    ) : <Loader />
}

export default inject('modelsStore', 'entityStore', 'fieldsStore')(withRouter(observer(ModelPage)));