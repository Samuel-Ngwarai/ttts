export interface IConfigObject {
    PORT: number;
    LOG_LEVEL: 'debug' | 'info' | 'error' | 'warn' | 'crit';
    CREATE_SWAGGER_FILE?: boolean;
    CACHE_STD_TTL: number;
    MAX_WAITING_TIME_FOR_PLAYER_2?: number;
    SENTRY_DSN?: string;
    SENTRY_TRACES_SAMPLE_RATE?: number;
    ENVIRONMENT: string;
}
