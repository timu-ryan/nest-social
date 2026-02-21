import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {
  // асинхронной лучше делать
  createFile(file: Express.Multer.File): string {
    try {
      const fileName = uuid.v4() + '.jpg';
      const filePath = path.resolve(process.cwd(), 'static');
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.join(filePath, fileName), file.buffer);
      return fileName;
    } catch {
      throw new HttpException(
        'Произошла ошибка при записи файла',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
