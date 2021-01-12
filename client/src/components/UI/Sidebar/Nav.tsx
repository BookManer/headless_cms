import React, {Fragment} from 'react';
import { Link } from 'react-router-dom';

interface SidebarNavProps {
    title: string,
    items: object[]
}

export default (props) => {
    return (
        <Fragment>
            <h2>{props.title}</h2>
            {props.children}
        </Fragment>
    )
}