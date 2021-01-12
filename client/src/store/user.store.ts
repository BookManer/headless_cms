import { observable, action, computed, makeAutoObservable } from "mobx";
import { ToastsStore } from "react-toasts";
import { UsersModel } from "../../../service-DB/models/index";
import AuthService from "../auth";
// AuthService
const auth = AuthService.Init();

interface UserHTTPResponse {
  login: string;
  password: string;
}

export class UserStore {
  @observable private user: UsersModel;

  constructor() {
    makeAutoObservable(this);
    if (!localStorage.getItem("user")) {
      this.initUser();
    }
  }

  @computed
  get getUser(): UsersModel {
    return this.user || JSON.parse(localStorage.getItem("user"));
  }

  @action
  async initUser() {
    try {
      this.user = (await auth.getUserForCheckStatusToken()) as UsersModel;
      ToastsStore.success(`Пользователь авторизирован!`);
    } catch (e) {
      this.user = null;
    }
  }
  @action
  async signIn(userPayload: UserHTTPResponse) {
    try {
      const userHttp: any = await auth.signIn(userPayload);
      this.user = userHttp.user;
      localStorage.setItem("user", JSON.stringify(this.user));
      const { first_name, last_name } = this.user;
      ToastsStore.success(
        `Пользователь ${first_name} ${last_name} успешно вошел в систему!`
      );
    } catch (e) {
      ToastsStore.error(
        "Ошибка входа, возможно, Вы вели не правильный пароль или логин"
      );
    }
  }
}

export const userStore = new UserStore();