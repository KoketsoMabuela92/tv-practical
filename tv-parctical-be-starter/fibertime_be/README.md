<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Fibertime TV Backend is a NestJS application that provides APIs for connecting TV devices to the Fibertime service. It handles device pairing, user authentication, and real-time connection status updates.

## Features

- TV device pairing with unique 4-character codes
- Phone number authentication with OTP
- Real-time connection status updates via WebSocket
- JWT-based authentication
- Swagger API documentation
- PostgreSQL database with TypeORM

## Prerequisites

- Node.js (v18 or later)
- PostgreSQL
- Redis (optional, for caching)

## Project Setup

1. Install dependencies:
```bash
$ npm install
```

2. Create a `.env` file in the root directory with the following variables:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=fibertime_db
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Running the Application

```bash
# Development mode
$ npm run start:dev

# Production mode
$ npm run start:prod
```

The application will be available at `http://localhost:3000`.
Swagger documentation can be accessed at `http://localhost:3000/api/docs`.

## Swagger API Documentation

### Accessing Swagger Docs

#### Local Development
```
http://localhost:3000/api/docs
```

#### Ngrok Deployment
```
https://[your-ngrok-subdomain].ngrok.io/api/docs
```

### Swagger Features
- Interactive API documentation
- Supports Bearer Token authentication
- Allows direct API endpoint testing
- Provides detailed request/response schemas

### Authentication in Swagger
1. Click the "Authorize" button
2. Enter your JWT Bearer Token
3. Test authenticated endpoints

### Generating Test Token
1. Use `/api/auth/request-otp` endpoint
2. Request OTP for a phone number
3. Use `/api/auth/login` with OTP
4. Copy the returned JWT token

## API Endpoints

### Device Management
- `POST /api/device/create-device-code` - Generate a pairing code
- `GET /api/device/device` - Get device by code
- `POST /api/device/connect-device` - Connect device to user
- `GET /api/device/connection-status/:deviceId` - Check connection status

### Authentication
- `POST /api/auth/request-otp` - Request OTP for phone number
- `POST /api/auth/login` - Verify OTP and login

## WebSocket Events

### Client to Server
- `joinDevice` - Join a device room for real-time updates

### Server to Client
- `connectionStatus` - Receive device connection status updates

## Testing

### Running Tests

#### Unit Tests
```bash
npm run test
```

#### Coverage Report
```bash
npm run test:cov
```

#### Watch Mode (Development)
```bash
npm run test:watch
```

#### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
- Minimum coverage thresholds:
  - Branches: 70%
  - Functions: 70%
  - Lines: 70%
  - Statements: 70%

### Test Strategies
- Unit tests for individual services and components
- Integration tests for API endpoints
- E2E tests for critical user flows
- Mocking external dependencies
- Testing error scenarios and edge cases

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Docker Deployment

### Prerequisites
- Docker
- Docker Compose

### Running the Application

1. Clone the repository
2. Navigate to the project directory
3. Run the following command:

```bash
docker-compose up --build
```

This will start:
- NestJS Backend (on port 3000)
- PostgreSQL Database (on port 5432)
- Redis Cache (on port 6379)

### Stopping the Application

```bash
docker-compose down
```

### Environment Variables

The following environment variables are configured in `docker-compose.yml`:
- `DB_HOST`: PostgreSQL database host
- `DB_PORT`: Database port
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRES_IN`: JWT token expiration time
- `REDIS_HOST`: Redis cache host
- `REDIS_PORT`: Redis cache port

### Accessing the Application

- API: `http://localhost:3000`
- Swagger Docs: `http://localhost:3000/api`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

## Ngrok Live Deployment

### Prerequisites
- ngrok account (free tier available)
- ngrok CLI installed

### Setup
1. Install ngrok:
```bash
# macOS
brew install ngrok

# Other platforms
Visit https://ngrok.com/download
```

2. Authenticate ngrok:
```bash
ngrok config add-authtoken YOUR_NGROK_AUTH_TOKEN
```

### Running with Ngrok
```bash
# Make the script executable
chmod +x ngrok.sh

# Run the script
./ngrok.sh
```

### Ngrok Features
- Generates a public HTTPS URL
- Supports web traffic inspection
- Allows secure tunneling to localhost

### Security Considerations
- Use ngrok's authentication
- Limit exposure time
- Do not share sensitive ngrok URLs publicly

## Stay in touch

- Author - [Koketso Mabuela](https://github.com/KoketsoMabuela92)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
