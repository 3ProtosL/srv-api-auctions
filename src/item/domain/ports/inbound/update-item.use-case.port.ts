// src/item/domain/ports/inbound/update-item.use-case.port.ts

import { ItemCategory, ItemCondition, ItemStatus } from "../../constants/enums";
import { Item } from "../../models/items";
import { FileToUpload } from "../outbound/storage.port";

export interface ItemImagePayload {
    url?: string;
    isPrimary?: boolean;
    ObjectId?: string; 
}

export interface UpdateItemCommand {
    _id: string; 
    title?: string;
    description?: string;
    category?: ItemCategory;
    condition?: ItemCondition;
    statusEnum?: ItemStatus;
    incomingImages?: ItemImagePayload[];
    newFiles?: FileToUpload[];
    images?: ItemImagePayload[];
}

export abstract class UpdateItemUseCasePort {
    abstract execute(command: UpdateItemCommand): Promise<Item>;
}