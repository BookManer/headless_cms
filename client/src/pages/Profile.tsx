import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../auth';
// Toaster
import { ToastsStore } from 'react-toasts';

const auth = AuthService.Init();

export class Profile extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.onHandlerLogOut = this.onHandlerLogOut.bind(this);
        this.state = {
            user: this.props.user,
            isUserNotFound: false,
        }
    }

    async componentDidMount() {
        await auth.getUserForCheckStatusToken();
    }

    onHandlerLogOut() {
        (async () => {
            await auth.logOut();
            ToastsStore.success('Успешно вышел');
        })()
    }

    render() {
        const { first_name, last_name, third_name, email, nickname } = this.props.user;
        return (
            <Fragment>
                <Link to="/">На главную</Link>
                <h1>Пользователь</h1>
                <h2>{last_name} {first_name} {third_name}</h2>
                <p><b>Почта:</b> {email}</p>
                <p><b>Никнейм:</b> {nickname}</p>
                <Link onClick={this.onHandlerLogOut} to="/login">Выйти</Link>
            </Fragment>
        )
    }
}