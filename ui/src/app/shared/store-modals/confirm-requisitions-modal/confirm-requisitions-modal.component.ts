import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { flatten } from "lodash";
import { Observable, zip } from "rxjs";
import { map } from "rxjs/operators";
import { StockService } from "src/app/shared/resources/store/services/stock.service";

@Component({
  selector: "app-confirm-requisitions-modal",
  templateUrl: "./confirm-requisitions-modal.component.html",
  styleUrls: ["./confirm-requisitions-modal.component.scss"],
})
export class ConfirmRequisitionsModalComponent implements OnInit {
  dialogData: any;
  stockStatusDifferentItemsOnRequestedStore$: Observable<any>;
  constructor(
    private dialogRef: MatDialogRef<ConfirmRequisitionsModalComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private stockService: StockService
  ) {
    this.dialogData = data;
  }

  ngOnInit(): void {
    
    this.stockStatusDifferentItemsOnRequestedStore$ = zip(
      ...this.dialogData?.items?.map((item) => {
        return this.stockService.getAvailableStockOfAnItem(
          item?.item?.uuid,
          this.dialogData?.issue?.requestedLocation?.uuid
        );
      })
    ).pipe(map((response) => flatten(response)));
  }

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }

  onConfirm(event: Event, stockStatusDifferentItemsOnRequestedStore): void {
    event.stopPropagation();
    this.dialogRef.close({
      requisitions: this.dialogData,
      stockStatus: stockStatusDifferentItemsOnRequestedStore,
    });
  }
}
