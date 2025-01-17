export interface FieldsData {
  [uuid: string]: FieldData;
}
export interface FieldData {
  uuid: string;
  latest: any;
  history: any[];
}
