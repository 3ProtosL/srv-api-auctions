
import { Item } from "src/item/domain/models/items";
import { ItemDocument } from "../schemas/item.schema";


export class ItemMapper {
    static toPersistence(domain: Item): Partial<ItemDocument>{
        return {
            title: domain.title,
            description: domain.description,
            category: domain.category,
            condition: domain.condition,
            // images:
            statusEnum: domain.statusEnum,
            // sellerUserId: 
        }
    }

    static toDomain(doc: ItemDocument): Item {
        return new Item(
            doc._id.toString(),
            doc.title,
            doc.description,
            doc.category,
            doc.condition,
            doc.statusEnum
        )
    }
}