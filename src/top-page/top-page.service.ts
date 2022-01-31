import { Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopPageModel } from './top-page.model';

@Injectable()
export class TopPageService {
  constructor(
    @InjectModel(TopPageModel)
    private readonly topPageModel: ModelType<TopPageModel>,
  ) {}

  async create(dto: CreateTopPageDto): Promise<DocumentType<TopPageModel>> {
    return this.topPageModel.create(dto);
  }

  async getById(id: string): Promise<DocumentType<TopPageModel> | null> {
    return this.topPageModel.findById(id).exec();
  }

  async deleteById(id: string): Promise<DocumentType<TopPageModel> | null> {
    return this.topPageModel.findByIdAndDelete(id).exec();
  }
  async updateById(
    id: string,
    dto: CreateTopPageDto,
  ): Promise<DocumentType<TopPageModel> | null> {
    return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }
  async findByFistCategory({
    firstCategory,
  }: FindTopPageDto): Promise<
    Array<
      DocumentType<Pick<TopPageModel, 'alias' | 'secondCategory' | 'title'>>
    >
  > {
    return (
      this.topPageModel
        //   .find(
        //     { firstLevel: dto.firstCategory },
        //     { alias: 1, secondCategory: 1, title: 1 },
        //   )
        .aggregate([
          {
            $match: {
              firstCategory,
            },
          },
          {
            $group: {
              _id: {
                secondCategory: '$secondCategory',
              },
              pages: {
                $push: {
                  alias: '$alias',
                  title: '$title',
                },
              },
            },
          },
        ])
        .exec()
    );
  }
  async getByAlias(alias: string): Promise<DocumentType<TopPageModel>> {
    return this.topPageModel.findOne({ alias }).exec();
  }
  async search(text: string): Promise<Array<DocumentType<TopPageModel>>> {
    return this.topPageModel
      .find({ $text: { $search: text, $caseSensitive: false } })
      .exec();
  }
}
