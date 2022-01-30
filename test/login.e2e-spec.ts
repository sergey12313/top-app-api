import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { LOGIN_DTO } from './test.constant';
import { disconnect } from 'mongoose';
import { PASSWORD_INCORECT, USER_NOT_FOUND } from '../src/auth/auth.constants';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) success', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(LOGIN_DTO)
      .expect(200)
      .then(({ body: { access_token } }) => {
        expect(access_token).toBeDefined();
      });
  });
  it('/auth/login (POST) fail email not found', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ login: 'test@test.ru', password: '123' })
      .expect(401)
      .then(({ body }) => {
        expect(body.message).toBe(USER_NOT_FOUND);
      });
  });

  it('/auth/login (POST) password incorect', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...LOGIN_DTO, password: '123' })
      .expect(401)
      .then(({ body }) => {
        expect(body.message).toBe(PASSWORD_INCORECT);
      });
  });

  it('/auth/login (POST) email validation fail', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ login: 'hello', password: '123' })
      .expect(400)
      .then(({ body }) => {
        expect(body.message.length).toBe(1);
      });
  });

  it('/auth/login (POST) email validation fail', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.message.length).toBe(2);
      });
  });

  afterAll(() => {
    disconnect();
  });
});
// export const USER_NOT_FOUND = 'Пользователь с таким email не найден';
// export const PASSWORD_INCORECT = 'Не верный пароль';
