import { Item } from "src/item/domain/models/items";
import { ItemDocument } from "../schemas/item.schema";

export class ItemMapper {
    static toPersistence(domain: Item): Partial<ItemDocument> {
        return {
            title: domain.title,
            description: domain.description,
            category: domain.category,
            condition: domain.condition,
            images: domain.images,
            statusEnum: domain.statusEnum,
        };
    }

    static toDomain(doc: ItemDocument): Item {
        return new Item(
            doc._id.toString(),
            doc.title,
            doc.description,
            doc.category,
            doc.condition,
            doc.images.map((img) => ({
                url: img.url,
                isPrimary: img.isPrimary,
                ObjectId: img.ObjectId,
            })),
            doc.statusEnum, // Pasado al final según la clase Item
        );
    }
}