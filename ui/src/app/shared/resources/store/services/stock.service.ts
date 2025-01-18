import { Injectable } from "@angular/core";
import { Observable, of, throwError, zip } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { LedgerInput } from "../models/ledger-input.model";
import { StockBatch } from "../models/stock-batch.model";
import { Stock, StockObject } from "../models/stock.model";
import * as moment from "moment";
import { off } from "process";

@Injectable({
  providedIn: "root",
})
export class StockService {
  constructor(private httpClient: OpenmrsHttpClientService) {}

  getAllStocks(locationUuid?: string): Observable<StockObject[]> {
    return zip(
      this.getAvailableStocks(locationUuid),
      this.getStockOuts(locationUuid)
    ).pipe(
      map((results) => {
        return [...results[0], ...results[1]];
      })
    );
  }

  getAvailableStocks(
    locationUuid?: string,
    params?: { q?: string; limit?: number; startIndex?: number },
    page?: number,
    pageSize?: number
  ): Observable<any | StockObject[]> {
    let queryParams = [];

    if (page && !params?.q) {
      queryParams = [...queryParams, `page=${page}`];
    }
    if (pageSize) {
      queryParams = [...queryParams, `pageSize=${pageSize}`];
    }
    if (locationUuid) {
      queryParams = [...queryParams, `locationUuid=${locationUuid}`];
    }
    if (params?.q) {
      queryParams = [...queryParams, `q=${params?.q}`];
    }
    if (params?.q) {
      queryParams = [...queryParams, `page=1`];
    }
    const args = `?${queryParams.join("&")}`;
    return this.httpClient.get(`store/stock${args}`)?.pipe(
      map((response,index) => {
        const stockBatches: StockBatch[] = (response?.results || []).map(
          (stockItem) => new StockBatch(stockItem)
        );
        const groupedStockBatches =
          StockBatch.getGroupedStockBatches(stockBatches);
        return {
          ...response,
          results: Object.keys(groupedStockBatches).map((stockItemKey) => {
            return new Stock(groupedStockBatches[stockItemKey]).toJson();
          }),
        };
      })
    );
    // return this._getStocks("store/stock", locationUuid, params);
  }

  getAvailableStockOfAnItem(
    itemUuid: string,
    locationUuid: string
  ): Observable<any> {
    return this.httpClient
      .get(`store/item/${itemUuid}/stock?locationUuid=${locationUuid}`)
      .pipe(
        map((response) => {
          const stockItem = new Stock(response).toJson();
          const eligibleBatches = (stockItem?.batches || []).filter(
            (batch) => batch.expiryDate > Date.now().toFixed(0)
          );
          let eligibleQuantity = 0;
          if (eligibleBatches?.length === 0) {
          } else {
            eligibleQuantity = eligibleBatches.reduce(
              (sum, stockBatch) => sum + stockBatch.quantity,
              0
            );
          }
          const batchZero = stockItem?.batches[0];
          return {
            ...stockItem,
            eligibleQuantity,
            batches: stockItem?.batches?.map((batch: any) => {
              const expiryDate = moment(new Date(batch.expiryDate));
              return {
                ...batch,
                batchNo: batch?.batch,
                remainingDays: expiryDate.fromNow(),
              };
            }),
            id: itemUuid,
            name: (batchZero as any)?.item?.display,
          };
        }),
        catchError((e) => of(e))
      );
  }

