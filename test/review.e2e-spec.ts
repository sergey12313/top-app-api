import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from 'src/review/dto/create-review.dto';
import { disconnect, Types } from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';
import { LOGIN_DTO } from './test.constant';

const productId = new Types.ObjectId().toHexString();
const randomId = new Types.ObjectId().toHexString();

const reviewDataDto: CreateReviewDto = {
  title: 'Заголовок',
  description: 'Тестовое описание',
  rating: 4,
  productId,
};
const failDataDto: Omit<CreateReviewDto, 'title'> = {
  description: 'Тестовое описание',
  rating: 4,
  productId,
};

describe('ReviewController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let productId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await request(app.getHttpServer())
      .post('/auth/login')
      .send(LOGIN_DTO)
      .then(({ body: { access_token } }) => {
        token = access_token;
      });
  });

  it('/review/create (POST) fail', async () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send(failDataDto)
      .expect(400);
  });

  it('/review/create (POST) succes', async () => {
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
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(({ body }: request.Response) => {
        createdId = body._id;
        expect(createdId).toBeDefined();
      });
  });

  it('/review/:id (DELETE) fail', async () => {
    return request(app.getHttpServer())
      .delete('/review/' + createdId)
      .set('Authorization', 'Bearer ' + token)
      .expect(404)
      .then(({ body }: request.Response) => {
        expect(body?.message).toEqual(REVIEW_NOT_FOUND);
      });
  });

  it('/review/:id (DELETE) fail without auth', async () => {
    return request(app.getHttpServer())
      .delete('/review/' + createdId)
      .expect(401);
  });

  afterAll(() => {
    disconnect();
  });
});
