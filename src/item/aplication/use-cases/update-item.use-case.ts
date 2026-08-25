// application/use-cases/update-item.use-case.ts
import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { Item } from "src/item/domain/models/items";
import { UpdateItemCommand, UpdateItemUseCasePort } from "src/item/domain/ports/inbound/update-item.use-case.port";
import { ItemRepositoryPort } from "src/item/domain/ports/outbound/item.repository.port";
import { StoragePort } from "src/item/domain/ports/outbound/storage.port";

@Injectable()
export class UpdateItemUseCase implements UpdateItemUseCasePort {
    constructor(
        @Inject(ItemRepositoryPort)
        private readonly itemRepository: ItemRepositoryPort,
        @Inject(StoragePort)
        private readonly storagePort: StoragePort,
    ) {}

    async execute(command: UpdateItemCommand): Promise<Item> {
        const currentItem = await this.itemRepository.getItem(command._id);
        if (!currentItem) {
            throw new NotFoundException(`Item con id ${command._id} no encontrado`);
        }

        let updatedImagesList = command.images ?? currentItem.images;

        if (command.newFiles && command.newFiles.length > 0) {
            const newlyUploadedImages = await Promise.all(
                command.newFiles.map((file, index) =>
                    this.storagePort.uploadImage(
                        file,
                        updatedImagesList.length === 0 && index === 0 
                    )
                )
            );
            updatedImagesList = [...updatedImagesList, ...newlyUploadedImages];
        }

        if (command.images) {
            const keptObjectIds = new Set(command.images.map(img => img.ObjectId));
            const imagesToDelete = currentItem.images.filter(
                (oldImg) => !keptObjectIds.has(oldImg.ObjectId)
            );

            await Promise.all(
                imagesToDelete.map((img) => this.storagePort.deleteFile(img.ObjectId))
            );
        }

        return this.itemRepository.updateItem({
            ...command,
            images: updatedImagesList,
        });
    }
}