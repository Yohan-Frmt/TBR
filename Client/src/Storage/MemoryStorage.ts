export class MemoryStorage implements Storage {
    private storage = new Map<string, string | null>()

    public get length(): number {
        return this.storage.size
    }

    public clear = (): void => {
        this.storage.clear();
    };

    public getItem = (key: string): string | null => {
        return this.storage.has(key) ? this.storage.get(key) ?? null : null;
    };

    public key = (index: number): string | null => {
        return Array.from(this.storage.keys())[index] ?? null;
    };

    public removeItem = (key: string): void => {
        this.storage.delete(key);
    };

    public setItem = (key: string, value: string): void => {
        this.storage.set(key, value)
    };
}
