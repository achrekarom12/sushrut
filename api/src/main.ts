import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './env';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors();

    // Set global prefix
    app.setGlobalPrefix('api');

    const port = PORT || 3000;
    await app.listen(port);

    console.log(`Application is running on: http://localhost:${port}/api`);
}

bootstrap();
