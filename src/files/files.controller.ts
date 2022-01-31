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

@Controller('files')
export class FilesController {
  constructor(private readonly fileService: FilesService) {}

  @HttpCode(200)
  @Post('upload')
  @UseInterceptors(FileInterceptor('files'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Array<FileElementResponse>> {
    return this.fileService.saveFile(file);
  }
}
