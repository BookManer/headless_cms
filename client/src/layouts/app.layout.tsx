import React, { Fragment } from 'react';
// components UI
import { Header } from '../components/UI/Header';
import { Footer } from '../components/UI/Footer';


export const AppLayout = (props) => (
    <Fragment>
        <Header />
        {props.children}
        <Footer />
    </Fragment>
)