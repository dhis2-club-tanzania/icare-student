import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { Observable, of } from "rxjs";
import { delay, map, switchMap } from "rxjs/operators";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import { SupplierService } from "../../resources/store/services/supplier.service";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { StockInvoiceItemsComponent } from "../stock-invoice-items/stock-invoice-items.component";

@Component({
  selector: "app-stock-receiving-form",
  templateUrl: "./stock-receiving-form.component.html",
  styleUrls: ["./stock-receiving-form.component.scss"],
})
export class StockReceivingFormComponent implements OnInit {
  @Input() existingStockInvoice: any;
  @Input() stockInvoiceItem: any;
  @Input() currentLocation: any;
  @Input() hideAddedItems: boolean;
  @Output() closeDialog: EventEmitter<any> = new EventEmitter();

  suppliers$: Observable<any>;
  unitsOfMeasurementsDetails$: Observable<any>;
  stockInvoice: Observable<any>;
  loadingInvoice: boolean = false;
  updateStockInvoice: boolean = false;
  errors: any[] = [];
  @ViewChild(StockInvoiceItemsComponent)
  stockInvoiceItemsComponent: StockInvoiceItemsComponent;
  constructor(
    private conceptService: ConceptsService,
    private supplierService: SupplierService,
    private systemSettingsService: SystemSettingsService
  ) {}

  ngOnInit(): void {
    this.suppliers$ = this.supplierService.getSuppliers().pipe(
      map((response) => {
        if (!response?.error) {
          return response;
        }
        if (response?.error) {
          this.errors = [...this.errors, response.error];
        }
      })
    );

    this.unitsOfMeasurementsDetails$ = this.systemSettingsService
      .getSystemSettingsByKey(
        "iCare.store.mappings.items.unitOfMeasure.mappingSource"
      )
      .pipe(
        switchMap((systemSettingsForUnitOfMeasureMappingSource: any) => {
          return this.conceptService
            ?.getConceptByMappingSource(
              systemSettingsForUnitOfMeasureMappingSource?.mappingSource,
              "custom:(uuid,display,mappings:(uuid,display,conceptReferenceTerm:(uuid,display,code,conceptSource)))"
            )
            .pipe(
              map((response) => {
                if (!response?.error) {
                  return {
                    unitsOfMeasurements: response?.results,
                    unitsOfMeasurementSettings:
                      systemSettingsForUnitOfMeasureMappingSource,
                  };
                }
              })
            );
        })
      );

    this.updateStockInvoice = this.existingStockInvoice ? true : false;
    this.stockInvoice = this.existingStockInvoice
      ? this.existingStockInvoice
      : null;
  }

  loadInvoices(invoice) {
    // this.loadingInvoice = true;
    this.stockInvoice = invoice;
    this.stockInvoiceItemsComponent.loadStockInvoiceByUuid(invoice?.uuid);
    // setTimeout(() => {
    //   this.stockInvoice$ = of(this.existingStockInvoice || invoice);
    //   this.loadingInvoice = false;
    // }, 20);
  }

  onCloseDialog() {
    this.closeDialog.emit();
  }
}
