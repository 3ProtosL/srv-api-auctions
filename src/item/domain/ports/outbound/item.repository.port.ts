import { Item } from "../../models/items";
import { ItemsPagination } from "../../models/items-pagination";
import { FindItemsCommand } from "../inbound/find-items.use-case.port";
import { UpdateItemCommand } from "../inbound/update-item.use-case.port";


export abstract class ItemRepositoryPort {
    abstract createItem(item: Item): Promise<Item>
    abstract getItem(id: string): Promise<Item>
        abstract findItems(
        input: FindItemsCommand,
    ): Promise<ItemsPagination>
    abstract delete(id: string)
    abstract updateItem(body: UpdateItemCommand): Promise<Item>
}