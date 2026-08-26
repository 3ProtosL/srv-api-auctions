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
        const hasImageChanges = Boolean(command.incomingImages) || (command.newFiles?.length ?? 0) > 0;

        if (!hasImageChanges) {
            return this.itemRepository.updateItem(command);
        }

        const currentItem = await this.itemRepository.getItem(command._id);
        if (!currentItem) {
            throw new NotFoundException(`Item con id ${command._id} no encontrado`);
        }

        const incoming = command.incomingImages ?? [];

        const keptImages = incoming.filter(img => Boolean(img.ObjectId));
        const keptObjectIds = new Set(keptImages.map(img => img.ObjectId));

        const newlyUploadedImages = command.newFiles?.length
            ? await Promise.all(
                command.newFiles.map((file, index) =>
                    this.storagePort.uploadImage(file, keptImages.length === 0 && index === 0)
                )
              )
            : [];

        const finalImagesList = [...keptImages, ...newlyUploadedImages];

        const imagesToDelete = currentItem.images.filter(
            oldImg => !keptObjectIds.has(oldImg.ObjectId)
        );

        if (imagesToDelete.length > 0) {
            this.deleteImagesAsync(imagesToDelete.map(img => img.ObjectId));
        }

        return this.itemRepository.updateItem({
            ...command,
            images: finalImagesList,
        });
    }

    private async deleteImagesAsync(objectIds: string[]): Promise<void> {
        const results = await Promise.allSettled(
            objectIds.map(id => this.storagePort.deleteFile(id))
        );

        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.error(`[Appwrite Cleanup Warning] No se pudo eliminar la imagen ${objectIds[index]}:`, result.reason);
            }
        });
    }
}