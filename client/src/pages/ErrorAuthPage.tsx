import React from 'react';
import { Link } from 'react-router-dom';
import { ErrorLayout } from '../layouts/error.layout';

export const ErrorAuthPage: React.FC<any> = (props) => {
    return (
        <ErrorLayout>
            <Link to="/login">Войти/Зарегистрироваться</Link>
        </ErrorLayout>
    )
} 