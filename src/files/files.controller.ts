import {
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileElementResponse } from './dto/files.response';
import { FilesService } from './files.service';
import { Mfile } from './mfile.class';

@Controller('files')
export class FilesController {
  constructor(private readonly fileService: FilesService) {}

  @HttpCode(200)
  @Post('upload')
  @UseInterceptors(FileInterceptor('files'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Array<FileElementResponse>> {
    const saveArray: Array<Mfile> = [new Mfile(file)];

    if (file.mimetype.includes('image')) {
      const webP = await this.fileService.converToWebP(file.buffer);
      saveArray.push(
        new Mfile({
          originalname: `${file.originalname.split('.')[0]}.webp`,
          buffer: webP,
        }),
      );
    }
    return this.fileService.saveFile(saveArray);
  }
}
