import { Injectable } from '@nestjs/common'
import { ItemsPagination } from 'src/item/domain/models/items-pagination'
import { FindItemsCommand, FindItemsUseCasePort } from 'src/item/domain/ports/inbound/find-items.use-case.port'
import { ItemRepositoryPort } from 'src/item/domain/ports/outbound/item.repository.port'



@Injectable()
export class FindItemsUseCase implements FindItemsUseCasePort {
    constructor(private readonly itemRepository: ItemRepositoryPort) {}

    execute(command: FindItemsCommand): Promise<ItemsPagination> {
        return this.itemRepository.findItems(command)
    }
}
