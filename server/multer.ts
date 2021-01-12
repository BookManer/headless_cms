const path = require("path");
const fs = require("fs");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { medias } = req.query;
    const { relativePath } = req.query; 
    const dateCreated = new Date(Date.now());
    const year = dateCreated.getFullYear();
    const month = dateCreated.getMonth() + 1;
    const day = dateCreated.getDay() - 1;
    let dest = ``;
    if (relativePath) {
      dest = `./uploads${relativePath}`;
    } else if (medias) {
      const res = JSON.parse(medias).find(media => {
        return media.name === file.originalname;
      });
      const relativePath = res?.relativePath;
      dest = `./uploads/${relativePath}`;
    } else {
      dest = `./uploads/${year}/${month}/${day}`;
    }

    if (!fs.existsSync(dest)) {
      try {
        fs.mkdirSync(dest, { recursive: true });
      } catch (err) {
        console.log(err);
      }
    }
    cb(null, dest);
  },
  filename: async function (req, file, cb) {
    const { name } = req.query;
    let filename = '';
    if (!req?.files?.length) {
      filename = name.split(path.extname(file.originalname))[0] + path.extname(file.originalname);
    } else {
      filename = file.originalname;
    } 
    cb(null, filename);
  },
});

export const unreadMimetypes = [
  "x-msdos-program",
  ".apk",
  ".bat",
  ".bin",
  ".bin",
  ".cgi",
  ".cmd",
  ".cmd",
  ".cmd",
  ".com",
  ".cpp",
  ".js",
  ".jse",
  ".exe",
  ".exe",
  ".gadget",
  ".gtp",
  ".hta",
  ".jar",
  ".msi",
  ".msu",
  ".paf.exe",
  ".pif",
  ".ps1",
  ".pwz",
  ".scr",
  ".thm",
  ".vb",
  ".vbe",
  ".vbs",
  ".wsf",
];

const fileFilter = (req, file, cb) => {
  if (unreadMimetypes.join(",").includes(file.mimetype)) {
    cb(new Error("❌ Недопустимый формат данных"));
  } else {
    cb(null, true);
  }
};

export async function verifyUpload(req, res, cb) {
  return new Promise((res, rej) => {
    cb(req, res, (error) => {
      error && rej(error);
      res(req.file);
    });
  });
}
export const multerInstance = multer({
  storage: storage,
  fileFilter: fileFilter,
});
