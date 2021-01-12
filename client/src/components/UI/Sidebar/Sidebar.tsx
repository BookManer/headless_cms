import React, { Fragment } from 'react';
import SidebarEntityList from './EntityList';

import { observer, inject } from 'mobx-react';
import { Loader } from '../../Loader';
import { Collapse, List } from 'antd';
import ModalAddEntity from '../../modals/ModalAddEntity';
import formsSchema from '../../../config/forms.schema';
import { Link } from 'react-router-dom';
import ModelList from './ModelList';
import ModalAddModel from '../../modals/ModalAddModel';
const { Panel } = Collapse;

@inject('entityStore', 'modelsStore')
@observer
class Sidebar extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    render() {
        const { modelsStore, entityStore } = this.props;

        return (
            <Fragment>
                <Collapse ghost>
                    <Panel header="Модели" key={0}>
                        <ModelList></ModelList>
                        <ModalAddModel schema={formsSchema.addModel}></ModalAddModel>
                    </Panel>
                </Collapse>
                <Collapse ghost>
                    {entityStore.groupsEntity ? entityStore.groupsEntity.map((group) => (
                        <Panel header={group.title} key={group.id}>
                            <SidebarEntityList group={group}></SidebarEntityList>
                            <ModalAddEntity schema={formsSchema.addEntityWithModel} group={group}></ModalAddEntity>
                        </Panel>
                    )) : <Loader />}
                </Collapse>
            </Fragment>
        )
    }
}

export default Sidebar;