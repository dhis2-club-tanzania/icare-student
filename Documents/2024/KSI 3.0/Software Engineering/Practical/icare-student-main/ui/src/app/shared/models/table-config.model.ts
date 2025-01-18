export class TableConfig {
  constructor(public config: { noDataLabel?: string }) {}

  get noDataLabel(): string {
    return this.config?.noDataLabel || 'No Data';
  }
}
