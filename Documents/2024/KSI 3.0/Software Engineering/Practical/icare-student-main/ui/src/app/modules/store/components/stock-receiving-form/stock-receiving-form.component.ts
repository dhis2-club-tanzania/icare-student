import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { flatten } from "lodash";
import { from, Observable, of, zip } from "rxjs";
import { debounceTime, distinctUntilChanged, map, switchMap } from "rxjs/operators";
import { formatDateToYYMMDD } from "src/app/shared/helpers/format-date.helper";
import { DateField } from "src/app/shared/modules/form/models/date-field.model";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import { Api } from "src/app/shared/resources/openmrs";
import { StockInvoicesService } from "src/app/shared/resources/store/services/stockInvoice.service";

@Component({
  selector: "app-stock-receiving-form",
  templateUrl: "./stock-receiving-form.component.html",
  styleUrls: ["./stock-receiving-form.component.scss"],
})
export class StockReceivingFormComponent implements OnInit {
  @Input() suppliers: any[];
  @Input() unitsOfMeasurementSettings: any;
  @Input() existingStockInvoice: any;
  @Input() stockInvoiceItem: any;
  @Input() currentLocation: any;
  @Output() closeDialog: EventEmitter<any> = new EventEmitter();

  unitsOfMeasurements$: Observable<any>;
  stockInvoice: any;
  loadingInvoice: boolean = false;
  updateStockInvoice: boolean = false;
  constructor(private conceptService: ConceptsService) {}

  ngOnInit(): void {
    this.updateStockInvoice = this.existingStockInvoice ? true : false;
    this.stockInvoice = this.existingStockInvoice;
    this.unitsOfMeasurements$ = this.conceptService
      ?.getConceptByMappingSource(
        this.unitsOfMeasurementSettings?.mappingSource,
        "custom:(uuid,display,mappings:(uuid,display,conceptReferenceTerm:(uuid,display,code,conceptSource)))"
      )
      .pipe(
        map((response) => {
          if (!response?.error) {
            return response?.results;
          }
        })
      );
  }

  loadInvoices(invoice) {
    this.loadingInvoice = true;
    this.stockInvoice = undefined;
    setTimeout(() => {
      this.stockInvoice = this.existingStockInvoice || invoice;
      this.loadingInvoice = false;
    }, 100);
  }

  onCloseDialog() {
    this.closeDialog.emit();
  }
}
