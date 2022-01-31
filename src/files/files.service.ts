import { Injectable } from '@nestjs/common';
import { FileElementResponse } from './dto/files.response';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import * as sharp from 'sharp';
import { Mfile } from './mfile.class';

@Injectable()
export class FilesService {
  async saveFile(files: Array<Mfile>): Promise<Array<FileElementResponse>> {
    const dateFolder = format(new Date(), 'yyyy-MM-dd');
    const uploadFolder = `${path}/upload/${dateFolder}`;
    await ensureDir(uploadFolder);
    const res: Array<FileElementResponse> = [];
    for (const file of files) {
      await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
      res.push({
        url: `${dateFolder}/${file.originalname}`,
        name: file.originalname,
      });
    }
    return res;
  }
  converToWebP(file: Buffer): Promise<Buffer> {
    return sharp(file).webp().toBuffer();
  }
}
