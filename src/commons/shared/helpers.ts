import multer from 'multer';

import * as fs from 'fs';

export class Helper {
  static customFileName(req, file, cb) {
    const splitFile = file.originalname.split('.');
    const extension = ['jpeg', 'png', 'jpg'];
    const extensionFile = splitFile[1];

    if (extension.indexOf(extensionFile.toLowerCase()) == -1) {
      return cb('Error: Images Only!', false);
    }

    const random = Date.now() + '-' + Math.round(Math.random() * 1e9);

    const fileName = `${splitFile[0]}_${random}.${splitFile[1]}`;

    cb(null, fileName);
  }

  static destinationPath(req, file, cb) {
    process.env.NODE_ENV == 'production'
      ? cb(null, 'pictures:/media/')
      : cb(null, './images/');
  }

  static async deleteFile(filename: string) {
    const path = './images/' + filename;
    try {
      await fs.unlinkSync(path);
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
