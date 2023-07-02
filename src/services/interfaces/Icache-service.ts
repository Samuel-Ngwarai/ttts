export interface ICacheService {
    set<T>(key: string, item: T): void;
    get<T>(key: string): T;
    delete(key: string): number;
    isEmpty(): boolean;
    has(key: string): boolean
}