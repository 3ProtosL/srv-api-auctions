export interface FileToUpload {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

export interface AppwriteUploadedImage {
  url: string;
  ObjectId: string; // Aquí guardamos el ID generado por Appwrite ($id)
  isPrimary: boolean;
}

export abstract class StoragePort{
    abstract uploadImage(file: FileToUpload, isPrimary?: boolean): Promise<AppwriteUploadedImage>;
}

