export abstract class DeleteItemUseCasePort {
    abstract execute(id: string): Promise<{ message: string }>;
}