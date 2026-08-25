import { Module } from '@nestjs/common';
import { envs } from 'src/shared/env';
import { MongooseModule } from '@nestjs/mongoose';

import { ItemController } from './item.controller';

import { CreateItemUseCase } from './aplication/use-cases/create-item.use-case';
import { getItemUseCase } from './aplication/use-cases/get-item.use-case';
import { ItemRepository } from './infrastructure/adapters/outbound/item.repository';

import { ItemRepositoryPort } from './domain/ports/outbound/item.repository.port';
import { StoragePort } from './domain/ports/outbound/storage.port';
import { AppwriteStorageAdapter } from './infrastructure/adapters/outbound/appwrite-storage.adapter';

import { ItemEntity, ItemSchema } from './infrastructure/persistence/schemas/item.schema';
import { FindItemsUseCase } from './aplication/use-cases/find-items.use-case';
import { DeleteItemUseCase } from './aplication/use-cases/delete-item.use-case';
import { UpdateItemUseCase } from './aplication/use-cases/update-item.use-case';

@Module({
  imports: [
    MongooseModule.forRoot(envs.mongoUri),
    MongooseModule.forFeature([
            { name: ItemEntity.name, schema: ItemSchema },
        ]),
      ],
  controllers: [ItemController],
  providers: [
        UpdateItemUseCase,
        FindItemsUseCase,
        CreateItemUseCase,
        getItemUseCase,
        DeleteItemUseCase,
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
