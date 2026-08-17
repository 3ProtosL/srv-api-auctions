import { ItemCategory, ItemCondition, ItemStatus, } from "../constants/enums";

export class Item{
    constructor(
       public _id: string,
       public title: string,
       public description: string,
       public category: ItemCategory,
       public condition: ItemCondition,
        // images: [{url: string, isPrimary: boolean, ObjectId: string}]
       public statusEnum: ItemStatus,
        // sellerUserId: ObjectID
    ) {}
}