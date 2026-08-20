import { InjectModel } from "@nestjs/mongoose";
import { ItemRepositoryPort } from "src/item/domain/ports/outbound/item.repository.port";
import { ItemDocument, ItemEntity } from "../../persistence/schemas/item.schema";
import { Model } from "mongoose";
import { Item } from "src/item/domain/models/items";
import { createItemCommand } from "src/item/domain/ports/inbound/create-item.use-case.port";
import { ItemMapper } from "../../persistence/mappers/item.mapper";



export class ItemRepository implements ItemRepositoryPort{
    constructor(
        @InjectModel(ItemEntity.name)
        private readonly itemModel: Model<ItemDocument>,
    ) {}

    async createItem(item: Item): Promise<Item> {
        const insertItem = ItemMapper.toPersistence(item)
        const createdItem = new this.itemModel(insertItem)
        await createdItem.save()
        return ItemMapper.toDomain(createdItem)
    }
}