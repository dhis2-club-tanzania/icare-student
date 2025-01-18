import * as moment from "moment";
export class StockBatch {
  constructor(private stockDetails: any) {}

  get itemUuid(): string {
    return this.stockDetails.uuid || this.stockDetails?.item?.uuid;
  }

  get batchNo(): string {
    return this.stockDetails?.batch || this.stockDetails?.batchNo;
  }

  get name(): string {
    return this.stockDetails?.display || this.stockDetails?.item?.display;
  }

  get drug(): any {
    return this.stockDetails?.item?.drug;
  }

  get quantity(): number {
    return parseInt(this.stockDetails?.quantity || "0", 10);
  }

  get expiryDate(): string {
    return this.stockDetails?.expiryDate;
  }

  get remainingDays(): string {
    const expiryDate = moment(new Date(this.expiryDate));

    return expiryDate.fromNow();
  }

  get isExpired(): boolean {
    const expiryDate = moment(new Date(this.expiryDate));
    return expiryDate.diff(moment()) <= 0;
  }

  get location(): { uuid: string; name: string } {
    return {
      uuid: this.stockDetails?.location?.uuid,
      name: this.stockDetails?.location?.display,
    };
  }

  static getGroupedStockBatches(stockBatches: StockBatch[]): {
    [itemuUuid: string]: StockBatch[];
  } {
    const groupedBatches = {};
    (stockBatches || []).forEach((stockBatch) => {
      const availableStock = groupedBatches[stockBatch?.itemUuid];

      groupedBatches[stockBatch?.itemUuid] = availableStock
        ? [...availableStock, stockBatch]
        : [stockBatch];
    });

    return groupedBatches;
  }

  static mergeStockBatches(oldBatches, newBatches): StockBatch[] {
    let mergedBatches = [...oldBatches];
    if (oldBatches?.length === 0) {
      return newBatches;
    }
    (newBatches || []).forEach((batch: StockBatch) => {
      const oldBatch = (mergedBatches || []).find(
        (batchItem) => batchItem.itemUuid === batch.itemUuid
      );

      if (oldBatch) {
        mergedBatches = [...mergedBatches, batch];
      }
    });

    return mergedBatches;
  }
}
