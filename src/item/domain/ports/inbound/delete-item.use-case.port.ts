import { Item } from "../../models/items";

export abstract class DeleteItemUseCasePort{
    abstract execute(id: string)
}