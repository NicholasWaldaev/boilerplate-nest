import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MinioService } from 'nestjs-minio-client';
import { getBucketPolicy } from '@internal/minioClient/bucket.policy';

@Injectable()
export class MinioClientService {
  private readonly bucketName: string =
    this.configService.get('S3_BUCKET_NAME');

  constructor(
    private readonly minio: MinioService,
    private readonly configService: ConfigService,
  ) {}

  public get client() {
    return this.minio.client;
  }

  public setBucketPolicy(bucketName: string = this.bucketName) {
    this.client.setBucketPolicy(
      bucketName,
      getBucketPolicy(bucketName),
      function (err) {
        if (err) throw err;
        console.log('Bucket policy set');
      },
    );
  }
}
