export interface OpenMRSForm {
    uuid?: string;
    id?: string;
    display?: string;
    name?: string;
    description?: string;
    encounterType?: { uuid?: string;display?: string},
    version?: string;
    build?: null;
    published?: boolean;
    formFields?: any[];
    retired: boolean;
    resources: any[]
}