// argon2 hasg library
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";

import { v4 as uuidv4 } from "uuid";
import { UsersModel } from "../service-DB/models";
// UserService
import { UserService } from "./services/UserService";
import { RoleEnum } from "../service-DB/enums/index";

const colors = require("colors");
const log = console.log;
let instance = null;
let user = null;
let signature = "N0ang0keq21B0rshBlack_C0d0vctv0";

export class AuthService {
  private constructor() {
    // user = UserService.Init('users');
  }
  public static async Init() {
    if (!instance) {
      instance = new AuthService();
    }
    user = await UserService.Init("users");
    return instance;
  }

  // Methods's service
  public async SignUp(fullName, nickname, email, password) {
    try {
      const passwordHashed = await argon2.hash(password);
      const { first_name, last_name, third_name } = fullName;
      const userParams = {
        id: uuidv4(),
        first_name,
        last_name,
        third_name,
        nickname,
        email,
        date_created: new Date(),
        date_last_updated: new Date(),
        password: passwordHashed,
        role: RoleEnum.OBSERVER,
      };
      // Initialized User serive for manipulate data from the store DB
      await this.registerNewUser(userParams);
      const token = this.generateToken(userParams);
      user.token = token;

      return Promise.resolve(token);
    } catch (e) {
      log(colors.red.bold(e));
      return Promise.reject(e);
    }
  }
  public async SignIn(email, password) {
    try {
      const foundUserByEmail = await user.getUserByEmail(email);
      if (foundUserByEmail) {
        const correctPassword = await argon2.verify(
          foundUserByEmail.password,
          password
        );
        if (!correctPassword) {
          throw new Error("❌ Неверено введен пароль");
        }
        return Promise.resolve({
          user: {
            email: foundUserByEmail.email,
            first_name: foundUserByEmail.first_name,
            last_name: foundUserByEmail.last_name,
            third_name: foundUserByEmail.third_name,
            nickname: foundUserByEmail.nickname,
            role: foundUserByEmail.role,
          },
          token: this.generateToken(foundUserByEmail),
        });
      } else {
        throw new Error("❌ Такого пользователя не существует");
      }
    } catch (e) {
      log(colors.red.bold(e));
      return Promise.reject(e.message);
    }
  }
  public async registerNewUser(userPayload: UsersModel) {
    try {
      const success_message = await user.create(userPayload);
      log(colors.green.bold(success_message));

      return Promise.resolve(success_message);
    } catch (e) {
      log(colors.red.bold(e));
      return Promise.reject("❌ Не удалось создать пользователя :(");
    }
  }
  private generateToken(userPayload: UsersModel) {
    const data = {
      _id: userPayload.id,
      first_name: userPayload.first_name,
      last_name: userPayload.last_name,
      third_name: userPayload.third_name,
      email: userPayload.email,
      nickname: userPayload.nickname,
      role: userPayload.role,
    };
    const expiration = '5h';

    return jwt.sign({ data }, signature, { expiresIn: expiration });
  }
  public getSignatureToken(): string {
    return signature;
  }
  public async isAuth(req): Promise<boolean> {
    try {
      const useUser = await UserService.Init("users");
      const token = req.header("Authorization")?.split(" ")[1];
      const publicUserData = await this.getUserFromToken(token);
      const currentUser = await useUser.getUserByEmail(publicUserData.email);

      return Promise.resolve(Object.keys(currentUser).length > 0);
    } catch (e) {
      throw new Error(e?.message);
    }
  }
  public async getUserFromToken(token: string): Promise<any> {
    try {
      return await jwt.verify(token, signature).data;
    } catch (e) {
      throw new Error('Токен истек, войдите в систему снова');
    }
  }
}
