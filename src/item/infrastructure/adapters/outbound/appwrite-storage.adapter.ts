import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, Storage, ID } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';
import { AppwriteUploadedImage, FileToUpload, StoragePort } from 'src/item/domain/ports/outbound/storage.port';

@Injectable()
export class AppwriteStorageAdapter implements StoragePort {
  private storage: Storage;
  private bucketId: string;
  private rawEndpoint: string;
  private projectId: string;

  constructor(private readonly configService: ConfigService) {
    const rawEndpointEnv = this.configService.get<string>('APPWRITE_ENDPOINT') || 'https://sfo.cloud.appwrite.io/v1';
    
    const cleanEndpoint = rawEndpointEnv.replace(/\/+$/, '');
    this.rawEndpoint = cleanEndpoint.endsWith('/v1') ? cleanEndpoint : `${cleanEndpoint}/v1`;

    this.projectId = this.configService.getOrThrow<string>('APPWRITE_PROJECT_ID');
    this.bucketId = this.configService.getOrThrow<string>('APPWRITE_BUCKET_ID');
    const apiKey = this.configService.getOrThrow<string>('APPWRITE_API_KEY');

    const client = new Client()
      .setEndpoint(this.rawEndpoint)
      .setProject(this.projectId)
      .setKey(apiKey);

    this.storage = new Storage(client);
  }

  async uploadImage(file: FileToUpload, isPrimary: boolean = false): Promise<AppwriteUploadedImage> {
    const inputFile = InputFile.fromBuffer(file.buffer, file.originalname);

    const response = await this.storage.createFile(
      this.bucketId,
      ID.unique(),
      inputFile,
    );

    const publicBaseUrl = this.rawEndpoint.replace(/\/v1$/, '');
    const imageUrl = `${publicBaseUrl}/storage/buckets/${this.bucketId}/files/${response.$id}/view?project=${this.projectId}`;

    return {
      url: imageUrl,
      ObjectId: response.$id,
      isPrimary,
    };
  }
}