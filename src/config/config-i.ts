export interface IConfigObject {
    PORT: number;
    LOG_LEVEL: 'debug' | 'info' | 'error' | 'warn' | 'crit';
    CREATE_SWAGGER_FILE?: boolean;
}
