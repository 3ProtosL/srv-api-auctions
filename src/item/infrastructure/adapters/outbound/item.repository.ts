import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { HttpException, HttpStatus} from "@nestjs/common";

import { Item } from "src/item/domain/models/items";
import { ItemMapper } from "../../persistence/mappers/item.mapper";
import { ItemDocument, ItemEntity } from "../../persistence/schemas/item.schema";
import { decodeCursor, encodeCursor } from "src/shared/encode";

import { ItemRepositoryPort } from "src/item/domain/ports/outbound/item.repository.port";
import { ItemsPagination } from "src/item/domain/models/items-pagination";
import { FindItemsCommand } from "src/item/domain/ports/inbound/find-items.use-case.port";
import { UpdateItemDto } from '../inbound/dtos/update-item.dto';
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

    async findItems(
        input: FindItemsCommand,
    ): Promise<ItemsPagination> {
        const {
            limit = 10,
            nextCursor,
            previousCursor,
            sortBy = 'createdAt',
            sortDirection = 'desc',
        } = input

        const isReverse = !!previousCursor
        const sortOrderNumber = isReverse
            ? sortDirection === 'asc'
                ? -1
                : 1
            : sortDirection === 'asc'
              ? 1
              : -1
        const query = {}
        const cursor = nextCursor || previousCursor
        if (cursor) {
            try {
                const [customValue, id] = decodeCursor(cursor)
                const _id = new Types.ObjectId(id)
                const operator = sortOrderNumber === 1 ? '$gt' : '$lt'

                query['$or'] = [
                    { [sortBy]: { [operator]: customValue } },
                    {
                        [sortBy]: customValue,
                        _id: { [operator]: _id },
                    },
                ]
            } catch (error) {
                throw new Error('Invalid cursor')
            }
        }

        const items = await this.itemModel
            .find(query)
            .sort({ [sortBy]: sortOrderNumber, _id: sortOrderNumber })
            .limit(limit + 1)
            .lean()
            .exec()

        if (isReverse) items.reverse()

        let hasNext = false
        let hasPrevious = false

        if (nextCursor) {
            hasPrevious = true
            if (items.length > limit) {
                hasNext = true
                items.pop()
            }
        } else if (previousCursor) {
            hasNext = true
            if (items.length > limit) {
                hasPrevious = true
                items.shift()
            }
        } else {
            if (items.length > limit) {
                hasNext = true
                items.pop()
            }
        }

        const firstItem = items[0]
        const lastItem = items[items.length - 1]

        let nextCursorRes: string | null = null
        let previousCursorRes: string | null = null

        if (hasNext && lastItem) {
            nextCursorRes = encodeCursor(
                lastItem[sortBy],
                lastItem._id.toString(),
            )
        }

        if (hasPrevious && firstItem) {
            previousCursorRes = encodeCursor(
                firstItem[sortBy],
                firstItem._id.toString(),
            )
        }

        return {
            data: items.map((p) => ItemMapper.toDomain(p)),
            meta: {
                hasNext,
                hasPrevious,
                nextCursor: nextCursorRes,
                previousCursor: previousCursorRes,
            },
        }
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

    async delete(id: string){
        await this.getItem(id)
        await this.itemModel.findByIdAndDelete(id)
     
        return  { message: `el item con el id "${id}" fue eliminado`}
    }
}