import { Injectable } from "@nestjs/common";
import { CreateItemUseCasePort, 
        createItemCommand 
    } from '../../domain/ports/inbound/create-item.use-case.port';
import { ItemRepositoryPort } from "src/item/domain/ports/outbound/item.repository.port";
import { Item } from "src/item/domain/models/items";
import { StoragePort } from "src/item/domain/ports/outbound/storage.port";
import { FileToUpload } from '../../domain/ports/outbound/storage.port';


@Injectable()
export class CreateItemUseCase implements CreateItemUseCasePort {
    constructor(
        private readonly itemRepository: ItemRepositoryPort,
        private readonly storage: StoragePort,
    ) {}

    async execute({ files = [], ...cmd }: createItemCommand & { files?: FileToUpload[] }): Promise<Item> {
        const images = await Promise.all(
            files.map((file, i) => this.storage.uploadImage(file, i === 0))
        );

        return this.itemRepository.createItem(
            new Item("", cmd.title, cmd.description, cmd.category, cmd.condition, images, cmd.statusEnum)
        );
    }
}