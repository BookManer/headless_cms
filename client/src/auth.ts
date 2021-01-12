// API Quetzal
import QuetzalAPI from './api/Quetzal.api';

let instance: AuthService = null;
let api: QuetzalAPI = QuetzalAPI.Init({
    baseURL: 'http://localhost:4760/api/v2/',
});

/**
 * Сервис пользователя.
 * Подготавливает при инициализации API к работе, хранит в себе объект пользователя.
 * Может вернуть текущего пользователя по токену, проверить авторизован ли существующий.
 * Вход в систему -> запись access токена в локальное хранилище
 */
export default class AuthService {
    private currentUser;
    private constructor() {}

    public static Init(): AuthService {
        if (!instance) {
            instance = new AuthService();
        }
        return instance;
    }

    public getCurrentUser(): object {
        return this.currentUser || JSON.parse(localStorage.getItem('user'));
    }

    public async getUserForCheckStatusToken(): Promise<object> {
        const user = await api.get('/cms/getUser', {});
        this.currentUser = undefined;
        return user;
    }

    public isAuth(): boolean {
        const hasUser = this.currentUser || localStorage.getItem('user');
        return !!hasUser;
    }

    public async signIn(payloadUser: object): Promise<object> {
        try {
            this.currentUser = await api.get('/auth/signIn', payloadUser);
            return this.currentUser;
        } catch (e) {
            this.currentUser = null;
            throw new Error(e.message);
        }
    }

    public async logOut() {
        try {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        } catch (e) {
            console.log(e);
        }
    }
}