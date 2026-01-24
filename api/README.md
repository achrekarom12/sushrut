# NestJS API

A basic NestJS API server with TypeScript support.

## Installation

```bash
npm install
```

## Running the app

```bash
# development
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## API Endpoints

- `GET /api` - Hello World endpoint
- `GET /api/health` - Health check endpoint

## Project Structure

```
src/
├── app.controller.ts    # Main controller
├── app.module.ts        # Root module
├── app.service.ts       # Main service
└── main.ts             # Application entry point
```

## Environment Variables

Create a `.env` file in the root directory:

```
PORT=3000
```

## License

ISC
