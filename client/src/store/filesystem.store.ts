import { observable, action, computed, makeAutoObservable } from "mobx";
import { api } from "../http";

interface IFolderFile {
  name: string;
  isFolder: boolean;
  dirname: string;
  dirFolder: string;
  relativePath: string;
  size: number | boolean;
  date_created?: Date;
  date_last_updated?: Date;
  files: Array<IFolderFile>;
}
interface IEditablePropsFile {
  name?: string;
  size?: number;
  date_created?: Date;
  date_last_upadted?: Date;
}

export class FileSystemStore {
  @observable folders: Array<IFolderFile>;

  constructor() {
        makeAutoObservable(this);
    this.init();
  }

  @action init() {
    api.get("/cms/getUploadFS", {}).then((res) => {
      this.folders = res;
    });
  }

  @action edit(name: string, payload: IEditablePropsFile) {
    const regxp = new RegExp(`${name}`, 'ig');

    function search(item: any) {
        if (item.name.match(regxp)) {
            item.name = payload.name;
            return item;
        }

        if (item.files) {
            item.files = item.files.map((file) => {
                return search(file);
            })
        }

        return item;
    }

    this.folders = this.folders.map(folder => {
        const res = search(folder);
        console.log(res);
        return res;
    });
  }

}
