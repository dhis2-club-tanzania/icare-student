import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { LocationService } from "src/app/core/services";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { SharedConfirmationComponent } from "src/app/shared/components/shared-confirmation/shared-confirmation.component";
import { getFilterIssuedItemsInRequisitions } from "src/app/shared/helpers/requisitions.helper";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import { RequisitionService } from "src/app/shared/resources/store/services/requisition.service";
import { StockInvoicesService } from "src/app/shared/resources/store/services/stockInvoice.service";
import { SupplierService } from "src/app/shared/resources/store/services/supplier.service";
import { RequisitionFormDialogComponent } from "../../modals/requisition-form-dialog/requisition-form-dialog.component";
import { StockInvoiceFormDialogComponent } from "../../modals/stock-invoice-form-dialog/stock-invoice-form-dialog.component";
@Component({
  selector: "app-requisition-items",
  templateUrl: "./requisition-items.component.html",
  styleUrls: ["./requisition-items.component.scss"],
})
export class RequisitionItemsComponent implements OnInit {
  @Input() requisition: any;
  @Output() receiveItem: EventEmitter<any> = new EventEmitter();
  @Output() rejectItem: EventEmitter<any> = new EventEmitter();
  @Output() selectionChange: EventEmitter<any> = new EventEmitter();
  @Output() reloadList: EventEmitter<any> = new EventEmitter();

  errors: any[];
  specificRequisition$: Observable<any>;
  loadingRequisition: boolean = false;
  selectedItems: any = {};
  selectAllItems: boolean;
  constructor(
    private requisitionService: RequisitionService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadingRequisition = true;
    this.specificRequisition$ = this.requisitionService
      .getRequisitionByUuid(this.requisition?.uuid)
      .pipe(
        map((response) => {
          if(!response?.error){
            const items = getFilterIssuedItemsInRequisitions(
              response?.requisitionItems,
              response?.issues
            );
            this.loadingRequisition = false;
            return {
              ...response,
              requisitionItems: items
            }
          }
        })
      );
  }

  onUpdateRequsitionItem(requisitionItem, key?: string) {
    if (!key) {
      this.dialog
        .open(RequisitionFormDialogComponent, {
          width: "80%",
          data: {
            requisitionItem: requisitionItem,
          },
        })
        .afterClosed()
        .subscribe(() => {
          this.reloadList.emit(this.requisition);
        });
    }

    if (key === "delete") {
      this.dialog
        .open(SharedConfirmationComponent, {
          width: "25%",
          data: {
            modalTitle: "Are you sure to delete this Item",
            modalMessage:
              "This action is irreversible. Please, click confirm to delete and click cancel to cancel deletion.",
          },
        })
        .afterClosed()
        .subscribe((data) => {
          if (data?.confirmed) {
            const requisitionItemObject = {
              ...requisitionItem,
              voided: true,
            };

            this.requisitionService
              .updateRequisitionItem(
                requisitionItem?.uuid,
                requisitionItemObject
              )
              .pipe(
                tap((response) => {
                  this.reloadList.emit(this.requisition);
                })
              )
              .subscribe();
          }
          this.reloadList.emit(this.requisition);
        });
    }
  }

  onRejectItem(e: Event, item: any) {
    e.stopPropagation();
    this.rejectItem.emit({ event: e, item: item });
  }

  onReceiveItem(e: Event, item: any) {
    this.receiveItem.emit({ event: e, item: item });
  }

  selectAll(e: MatCheckboxChange, items: any[]) {
    if (e?.checked) {
      items.forEach((item) => {
        this.selectedItems = {
          ...this.selectedItems,
          [item]: item
        }
        this.selectionChange.emit({ event: e, item: item });
      })
      this.selectAllItems = true;
    } else {
      this.selectAllItems = false;
      this.selectedItems = {}
      items.forEach((item) => {
        this.selectionChange.emit({ event: e, item: item });
      })
    }
  }

  getSelection(event: MatCheckboxChange, item: any): void {
    if(!event.checked){
      this.selectAllItems = false;
    }
    this.selectionChange.emit({ event: event, item: item });
  }

  get selectedItemsCount(): number {
    return this.selectedItems ? Object.keys(this.selectedItems)?.length : 0;
  }
}
