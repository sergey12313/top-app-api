import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TopPageModule } from './top-page/top-page.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { RevievController } from './reviev/reviev.controller';

@Module({
  imports: [TopPageModule, AuthModule, ProductModule, ReviewModule],
  controllers: [AppController, RevievController],
  providers: [AppService],
})
export class AppModule {}
