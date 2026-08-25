import { Item } from "./items"


export class ItemsPagination {
    constructor(
        public readonly data: Item[],
        public readonly meta: {
            hasNext: boolean
            hasPrevious: boolean
            nextCursor: string | null
            previousCursor: string | null
        },
    ) {}
}
