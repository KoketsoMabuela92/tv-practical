import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
describe('Device Controller (e2e)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });
  describe('/api/device/create-device-code (POST)', () => {
    it('should create a device code', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/device/create-device-code')
        .send({ mac_address: 'AA:BB:CC:DD:EE:FF' })
        .expect(201);
      expect(response.body).toHaveProperty('code');
      expect(response.body.code).toHaveLength(4);
      expect(response.body.mac_address).toBe('AA:BB:CC:DD:EE:FF');
    });
    it('should validate mac address', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/device/create-device-code')
        .send({ mac_address: 'invalid-mac' })
        .expect(400);
      expect(response.body.message).toContain('mac_address must be a valid MAC address');
    });
  });
  describe('/api/device/connection-status (GET)', () => {
    it('should return connection status', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/device/create-device-code')
        .send({ mac_address: 'AA:BB:CC:DD:EE:FF' });
      const deviceId = createResponse.body.id;
      const statusResponse = await request(app.getHttpServer())
        .get(`/api/device/connection-status?device_id=${deviceId}`)
        .expect(200);
      expect(statusResponse.body).toHaveProperty('status');
      expect(['PENDING', 'CONNECTED', 'DISCONNECTED']).toContain(statusResponse.body.status);
    });
  });
});
