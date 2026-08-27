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
        const keptImagesMap = new Map(incoming.map(img => [img.ObjectId, img.isPrimary]));

        const keptImages: any[] = [];
        const idsToDelete: string[] = [];
        let hasPrimaryInKept = false;

        // 1. Un solo recorrido O(N) para clasificar imágenes
        for (const oldImg of currentItem.images) {
            if (keptImagesMap.has(oldImg.ObjectId)) {
                const isPrimary = keptImagesMap.get(oldImg.ObjectId) ?? oldImg.isPrimary;
                if (isPrimary) hasPrimaryInKept = true;

                keptImages.push({
                    ...oldImg,
                    isPrimary,
                });
            } else {
                idsToDelete.push(oldImg.ObjectId);
            }
        }

        // 2. Subida en paralelo de fotos nuevas
        const newlyUploadedImages = command.newFiles?.length
            ? await Promise.all(
                command.newFiles.map((file, index) =>
                    this.storagePort.uploadImage(file, !hasPrimaryInKept && index === 0)
                )
              )
            : [];

        let finalImagesList = [...keptImages, ...newlyUploadedImages];

        // 3. Fallback de Portada: Garantizar que al menos la primera imagen sea 'isPrimary'
        if (finalImagesList.length > 0 && !finalImagesList.some(img => img.isPrimary)) {
            finalImagesList[0] = { ...finalImagesList[0], isPrimary: true };
        }

        if (idsToDelete.length > 0) {
            this.deleteImagesAsync(idsToDelete);
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