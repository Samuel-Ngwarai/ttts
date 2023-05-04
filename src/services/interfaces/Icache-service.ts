export interface ICacheService {
    set(key: string, item: string): void;
    get(key: string): void;
    delete(key: string): number;
    isEmpty(): boolean;
    getAndDelete(): string;
}
