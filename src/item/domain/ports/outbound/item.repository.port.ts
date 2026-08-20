import { Item } from "../../models/items";
import { createItemCommand } from "../inbound/create-item.use-case.port";


export abstract class ItemRepositoryPort {
    abstract createItem(ietm: Item): Promise<Item>
}