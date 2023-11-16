import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

import { AppModule } from '@/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppDataSource } from '@/typeOrm.config';
import { MinioClientService } from '@/internal/minioClient/services/minioClient.service';
import { getLogLevel } from '@internal/utils/getLogLevel';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: getLogLevel(Boolean(process.env.IN_PRODUCTION)),
  });

  app.useGlobalPipes(
    new ValidationPipe({ skipMissingProperties: true, transform: true }),
  );

  app.use(cookieParser());

  await AppDataSource.initialize();

  const configService = app.get(ConfigService);

  if (!configService.get('IN_PRODUCTION')) {
    const bucketProcessingService = app.get(MinioClientService);
    await bucketProcessingService.setBucketPolicy(
      configService.get('S3_BUCKET_NAME'),
    );
  }

  app.enableCors({
    origin: [configService.get('FRONTEND_URL')],
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Boilerplate NestJS')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
