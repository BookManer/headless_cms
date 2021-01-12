import React from 'react';
import AuthService from '../../auth';
import { UserStore } from '../../store/user.store';
import { Redirect } from 'react-router-dom';

const auth = AuthService.Init();

export default function withAuthNavigation(Component, userStore: UserStore): any {
    try {
        // Проверка: авторизирован ли пользователь в системе.
        const user = userStore.getUser;

        return user ? (<Component user={user} />) : (<Redirect to="/login" />)
    } catch (e) {
        console.log('withAuthNavigation', e);
    }
}