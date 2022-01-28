import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopPageModel } from './top-page.model';

@Controller('top-page')
export class TopPageController {
  @Post('create')
  async create(@Body() dto: Omit<TopPageModel, '_id'>) {
    return dto;
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return '';
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return '';
  }
  @Patch(':id')
  async patch(@Param('id') id: string, @Body() dto: TopPageModel) {
    return dto;
  }

  @HttpCode(200)
  @Post()
  async find(@Body() dto: FindTopPageDto) {
    return dto;
  }
}
