import { observable, action, computed, makeAutoObservable } from "mobx";

export class MediaStore {
    @observable private anyUploadFormData: FormData = null;
    @observable private activeSelectedFiles: File[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    @action setSelectedFiles(selectedFiles: File[]) {
        this.activeSelectedFiles = selectedFiles;
    }

    @action setFormData(form: FormData) {
        this.anyUploadFormData = form;
    }

    @computed getActiveSelectedFiles() {
        return this.activeSelectedFiles;
    }

    @computed getActiveBinaryFormData() {
        return (readyUploadFiles: any[]) => {
            const filteredFormData: FormData  = new FormData();
            const filesByStateFormData = this.anyUploadFormData.getAll('media_upload');
            const filteredByActive = filesByStateFormData.filter((file: any) => {
              const isFileActive = readyUploadFiles.find((activeFile) => activeFile.name === file.name);
              
              return isFileActive;
            })
            filteredByActive.forEach((activeFile: any) => {
                filteredFormData.append('media_upload', activeFile, activeFile.originalname);
            })

            return filteredFormData;
        }
    }

    @computed getFormDataStore() {
        return this.anyUploadFormData;
    }
}