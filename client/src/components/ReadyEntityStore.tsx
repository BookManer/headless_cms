import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { Loader } from './Loader';

const ReadyEntityStore: React.FC<any> = (props) => {
    const { entities, groupsEntity } = props.entityStore;

    return entities.length && groupsEntity.length ? (
        props.children
    ) : <Loader />
}

export default inject('entityStore')(observer(ReadyEntityStore));