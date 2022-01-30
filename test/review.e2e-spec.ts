import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from 'src/review/dto/create-review.dto';
import { disconnect, Types } from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';

const productId = new Types.ObjectId().toHexString();
const randomId = new Types.ObjectId().toHexString();

const reviewDataDto: CreateReviewDto = {
  title: 'Заголовок',
  description: 'Тестовое описание',
  rating: 4,
  productId,
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let productId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/review/create (POST)', async () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send(reviewDataDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body._id;
        productId = body.productId;
        expect(createdId).toBeDefined();
      });
  });
  it('/review/byProduct/:productId (GET) success', async () => {
    return request(app.getHttpServer())
      .get('/review/byProduct/' + productId)
      .expect(200)
      .then(({ body }: request.Response) => {
        console.log(body);
        expect(body.length).toBe(1);
      });
  });

  it('/review/byProduct/:productId (GET) fail', async () => {
    return request(app.getHttpServer())
      .get('/review/byProduct/' + randomId)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(0);
      });
  });

  it('/review/:id (DELETE) success', async () => {
    return request(app.getHttpServer())
      .delete('/review/' + createdId)
      .expect(200)
      .then(({ body }: request.Response) => {
        createdId = body._id;
        expect(createdId).toBeDefined();
      });
  });

  it('/review/:id (DELETE) fail', async () => {
    return request(app.getHttpServer())
      .delete('/review/' + createdId)
      .expect(404)
      .then(({ body }: request.Response) => {
        expect(body?.message).toEqual(REVIEW_NOT_FOUND);
      });
  });

  afterAll(() => {
    disconnect();
  });
});
