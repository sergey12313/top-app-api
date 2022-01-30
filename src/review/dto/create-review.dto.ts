import { IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  title: string;
  @IsString()
  description: string;
  @Max(5)
  @Min(1)
  rating: number;
  @IsString()
  productId: string;
}
