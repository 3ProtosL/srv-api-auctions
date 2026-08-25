import { Injectable } from "@nestjs/common";
import { DeleteItemUseCasePort } from "src/item/domain/ports/inbound/delete-item.use-case.port";
import { ItemRepositoryPort } from "src/item/domain/ports/outbound/item.repository.port";


@Injectable()
export class DeleteItemUseCase implements DeleteItemUseCasePort{
    constructor(private readonly itemRepository: ItemRepositoryPort) {}

    execute(id: string) {
        const ans = this.itemRepository.delete(id)
        return ans;
    }
}