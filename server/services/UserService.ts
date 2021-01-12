// Models
import { UsersModel } from "../../service-DB/models/index";
import { AuthService } from "../auth";
import { DBService } from "./DBService";

let instance = null;
let db: DBService<UsersModel> = null;

export class UserService {
  private nameTable: string;

  private constructor(nameTable: string) {
    this.nameTable = nameTable;
  }

  public static async Init(nameTable: string): Promise<UserService> {
    if (!instance) {
      instance = new UserService(nameTable);
      db = await DBService.Init();
    }

    return instance;
  }

  public async getUserByEmail(email) {
    try {
      return await db.findOnce(this.nameTable, { column: "email", val: email });
    } catch (e) {
      throw new Error('❌ Такого пользователя не существует');
    }
  }

  public async getUserByToken(token: string) {
    const auth = await AuthService.Init();
    return await auth.getUserFromToken(token);
  }

  public async create(userPayload: UsersModel): Promise<any> {
    const foundUser = await this.getUserByEmail(userPayload.email);
    if (!foundUser) {
      db.create(this.nameTable, userPayload);
      return Promise.resolve("✅ Пользователь успешно зарегестрирован");
    }
    return Promise.reject("❌ Такой пользователь уже существует");
  }
}
