import React from 'react';
import BaseGeneratorForm from '../components/base/BaseGeneratorForm';
import { AppLayout } from '../layouts/app.layout';
import schemas from '../config/forms.schema';
// Hook's
import { useHistory } from 'react-router-dom';
// mobx-react with store
import { observer, inject } from 'mobx-react';
import { UserStore } from '../store/user.store';

interface UserHTTPResponse {
    login: string;
    password: string;
}
interface LoginProps {
    userStore: UserStore;
}

const Login: React.FC<any> = (props) => {
    const history = useHistory();
    const handlerSubmitForm = async (dataForm: UserHTTPResponse, validForm: boolean) => {
        if (validForm) {
            await props.userStore.signIn(dataForm);
            await props.fieldsStore.initAllFields();
            await props.modelsStore.initModels();
            await props.fileSystemStore.init();
            await props.entityStore.initEntity();
            await props.entityStore.initGroupEntity();
            history.push('/profile')
        }
    }
    return (
        <AppLayout>
            <h1>Heloo Login page!</h1>
            <BaseGeneratorForm onSubmitForm={handlerSubmitForm} schema={schemas.login} submitButton={{ text: 'Войти' }} />
        </AppLayout>
    )
}

export default inject('userStore', 'modelsStore', 'entityStore', 'fieldsStore', 'fileSystemStore')(observer(Login));