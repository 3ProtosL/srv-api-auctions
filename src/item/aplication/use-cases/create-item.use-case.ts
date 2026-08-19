import { Injectable } from "@nestjs/common";
import { CreateItemUseCasePort, 
        createItemCommand 
    } from '../../domain/ports/inbound/create-item.use-case.port';
import { ItemRepositoryPort } from "src/item/domain/ports/outbound/item.repository.port";
import { Item } from "src/item/domain/models/items";


@Injectable()
export class CreateItemUseCase implements CreateItemUseCasePort {
    constructor(private readonly itemRepository: ItemRepositoryPort){}
    execute(command: createItemCommand): Promise<Item> {
        return this.itemRepository.createItem(command) 
    }
}