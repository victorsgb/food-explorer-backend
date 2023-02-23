// Core dependencies
import fs = require('fs');
import path = require('path');
import { TMP_FOLDER, UPLOADS_FOLDER } from '../configs/upload';

class DiskStorage {
  async saveFile(file: any) {
    await fs.promises.rename(
      path.resolve(TMP_FOLDER, file),
      path.resolve(UPLOADS_FOLDER, file)
    );
    return;
  }

  async deleteFile(file: any) {
    const filePath = path.resolve(UPLOADS_FOLDER, file);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}

export default DiskStorage;