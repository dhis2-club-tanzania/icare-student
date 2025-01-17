import { HttpHeaders } from '@angular/common/http';

export interface HttpConfig {
    includeVersionNumber?: boolean;
    preferPreviousApiVersion?: boolean;
    useRootUrl?: boolean;
    isExternalLink?: boolean;
    useIndexDb?: boolean;
    fetchOnlineIfNotExist?: boolean;
    indexDbConfig?: {
        schema: string;
    };
    httpHeaders?: any;
}

export interface IndexDbSchema {
    name: string;
    keyPath: string;
}
