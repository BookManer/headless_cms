import { MediaService } from "./MediaService";

const path = require("path");
const fs = require("fs");

let instance: UploadFSService = null;

export class UploadFSService {
  private pathRoot = path.join(__dirname, "../../uploads/");
  private constructor(pathRoot?: string) {}

  public static async Init(pathRoot?: string) {
    if (!instance) {
      return new UploadFSService();
    }

    return instance;
  }

  public async getAllFS() {
    try {
      const files = await this.getAllStructureFS(this.pathRoot);
      return Promise.resolve(JSON.stringify(files));
    } catch (e) {
      console.log(e);
    }
  }

  private async getAllStructureFS(pathFolder: string, dirFolder = '') {
    const pathRelative = pathFolder;
    let res: any = await this.getAllFiles(pathRelative, dirFolder);
    let mappedFiles = [];
    for (let file of res) {
      if (file.isFolder) {
        mappedFiles.push({
          ...file,
          files: await this.getAllStructureFS(file.dirname, file.dirFolder),
        });
      } else {
        mappedFiles.push(file);
      }
    }

    return mappedFiles;
  }

  private calculateSizeByFile(stats: any) {
    const formatedSize = stats.size / 1024;
    if (formatedSize >= 1024) {
      return (formatedSize / 1024).toFixed(2) + "Mb";
    } else {
      return formatedSize.toFixed(2) + "Kb";
    }
  }

  private async getAllFiles(pathFolder: string, dirFolder = '') {
    const pathRelative = pathFolder;
    let instanceMediaService = await MediaService.Init();
    return new Promise((res, rej) => {
      fs.readdir(pathFolder, async (error, files) => {
        if (error) rej(error);

        if (files) {
          let mappedFiles = [];
          for (let file of Array.from(files)) {
            const isFolder = !/\./gi.test(file as string);
            const dirFolderParam = isFolder ? dirFolder + "/" + file : dirFolder
            const statsFile = fs.statSync(pathRelative + "/" + file);
            let idFile;
            try {
            if (statsFile.isFile()) {
              idFile = await instanceMediaService.getMediaByRelativePath(dirFolderParam);
            }
            } catch (e) {
              console.log(e);
            }
            mappedFiles.push({
              id: idFile?.id,
              isFolder,
              name: file,
              size: !isFolder ? statsFile.size : false,
              dirname: isFolder
                ? path.normalize(pathRelative + file + "/")
                : null,
              relativePath: path.normalize(pathRelative + file),
              dirFolder: dirFolderParam,
              date_created: new Date(statsFile.birthtime),
              date_last_updated: new Date(statsFile.mtime),
            });
          };
          res(mappedFiles);
          }
        //   Array.from(files).map((file) => {
        //     const isFolder = !/\./gi.test(file as string);
        //     const dirFolderParam = isFolder ? dirFolder + "/" + file : dirFolder + "/"
        //     const statsFile = fs.statSync(pathRelative + "/" + file);
        //     let idFile;
        //     if (statsFile.isFile) {
        //       idFile = await instanceMediaService.getMediaByRelativePath(dirFolderParam);
        //     }
        //     return {
        //       isFolder,
        //       name: file,
        //       size: !isFolder ? statsFile.size : false,
        //       dirname: isFolder
        //         ? path.normalize(pathRelative + file + "/")
        //         : null,
        //       relativePath: path.normalize(pathRelative + file),
        //       dirFolder: dirFolderParam,
        //       date_created: new Date(statsFile.birthtime),
        //       date_last_updated: new Date(statsFile.mtime),
        //     };
        //   });
        //   res(mappedFiles);
        // }
      // });
    });
  })
  }}
