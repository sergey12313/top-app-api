import { Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { ReviewModel } from 'src/review/review.model';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { ProductModel } from './product.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ProductModel)
    private readonly productModel: ModelType<ProductModel>,
  ) {}

  async create(
    dto: CreateProductDto,
  ): Promise<DocumentType<ProductModel> | null> {
    return this.productModel.create(dto);
  }

  async findById(id: string): Promise<DocumentType<ProductModel>> {
    return this.productModel.findById(id).exec();
  }
  async deleteById(id: string): Promise<DocumentType<ProductModel>> {
    return this.productModel.findByIdAndDelete(id).exec();
  }

  async updateById(
    id: string,
    dto: CreateProductDto,
  ): Promise<DocumentType<ProductModel>> {
    return this.productModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async findWithReviews(dto: FindProductDto) {
    return this.productModel
      .aggregate([
        {
          $match: {
            categories: dto.category,
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
        {
          $limit: dto.limit,
        },
        {
          $lookup: {
            from: 'Review',
            localField: '_id',
            foreignField: 'productId',
            as: 'reviews',
          },
        },
        {
          $addFields: {
            reviewCounts: { $size: '$reviews' },
            reviewAvg: { $avg: '$reviews.rating' },
          },
        },
      ])
      .exec() as unknown as Promise<
      Array<
        ProductModel & {
          reviews: Array<ReviewModel>;
          reviewCounts: number;
          reviewAvg: number;
        }
      >
    >;
  }
}
