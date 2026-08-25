import { ItemCategory, ItemCondition, ItemStatus } from "../../constants/enums"
import { Item } from "../../models/items"
import { FileToUpload } from "../outbound/storage.port";




export interface UpdateItemPayload{
    title: string
    description: string,
    category: ItemCategory,
    condition: ItemCondition,
    images: {url: string, isPrimary: boolean, ObjectId: string}[],
    statusEnum: ItemStatus,
    newFiles?: FileToUpload[]
}

export type UpdateItemCommand = {
    _id: string;
} & Partial<UpdateItemPayload>;

export abstract class UpdateItemUseCasePort {
    abstract execute(updateItemCommand: UpdateItemCommand): Promise<Item>
}