import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
// mobx-react
import { observer, inject } from 'mobx-react';

@inject('entityStore')
@observer
class SidebarEntityList extends React.Component<any, any> {
    constructor(props) {
        super(props)
    }

    render() {
        const { entityStore } = this.props;
        const { entitiesByGroupId } = entityStore;
        const entities = entitiesByGroupId(this.props.group.id);
        
        return (
            <Fragment>
                {entities.length ?
                    entities.map((entity: any) => (
                        <li key={entity.id}>
                            <Link to={`/entity/${entity.id}`}>{entity.name}</Link>
                        </li>))
                    : <span>Пусто</span>}
            </Fragment>
        )
    }
}
export default SidebarEntityList