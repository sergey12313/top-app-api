import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TOP_PAGE_NOT_FOUND_ERROR } from './top-page.constants';
import { TopPageModel } from './top-page.model';
import { TopPageService } from './top-page.service';

@Controller('top-page')
export class TopPageController {
  constructor(private readonly topPageService: TopPageService) {}

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return this.topPageService.create(dto);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const topPage = await this.topPageService.getById(id);
    if (!topPage) {
      throw new BadRequestException(TOP_PAGE_NOT_FOUND_ERROR);
    }
    return topPage;
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const topPage = await this.topPageService.deleteById(id);
    if (!topPage) {
      throw new BadRequestException(TOP_PAGE_NOT_FOUND_ERROR);
    }
    return topPage;
  }

  @UsePipes(new ValidationPipe())
  @Patch(':id')
  async patch(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateTopPageDto,
  ) {
    const topPage = await this.topPageService.updateById(id, dto);
    if (!topPage) {
      throw new BadRequestException(TOP_PAGE_NOT_FOUND_ERROR);
    }
    return topPage;
  }

  @Get('byAlias/:alias')
  async findByAlias(@Param('alias') alias: string) {
    return this.topPageService.getByAlias(alias);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async find(@Body() dto: FindTopPageDto) {
    return this.topPageService.findByFistCategory(dto);
  }

  @Get('textSearch/:text')
  async search(@Param('text') text: string) {
    return this.topPageService.search(text);
  }
}
