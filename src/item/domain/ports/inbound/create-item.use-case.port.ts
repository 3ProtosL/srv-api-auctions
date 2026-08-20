import { ItemCategory, ItemCondition, ItemStatus } from "../../constants/enums";
import { Item } from "../../models/items";
import { FileToUpload } from "../outbound/storage.port";


export interface ItemData{
    _id: string,
    title: string,
    description: string,
    category: ItemCategory,
    condition: ItemCondition,
    images: {url: string, isPrimary: boolean, ObjectId: string}[],
    statusEnum: ItemStatus,
    // sellerUserId: ObjectID
}

export type createItemCommand = Omit<ItemData, 'images'> & {
  files: FileToUpload[]; 
};

export abstract class CreateItemUseCasePort{
    abstract execute(command: createItemCommand): Promise<Item>
}