import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './exception/all-exception.filter';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const corsOptions: CorsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders:
    'Content-Type, Authorization, Content-Length, X-Requested-With, Accept, Accept-Versioning, Origin, Access-Control-Request-Headers, Access-Control-Request-Method',
  credentials: true,
  exposedHeaders: 'Authorization, Content-Type',
  maxAge: 1728000,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT');
  app.enableCors(corsOptions);

  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  // transform data to DTO
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // handle global exception
  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('Life manager documents')
    .setDescription('The life manager API description')
    .setVersion('1.0')
    .addTag('life-manager')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  //  get port from env
  if (!port) {
    throw new Error('PORT must be defined at .env');
  }
  const server = await app.listen(port || 3001);
  server.setTimeout(10 * 60 * 1000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
