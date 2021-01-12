import axios, { AxiosInstance } from "axios";
import { useAuthInterceptor } from "./interceptors/auth.interceptor";

export default class BaseApi {
  protected instanceAPI: AxiosInstance;

  constructor(payload) {
    this.instanceAPI = axios.create({ ...payload });
    useAuthInterceptor(this.instanceAPI);
  }

  async get(route: string, params: object) {
    const res = await this.instanceAPI.get(route, { params });
    return res?.data;
  }
  async post(route: string, params: any, additionalOptions?: object) {
    console.log({ params, ...additionalOptions });
    const res = await this.instanceAPI.post(route, null, {
      params,
      ...additionalOptions,
    });
    return res?.data;
  }
  async update(route: string, params: object) {
    const res = await this.instanceAPI.put(route, null, { params });
    return res?.data;
  }
  async delete(route: string, params: object) {
    const res = await this.instanceAPI.delete(route, { params });
    return res?.data;
  }
}
