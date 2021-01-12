import { Button, List, Popconfirm } from 'antd';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { ModelEntityModel } from '../../../../../service-DB/models';

const ModelList: React.FC<any> = (props) => {
    const handlerRemoveModel = async (id: string) => {
        await props.modelsStore.deleteModel(id);
    }

    return props.modelsStore.models.length ? (
        <Fragment>
            <List dataSource={props.modelsStore.models} renderItem={(model: any) => (
                <List.Item>
                    <p>{model.title}</p>
                    <Link to={`/models/${model.id}`}>Перейти</Link>
                    <Popconfirm title="Вы точно хотите удалить?" onConfirm={() => handlerRemoveModel(model.id)}>
                        <Button type="link" danger>удалить</Button>
                    </Popconfirm>
                </List.Item>
            )}>
            </List>
        </Fragment>
    ) : <p>Пока что моделей нет</p>
}

export default inject('modelsStore')(observer(ModelList));