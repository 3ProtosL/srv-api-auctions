import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { ItemCategory, ItemCondition, ItemStatus } from "src/item/domain/constants/enums";


@Schema({ _id: false })
class ImageSubSchema {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true, default: false })
  isPrimary: boolean;

  @Prop({ required: true })
  ObjectId: string;
}

const ImageSubSchemaFactory = SchemaFactory.createForClass(ImageSubSchema);

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

    @Prop({ type: [ImageSubSchemaFactory], default: [] })
    images: ImageSubSchema[];

    // sellerUserId: ObjectID
}



export type ItemDocument = HydratedDocument<ItemEntity>
export const ItemSchema = SchemaFactory.createForClass(ItemEntity)