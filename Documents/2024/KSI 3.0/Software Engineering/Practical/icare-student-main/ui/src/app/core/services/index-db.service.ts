import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Observable } from 'rxjs';
import { IndexDBParams } from '../models/index-db-params.model';
import { getOrderByColumns } from '../helpers/get-order-by-columns.helper';
import { filterIndexDBData } from '../helpers/filter-index-db-data.helper';

export interface IndexDbConfig {
  namespace: string;
  version: number;
  models: { [name: string]: string };
}

export class IndexDbServiceConfig implements IndexDbConfig {
  namespace = 'db';
  version = 1;
  models = {};
}
@Injectable({
  providedIn: 'root',
})
export class IndexDbService extends Dexie {
  constructor(config: IndexDbServiceConfig) {
    super(config.namespace);
    this.version(config.version).stores(config.models);
  }

  findById(schemaName: string, id: string) {
    return new Observable((observer) => {
      this.table(schemaName)
        .where({ id })
        .first()
        .then(
          (data: any) => {
            observer.next(data);
            observer.complete();
          },
          (error: any) => {
            observer.next(error);
          }
        );
    });
  }

  findAll(schemaName: string, params: IndexDBParams): Observable<any> {
    return new Observable((observer) => {
      this._getTableSchema(schemaName, params)
        .toArray()
        .then(
          (dataArray: any[]) => {
            observer.next({
              [schemaName]: filterIndexDBData(dataArray, params.filter),
            });
            observer.complete();
          },
          (error: any) => {
            observer.next(error);
          }
        );
    });
  }

  saveOne(schemaName: string, data: any) {
    return new Observable((observer) => {
      this.table(schemaName)
        .put(data)
        .then(
          () => {
            observer.next(data);
            observer.complete();
          },
          (error) => {
            observer.error(error);
          }
        );
    });
  }

  saveBulk(schemaName: string, data: any[]): Observable<any> {
    return new Observable((observer) => {
      this.table(schemaName)
        .bulkPut(data)
        .then(
          () => {
            observer.next({ [schemaName]: data });
            observer.complete();
          },
          (error) => {
            observer.error(error);
          }
        );
    });
  }

  private _getTableSchema(schemaName: string, params: IndexDBParams) {
    const tableSchema = this.table(schemaName);
    if (!params) {
      return tableSchema;
    }

    // TODO: Find best way to simplify this code
    if (params.pageSize) {
      const page = params.page || 1;
      const pagedTableSchema = tableSchema
        .offset(page * params.pageSize)
        .limit(params.pageSize);

      if (params.order) {
        const orderByColumns = getOrderByColumns(params.order);

        if (orderByColumns.length === 0) {
          return pagedTableSchema;
        }

        // TODO: Need to find a way to order by more than one column, currently dexie does not support this
        return tableSchema
          .orderBy(orderByColumns[0])
          .offset(page === 1 ? 0 : page * params.pageSize)
          .limit(params.pageSize);
      }

      return pagedTableSchema;
    } else if (params.order) {
      const orderByColumns = getOrderByColumns(params.order);

      if (orderByColumns.length === 0) {
        return tableSchema;
      }

      // TODO: Need to find a way to order by more than one column, currently dexie does not support this
      return tableSchema.orderBy(orderByColumns[0]);
    }

    return tableSchema;
  }
}
