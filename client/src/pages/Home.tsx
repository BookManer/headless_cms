import React from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../layouts/app.layout';
import Sidebar from '../components/UI/Sidebar/Sidebar';

import { Col, Row } from 'antd';
import { inject, observer } from 'mobx-react';
import { Loader } from '../components/Loader';
import { UploaderFiles } from '../components/base/Uploader/UploaderMain/UploaderFiles';


@inject('entityStore')
@observer
class Home extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.onAddEntity = this.onAddEntity.bind(this);
        this.state = {
            value: '',
        }
    }

    onAddEntity() {
        this.props.entityStore.addEntity();
    }

    render() {
        return this.props.entityStore.entities?.length || this.props.entityStore.groupsEntity?.length ? (
            <AppLayout>
                <Row>
                    <Col span={24}>
                        <UploaderFiles />
                    </Col>
                </Row>
                <Row>
                    <Col span={6}><Sidebar></Sidebar></Col>
                    <Col span={18}><Link to="/profile">Перейти в профиль</Link></Col>
                </Row>
            </AppLayout>
        ) : <Loader />
    }
}

export default Home;