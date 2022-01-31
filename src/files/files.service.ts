import { Injectable } from '@nestjs/common';
import { FileElementResponse } from './dto/files.response';

@Injectable()
export class FilesService {
    async saveFile(file: Express.Multer.File,
      ): Promise<Array<FileElementResponse>> {
          return '' as any
      }
    }
}
