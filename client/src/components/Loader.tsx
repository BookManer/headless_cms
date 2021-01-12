import React, {FC, Fragment} from 'react';
import {Spin} from 'antd';

export const Loader: FC<any> = (props: { message?: string } = { message: 'Загрузка...' }) => {
    const { message } = props;
    return (
        <Fragment>
            <h4>{ message }</h4> <Spin size="large" />
        </Fragment>
    )
}