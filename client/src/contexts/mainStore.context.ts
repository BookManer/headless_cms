import { observable, action, makeAutoObservable } from "mobx";
import { createContext } from "react";

class MainStore {
    constructor() {
        makeAutoObservable(this);
    }

    @observable count: number = 0;
    @action increment() {
        this.count++;
    }
}

export const mainStore = new MainStore();