  getRequisitionStatusOfAnItem(
    itemUuid: string,
    locationUuid: string
  ): Observable<any> {
    return this.httpClient
      .get(`store/pendingrequisition?item=${itemUuid}&location=${locationUuid}`)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((e) => of(e))
      );
  }

  getStockOuts(
    locationUuid?: string,
    params?: { q?: string },
    page?: number,
    pageSize?: number
  ): Observable<any> {
    // const pageNumber = locationUuid && page ? `&page=${page}` : page ? `page=${page}` : ``;
    // const pageSizeNumber =
    //   locationUuid && pageSize && page
    //     ? `&pageSize=${pageSize}`
    //     : pageSize && page
    //       ? `&pageSize=${pageSize}`
    //       : pageSize
    //         ? `pageSize=${pageSize}` : ``;
    // const location =
    //   locationUuid ? `location=${locationUuid}` : '';
    // const args = `?${location}${pageNumber}${pageSizeNumber}` ;

    let queryParams = [];

    if (page) {
      queryParams = [...queryParams, `page=${page}`];
    }
    if (pageSize) {
      queryParams = [...queryParams, `pageSize=${pageSize}`];
    }
    if (locationUuid) {
      queryParams = [...queryParams, `location=${locationUuid}`];
    }
    if (params?.q) {
      queryParams = [...queryParams, `q=${params?.q}`];
    }

    const args = `?${queryParams.join("&")}`;

    return this.httpClient.get(`store/stockout${args}`)?.pipe(
      map((response) => {
        const stockBatches: StockBatch[] = (response?.results || []).map(
          (stockItem) => new StockBatch(stockItem)
        );
        const groupedStockBatches =
          StockBatch.getGroupedStockBatches(stockBatches);

        return {
          ...response,
          results: Object.keys(groupedStockBatches).map((stockItemKey) => {
            return new Stock(groupedStockBatches[stockItemKey]).toJson();
          }),
        };
      })
    );
    return this._getStocks("store/stockout", locationUuid, null, true);
  }
  getExpiredItems(
    locationUuid?: string,
    params?: { q?: string },
    page?: number,
    pageSize?: number
  ): Observable<any> {
    // const pageNumber = locationUuid && page ? `&page=${page}` : page ? `page=${page}` : ``;
    // const pageSizeNumber =
    //   locationUuid && pageSize && page
    //     ? `&pageSize=${pageSize}`
    //     : pageSize && page
    //     ? `&pageSize=${pageSize}`
    //     : pageSize
    //     ? `pageSize=${pageSize}` : ``;
    // const location =
    //   locationUuid ? `location=${locationUuid}` : '';
    // const args = `?${location}${pageNumber}${pageSizeNumber}` ;

    let queryParams = [];

    if (page) {
      queryParams = [...queryParams, `page=${page}`];
    }
    if (pageSize) {
      queryParams = [...queryParams, `pageSize=${pageSize}`];
    }
    if (locationUuid) {
      queryParams = [...queryParams, `location=${locationUuid}`];
    }
    if (params?.q) {
      queryParams = [...queryParams, `q=${params?.q}`];
    }

    const args = `?${queryParams.join("&")}`;

    return this.httpClient.get(`store/expireditems${args}`)?.pipe(
      map((response) => {
        const stockBatches: StockBatch[] = (response?.results || []).map(
          (stockItem) => new StockBatch(stockItem)
        );
        const groupedStockBatches =
          StockBatch.getGroupedStockBatches(stockBatches);

        return {
          ...response,
          results: Object.keys(groupedStockBatches).map((stockItemKey) => {
            return new Stock(groupedStockBatches[stockItemKey]).toJson();
          }),
        };
      })
    );
  }

  getNearlyStockedOutItems(
    locationUuid?: string,
    params?: { q?: string },
    page?: number,
    pageSize?: number
  ): Observable<any> {
    // const pageNumber = locationUuid && page ? `&page=${page}` : page ? `page=${page}` : ``;
    // const pageSizeNumber =
    //   locationUuid && pageSize && page
    //     ? `&pageSize=${pageSize}`
    //     : pageSize && page
    //     ? `&pageSize=${pageSize}`
    //     : pageSize
    //     ? `pageSize=${pageSize}` : ``;
    // const location =
    //   locationUuid ? `location=${locationUuid}` : '';
    // const args = `?${location}${pageNumber}${pageSizeNumber}` ;

    let queryParams = [];

    if (page) {
      queryParams = [...queryParams, `page=${page}`];
    }
    if (pageSize) {
      queryParams = [...queryParams, `pageSize=${pageSize}`];
    }
    if (locationUuid) {
      queryParams = [...queryParams, `location=${locationUuid}`];
    }
    if (params?.q) {
      queryParams = [...queryParams, `q=${params?.q}`];
    }

    const args = `?${queryParams.join("&")}`;

    return this.httpClient.get(`store/nearlystockoutitems${args}`)?.pipe(
      map((response) => {
        const stockBatches: StockBatch[] = (response?.results || []).map(
          (stockItem) => new StockBatch(stockItem)
        );
        const groupedStockBatches =
          StockBatch.getGroupedStockBatches(stockBatches);

        return {
          ...response,
          results: Object.keys(groupedStockBatches).map((stockItemKey) => {
            return new Stock(groupedStockBatches[stockItemKey]).toJson();
          }),
        };
      })
    );
  }

  getNearlyExpiredItems(
    locationUuid?: string,
    params?: { q?: string },
    page?: number,
    pageSize?: number
  ): Observable<any> {
    // const pageNumber = locationUuid && page ? `&page=${page}` : page ? `page=${page}` : ``;
    // const pageSizeNumber =
    //   locationUuid && pageSize && page
    //     ? `&pageSize=${pageSize}`
    //     : pageSize && page
    //     ? `&pageSize=${pageSize}`
    //     : pageSize
    //     ? `pageSize=${pageSize}` : ``;
    // const location =
    //   locationUuid ? `location=${locationUuid}` : '';
    // const args = `?${location}${pageNumber}${pageSizeNumber}` ;

    let queryParams = [];

    if (page) {
      queryParams = [...queryParams, `page=${page}`];
    }
    if (pageSize) {
      queryParams = [...queryParams, `pageSize=${pageSize}`];
    }
    if (locationUuid) {
      queryParams = [...queryParams, `location=${locationUuid}`];
    }
    if (params?.q) {
      queryParams = [...queryParams, `q=${params?.q}`];
    }

    const args = `?${queryParams.join("&")}`;

    return this.httpClient.get(`store/nearlyexpireditems${args}`)?.pipe(
      map((response) => {
        const stockBatches: StockBatch[] = (response?.results || []).map(
          (stockItem) => new StockBatch(stockItem)
        );
        const groupedStockBatches =
          StockBatch.getGroupedStockBatches(stockBatches);

        return {
          ...response,
          results: Object.keys(groupedStockBatches).map((stockItemKey) => {
            return new Stock(groupedStockBatches[stockItemKey]).toJson();
          }),
        };
      })
    );
  }

  saveStockLedger(ledgerInput: LedgerInput): Observable<any> {
    const storeLedger = Stock.createLedger(ledgerInput);
    if (!storeLedger) {
      return throwError({
        message: "Incorrect parameters supplied",
      });
    }
    return this.httpClient.post("store/ledger", storeLedger).pipe(
      map((response) => {
        new StockBatch(response)}),
        catchError((error) => {
          return of(error);
        }),
    );
  }

  getStockMetrics(locationUuid: string) {
    return this.httpClient.get(`store/metrics?location=${locationUuid}`);
  }

  private _getStocks(
    url: string,
    locationUuid?: string,
    params?: any,
    isStockOut?: boolean
  ): Observable<any | StockObject[]> {
    let parameters = [];
    if (params?.q) {
      parameters = [...parameters, `q=${params?.q}`];
    }
    if (params?.limit) {
      parameters = [...parameters, `limit=${params?.limit}`];
    }
    if (params?.limit) {
      parameters = [
        ...parameters,
        `startIndex=${params?.startIndex ? params?.startIndex : 0}`,
      ];
    }
    return this.httpClient
      .get(
        `${url}?${isStockOut ? "location" : "locationUuid"}=${locationUuid}${
          parameters?.length > 0 ? "&" + parameters?.join("&") : ""
        }`
      )
      .pipe(
        map((stockResponse) => {
          const stockBatches: StockBatch[] = (stockResponse || []).map(
            (stockItem) => new StockBatch(stockItem)
          );

          const groupedStockBatches =
            StockBatch.getGroupedStockBatches(stockBatches);

          return Object.keys(groupedStockBatches).map((stockItemKey) => {
            return new Stock(groupedStockBatches[stockItemKey]).toJson();
          });
        }),
        catchError((error) => of(error))
      );
  }

  // TODO: by Masembo
  getItemStockInAllUnits(itemID: string): Observable<any> {
    return this.httpClient.get(`store/item/${itemID}/stock?itemUuid=${itemID}`);
  }
}

// https://icare.dhis2.udsm.ac.tz/openmrs/ws/rest/v1/store/item/{itemUUID}/stock?itemUuid={itemUUID}
