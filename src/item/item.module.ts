import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { CreateItemUseCase } from './aplication/use-cases/create-item.use-case';
import { ItemRepositoryPort } from './domain/ports/outbound/item.repository.port';
import { ItemRepository } from './infrastructure/adapters/outbound/item.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemEntity, ItemSchema } from './infrastructure/persistence/schemas/item.schema';
import { AppwriteStorageAdapter } from './infrastructure/adapters/outbound/appwrite-storage.adapter';
import { StoragePort } from './domain/ports/outbound/storage.port';
import { envs } from 'src/shared/env';

@Module({
  imports: [
    MongooseModule.forRoot(envs.mongoUri),
    MongooseModule.forFeature([
            { name: ItemEntity.name, schema: ItemSchema },
        ]),
      ],
  controllers: [ItemController],
  providers: [
        CreateItemUseCase,
        {
            provide: ItemRepositoryPort,
            useClass: ItemRepository,
        },
        {
            provide: StoragePort,
            useClass: AppwriteStorageAdapter,
        }
    ],
})
export class ItemModule {}
