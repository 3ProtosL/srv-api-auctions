// src/item/infrastructure/adapters/outbound/appwrite-storage.adapter.ts
import { Injectable } from '@nestjs/common';
import { Client, Storage, ID } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';

import { AppwriteUploadedImage, FileToUpload, StoragePort } from 'src/item/domain/ports/outbound/storage.port';
import { envs } from 'src/shared/env';

@Injectable()
export class AppwriteStorageAdapter implements StoragePort {
  private storage: Storage;
  private bucketId: string;
  private rawEndpoint: string;
  private projectId: string;

  constructor() {
    const rawEndpointEnv = envs.appwrite.endpoint;
    
    const cleanEndpoint = rawEndpointEnv.replace(/\/+$/, '');
    this.rawEndpoint = cleanEndpoint.endsWith('/v1') ? cleanEndpoint : `${cleanEndpoint}/v1`;

    this.projectId = envs.appwrite.projectId;
    this.bucketId = envs.appwrite.bucketId;

    const client = new Client()
      .setEndpoint(this.rawEndpoint)
      .setProject(this.projectId)
      .setKey(envs.appwrite.apiKey);

    this.storage = new Storage(client);
  }

 async deleteFile(fileId: string): Promise<void> {
    try {
        await this.storage.deleteFile(envs.appwrite.bucketId, fileId);
      } catch (error) {
        console.error(`Error al eliminar el archivo ${fileId} en Appwrite:`, error);
      }
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