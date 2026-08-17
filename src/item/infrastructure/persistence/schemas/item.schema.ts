import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { ItemCategory, ItemCondition, ItemStatus } from "src/item/domain/constants/enums";


@Schema()
export class ItemEntity{
    @Prop()
    title: string

    @Prop()
    description: string

    @Prop()
    category: ItemCategory

    @Prop()
    condition: ItemCondition
            
    @Prop()
    statusEnum: ItemStatus

    
    // images: [{url: string, isPrimary: boolean, ObjectId: string}]
    // sellerUserId: ObjectID
}

export type ItemDocument = HydratedDocument<ItemEntity>
export const ItemSchema = SchemaFactory.createForClass(ItemEntity)