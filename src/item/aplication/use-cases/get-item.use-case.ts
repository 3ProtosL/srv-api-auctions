import { Injectable } from "@nestjs/common";
import { Item } from "src/item/domain/models/items";
import { getItemUseCasePort } from "src/item/domain/ports/inbound/get-item.use-case.port";
import { ItemRepositoryPort } from "src/item/domain/ports/outbound/item.repository.port";



@Injectable()
export class getItemUseCase implements getItemUseCasePort{
    constructor(private readonly itemRepository: ItemRepositoryPort) {}

    execute(id:string): Promise<Item>{
        return this.itemRepository.getItem(id)
    }

}