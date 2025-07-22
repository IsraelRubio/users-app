export declare const appConfig: {
    apiUrl: string;
    i18n: {
        defaultLanguage: string;
        supportedLanguages: string[];
        fallbackLanguage: string;
    };
    transitions: {
        enabled: boolean;
        duration: number;
        type: string;
    };
    channels: {
        users: string;
        selectedUser: string;
        language: string;
        loading: string;
        errors: string;
    };
    boundedProperties: {
        maxUsers: number;
        searchDebounce: number;
        cacheTimeout: number;
    };
};
