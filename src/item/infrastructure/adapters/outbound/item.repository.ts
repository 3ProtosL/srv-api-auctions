import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { BadRequestException, HttpException, HttpStatus} from "@nestjs/common";

import { Item } from "src/item/domain/models/items";
import { ItemMapper } from "../../persistence/mappers/item.mapper";
import { ItemDocument, ItemEntity } from "../../persistence/schemas/item.schema";
import { decodeCursor, encodeCursor } from "src/shared/encode";

import { ItemRepositoryPort } from "src/item/domain/ports/outbound/item.repository.port";
import { ItemsPagination } from "src/item/domain/models/items-pagination";
import { FindItemsCommand } from "src/item/domain/ports/inbound/find-items.use-case.port";
import { UpdateItemCommand } from "src/item/domain/ports/inbound/update-item.use-case.port";




export class ItemRepository implements ItemRepositoryPort{
    constructor(
        @InjectModel(ItemEntity.name)
        private readonly itemModel: Model<ItemDocument>,
    ) {}

    async createItem(item: Item): Promise<Item> {
        const insertItem = ItemMapper.toPersistence(item)
        const createdItem = new this.itemModel(insertItem)
        await createdItem.save()
        return ItemMapper.toDomain(createdItem)
    }

    async findItems(input: FindItemsCommand): Promise<ItemsPagination> {
    const {
        limit = 10,
        nextCursor,
        previousCursor,
        sortBy = 'createdAt',
        sortDirection = 'desc',
    } = input;

    const isReverse = !!previousCursor;
    const sortOrderNumber = isReverse
        ? sortDirection === 'asc' ? -1 : 1
        : sortDirection === 'asc' ? 1 : -1;

    const query: Record<string, any> = {};
    const cursor = nextCursor || previousCursor;

    if (cursor) {
        let customValue: any;
        let idStr: string;

        // 1. Decodificar y validar el cursor
        try {
            [customValue, idStr] = decodeCursor(cursor);

            // Validar que el ID sea un ObjectId legítimo de MongoDB
            if (!idStr || !Types.ObjectId.isValid(idStr)) {
                throw new Error("Invalid ObjectId format");
            }
        } catch {
            // Lanza HTTP 400 inmediato. Cancela el flujo sin ejecutar query.
            throw new BadRequestException("El cursor proporcionado no es válido o está corrupto");
        }

        const _id = new Types.ObjectId(idStr);
        const operator = sortOrderNumber === 1 ? '$gt' : '$lt';

        // 2. CORRECCIÓN DE TIPO: Convertir a Date si el valor decodificado es una cadena ISO de fecha
        let parsedCustomValue = customValue;
        if (typeof customValue === 'string' && !isNaN(Date.parse(customValue))) {
            parsedCustomValue = new Date(customValue);
        }

        // 3. Construcción del Keyset Query
        query['$or'] = [
            { [sortBy]: { [operator]: parsedCustomValue } },
            {
                [sortBy]: parsedCustomValue,
                _id: { [operator]: _id },
            },
        ];
    }

    // 4. Consulta a MongoDB
    const items = await this.itemModel
        .find(query)
        .sort({ [sortBy]: sortOrderNumber, _id: sortOrderNumber })
        .limit(limit + 1)
        .lean()
        .exec();

    if (isReverse) items.reverse();

    let hasNext = false;
    let hasPrevious = false;

    if (nextCursor) {
        hasPrevious = true;
        if (items.length > limit) {
            hasNext = true;
            items.pop();
        }
    } else if (previousCursor) {
        hasNext = true;
        if (items.length > limit) {
            hasPrevious = true;
            items.shift();
        }
    } else {
        if (items.length > limit) {
            hasNext = true;
            items.pop();
        }
    }

    const firstItem = items[0];
    const lastItem = items[items.length - 1];

    let nextCursorRes: string | null = null;
    let previousCursorRes: string | null = null;

    if (hasNext && lastItem) {
        nextCursorRes = encodeCursor(
            lastItem[sortBy],
            lastItem._id.toString(),
        );
    }

    if (hasPrevious && firstItem) {
        previousCursorRes = encodeCursor(
            firstItem[sortBy],
            firstItem._id.toString(),
        );
    }

    return {
        data: items.map((p) => ItemMapper.toDomain(p)),
        meta: {
            hasNext,
            hasPrevious,
            nextCursor: nextCursorRes,
            previousCursor: previousCursorRes,
        },
    };
}

    async getItem(id: string): Promise<Item> {
        const item = await this.validateItem(id)
        return ItemMapper.toDomain(item!)
    }

    async validateItem(id: string): Promise<ItemDocument | null> {
        const product = await this.itemModel.findById(id)
        if (!product) {
            throw new HttpException('Item not found', HttpStatus.NOT_FOUND)
        }

        return product
    }

    async updateItem(command: UpdateItemCommand): Promise<Item>{
        const { _id, ...updatePayload } = command;

        await this.validateItem(_id)
        const item = await this.itemModel.findByIdAndUpdate(
            _id, 
            {
                $set: {...updatePayload} 
            },
            {
                returnDocument: 'after' 
            })
        return ItemMapper.toDomain(item!)
    }

    async delete(id: string): Promise<{ message: string }> {
        await this.itemModel.findByIdAndDelete(id);
        return { message: `El ítem con el id "${id}" fue eliminado` };
    }
}