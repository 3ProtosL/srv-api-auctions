import { Item } from "../../models/items";

export abstract class getItemUseCasePort{
    abstract execute(id: string): Promise<Item>
}