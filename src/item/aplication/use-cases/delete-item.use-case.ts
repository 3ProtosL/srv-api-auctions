import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { DeleteItemUseCasePort } from "src/item/domain/ports/inbound/delete-item.use-case.port";
import { ItemRepositoryPort } from "src/item/domain/ports/outbound/item.repository.port";
import { StoragePort } from "src/item/domain/ports/outbound/storage.port";

@Injectable()
export class DeleteItemUseCase implements DeleteItemUseCasePort {
    constructor(
        @Inject(ItemRepositoryPort)
        private readonly itemRepository: ItemRepositoryPort,
        @Inject(StoragePort)
        private readonly storagePort: StoragePort,
    ) {}

    async execute(id: string): Promise<{ message: string }> {
        // 1. Obtener el ítem actual para extraer los ObjectId de sus imágenes
        const currentItem = await this.itemRepository.getItem(id);
        if (!currentItem) {
            throw new NotFoundException(`El ítem con el id "${id}" no existe`);
        }

        // 2. Extraer los ObjectIds de las imágenes asociadas
        const imageIdsToDelete = currentItem.images
            ?.map(img => img.ObjectId)
            .filter(Boolean) ?? [];

        // 3. Eliminar físicamente en Appwrite
        if (imageIdsToDelete.length > 0) {
            this.deleteImagesAsync(imageIdsToDelete);
        }

        // 4. Eliminar el documento de la base de datos
        return await this.itemRepository.delete(id);
    }

    private async deleteImagesAsync(objectIds: string[]): Promise<void> {
        const results = await Promise.allSettled(
            objectIds.map(id => this.storagePort.deleteFile(id))
        );

        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.error(
                    `[Appwrite Delete Warning] No se pudo eliminar la imagen ${objectIds[index]}:`,
                    result.reason
                );
            }
        });
    }
}