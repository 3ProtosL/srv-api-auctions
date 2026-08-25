import { ItemsPagination } from "../../models/items-pagination"


export interface FindItemsCommand {
    limit: number
    nextCursor?: string
    previousCursor?: string
    sortBy: string
    sortDirection: string
}

export abstract class FindItemsUseCasePort {
    abstract execute(command: FindItemsCommand): Promise<ItemsPagination>
}
