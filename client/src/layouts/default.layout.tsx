import React, { Fragment, ReactPropTypes } from 'react';


export const DefaultLayout: React.FC<ReactPropTypes> = (props) => (
    <Fragment>
        {props.children}
    </Fragment>
)