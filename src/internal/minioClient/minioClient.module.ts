import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-client';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MinioClientService } from '@/internal/minioClient/services/minioClient.service';
import { ImageProccessingService } from '@/internal/minioClient/services/imageProcessing.service';

@Module({
  imports: [
    MinioModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        endPoint: configService.get('S3_ENDPOINT'),
        port: parseInt(configService.get('S3_PORT')),
        useSSL: configService.get('S3_ENDPOINT') !== 'minio',
        accessKey: configService.get('S3_ACCESS_KEY_ID'),
        secretKey: configService.get('S3_SECRET_ACCESS_KEY'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers: [MinioClientService, ImageProccessingService],
  exports: [MinioClientService, ImageProccessingService],
})
export class MinioClientModule {}
