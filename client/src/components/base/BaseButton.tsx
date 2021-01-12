import React from 'react';

export default (props: any) => {
    return (
        <button onClick={(e) => props.onSubmit(e)}>{props.children}</button>
    )
} 