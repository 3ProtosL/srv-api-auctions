import { ItemCategory, ItemCondition, ItemStatus } from "../../constants/enums";
import { Item } from "../../models/items";


export interface createItemCommand{
    _id: string,
    title: string,
    description: string,
    category: ItemCategory,
    condition: ItemCondition,
    images?: {url: string, isPrimary: boolean, ObjectId: string}[],
    statusEnum: ItemStatus,
    // sellerUserId: ObjectID
}

export abstract class CreateItemUseCasePort{
    abstract execute(command: createItemCommand): Promise<Item>
}