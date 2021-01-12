import React, { Fragment } from 'react';

export const ErrorLayout: React.FC<any> = (props) => {
    return (
        <Fragment>
            {props.children}
        </Fragment>
    )
} 