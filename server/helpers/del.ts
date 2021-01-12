const fs = require("fs");

async function unlinkFileSync(path: string) {
    return new Promise((res, rej) => {
        fs.unlink(path, (err) => {
            if (err) {
                console.log(err);
                rej(err);
            }
            console.log(`Файл успешно удален из ${path}`);
            res(`Файл успешно удален из ${path}`);
        });
    })
    //   if (!fs.unlinkSync(path)) {
//     return Promise.reject(
//       `Файл не был удален, возможно, путь указан не верно: ${path}`
//     );
//   } else {
//       return Promise.resolve('ok');
//   }
}

export async function deleteFiles(
  file: string | string[],
  resolvePath: string,
  date: Date,
) {
  const now = new Date(date);
  const day = now.getDay() - 1;
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const pathToDir = `${resolvePath}/${year}/${month}/${day}/`;
  try {
    if (typeof file != "string") {
      console.log(file);
      const files = file;
      for (let file of files) {
        await unlinkFileSync(pathToDir + file);
      }
    } else {
      console.log("SINGLE FILE: ", pathToDir + file);
      console.log(await unlinkFileSync(pathToDir + file));
    }
    return Promise.resolve(file);
  } catch (err) {
    return Promise.reject(err.message);
  }
}

export async function existsFileUploads(file) {
  return new Promise((res, rej) => {
      fs.stat(file.path, (err, stats) => {
          if (err)  {
              rej(false);
              return;
          }
          res(true);
      })
  })
}
