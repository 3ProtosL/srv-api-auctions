import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { CreateItemUseCase } from './aplication/use-cases/create-item.use-case';
import { ItemRepositoryPort } from './domain/ports/outbound/item.repository.port';
import { ItemRepository } from './infrastructure/adapters/outbound/item.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemEntity, ItemSchema } from './infrastructure/persistence/schemas/item.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/srv-api-auctions'),
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
    ],
})
export class ItemModule {}
