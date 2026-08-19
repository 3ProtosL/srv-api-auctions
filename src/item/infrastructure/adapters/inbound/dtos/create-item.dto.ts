import { IsEnum, IsNotEmpty, IsString} from "class-validator"
import { ItemCategory, ItemCondition, ItemStatus } from "src/item/domain/constants/enums"

export class CreateItemDto {

    @IsString()
    _id: string


    @IsString()
    title: string

    @IsString()
    description: string
    
    @IsNotEmpty()
    @IsEnum(ItemCategory)
    category: ItemCategory

    @IsNotEmpty()
    @IsEnum(ItemCondition)
    condition: ItemCondition
    // images: [{url: string, isPrimary: boolean, ObjectId: string}]

    @IsNotEmpty()
    @IsEnum(ItemStatus)
    statusEnum: ItemStatus
     // sellerUserId: ObjectID
}
