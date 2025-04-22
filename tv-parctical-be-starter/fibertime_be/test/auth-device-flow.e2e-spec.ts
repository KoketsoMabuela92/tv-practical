import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
describe('Authentication and Device Connection Flow (e2e)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });
  describe('Complete User Device Pairing Flow', () => {
    let phoneNumber: string;
    let deviceCode: string;
    let accessToken: string;
    it('should request OTP', async () => {
      phoneNumber = `+27test${Math.floor(1000 + Math.random() * 9000)}`;
      const response = await request(app.getHttpServer())
        .post('/api/auth/request-otp')
        .send({ cell_number: phoneNumber })
        .expect(201);
      expect(response.body).toHaveProperty('otp');
      expect(response.body.otp).toHaveLength(6);
    });
    it('should login with OTP', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ 
          cell_number: phoneNumber, 
          otp: '123456' 
        })
        .expect(201);
      expect(response.body).toHaveProperty('access_token');
      accessToken = response.body.access_token;
    });
    it('should create device code', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/device/create-device-code')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ mac_address: 'AA:BB:CC:DD:EE:FF' })
        .expect(201);
      expect(response.body).toHaveProperty('code');
      deviceCode = response.body.code;
      expect(deviceCode).toHaveLength(4);
    });
    it('should connect device', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/device/connect-device')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ device_id: deviceCode })
        .expect(201);
      expect(response.body).toHaveProperty('status');
      expect(['PENDING', 'CONNECTED']).toContain(response.body.status);
    });
    it('should get connection status', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/device/connection-status?device_id=${deviceCode}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      expect(response.body).toHaveProperty('status');
      expect(['PENDING', 'CONNECTED']).toContain(response.body.status);
    });
  });
  describe('Error Scenarios', () => {
    it('should reject invalid OTP', async () => {
      const phoneNumber = `+27test${Math.floor(1000 + Math.random() * 9000)}`;
      await request(app.getHttpServer())
        .post('/api/auth/request-otp')
        .send({ cell_number: phoneNumber })
        .expect(201);
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ 
          cell_number: phoneNumber, 
          otp: 'invalid' 
        })
        .expect(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Invalid OTP');
    });
    it('should reject connection with invalid device code', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/device/connect-device')
        .send({ device_id: 'INVALID' })
        .expect(401);
      expect(response.body).toHaveProperty('message');
    });
  });
});
