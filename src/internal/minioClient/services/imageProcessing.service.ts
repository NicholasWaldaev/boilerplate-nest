import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { MinioClientService } from '@/internal/minioClient/services/minioClient.service';
import { BufferedFile } from '@internal/minioClient/file.model';

@Injectable()
export class ImageProccessingService {
  private readonly bucketName: string =
    this.configService.get('S3_BUCKET_NAME');
  private readonly folderName: string = 'avatar';

  constructor(
    private readonly minioClientService: MinioClientService,
    private readonly configService: ConfigService,
  ) {}

  public async uploadImage(
    file: BufferedFile,
    userId: string,
    bucketName: string = this.bucketName,
  ) {
    if (!(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg')) {
      throw new HttpException(
        'File type not supported',
        HttpStatus.BAD_REQUEST,
      );
    }

    const timestamp = Date.now().toString();

    const hashedFileName = crypto
      .createHash('md5')
      .update(timestamp)
      .digest('hex');

    const extension = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );

    const metaData = {
      'Content-Type': file.mimetype,
    };

    const fileName = hashedFileName + extension;

    this.minioClientService.client.putObject(
      bucketName,
      `${userId}/${this.folderName}/${fileName}`,
      file.buffer,
      metaData,
    );

    return {
      url: `${this.bucketName}/${userId}/${this.folderName}/${fileName}`,
    };
  }

  public removeObject(
    userId: string,
    filePath: string,
    bucketName: string = this.bucketName,
  ) {
    const fileName = filePath.split('/').pop();
    this.minioClientService.client.removeObject(
      bucketName,
      `/${userId}/${this.folderName}/${fileName}`,
    );
  }
}
