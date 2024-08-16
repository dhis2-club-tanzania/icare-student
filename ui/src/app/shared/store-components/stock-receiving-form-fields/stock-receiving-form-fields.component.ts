import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { orderBy, uniqBy } from "lodash";
import * as moment from "moment";
import { Observable } from "rxjs";
import { debounceTime, map, tap } from "rxjs/operators";
import {
  dateToISOStringMidnight,
  formatDateToYYMMDD,
} from "src/app/shared/helpers/format-date.helper";
import { DateField } from "src/app/shared/modules/form/models/date-field.model";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";
import { StockInvoicesService } from "src/app/shared/resources/store/services/stockInvoice.service";
import { OpenmrsHttpClientService } from "../../modules/openmrs-http-client/services/openmrs-http-client.service";
import { ChangeDetectorRef } from "@angular/core";

@Component({
  selector: "app-stock-receiving-form-fields",
  templateUrl: "./stock-receiving-form-fields.component.html",
  styleUrls: ["./stock-receiving-form-fields.component.scss"],
})
export class StockReceivingFormFieldsComponent implements OnInit {
  @Input() suppliers: any[];
  @Input() unitsOfMeasurements: any[];
  @Input() unitsOfMeasurementSettings: any;
  @Input() existingStockInvoice: any;
  @Input() stockInvoiceItem: any;
  @Input() currentLocation: any;
  @Output() loadInvoices: EventEmitter<any> = new EventEmitter();
  @Output() closeDialog: EventEmitter<any> = new EventEmitter();
  @Output() reloadForm: EventEmitter<any> = new EventEmitter();

  supplierNameField: any;
  invoiceNumberField: any;
  receivingDateField: any;
  errors: any[] = [];
  commonFields: Textbox[];
  itemFields: any[];
  formValues: any;
  items$: Observable<any>;
  members$: Observable<any>;
  searchingItems: boolean = false;
  showItems: boolean = false;
  items: any;
  pageSize: number = 10;
  page: number = 1;
  pageIndex: number = 0;
  itemsPerPage: any[];
  lastIndex: number = 0;
  endIndex: any = 10;
  selectedItem: any;
  reloadAfterChanges: boolean = false;
  amountField: Textbox;
  unitPriceField: Textbox;
  batchQuantityField: Textbox;
  expiryDateField: DateField;
  mfgBatchNumberField: Textbox;
  orderQuantityField: Textbox;
  unitField: Dropdown;
  batchQuantity: number;
  unitPrice: string;
  amount: string;
  itemField: Textbox;
  packagePriceField: any;
  unitOfMeasure: any;
  stockInvoice: any;
  validForm: boolean = false;
  unitItemValue: any;
  searchingText: string;

  saving: boolean = false;

  constructor(
    private stockInvoicesService: StockInvoicesService,
    private httpClient: OpenmrsHttpClientService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.stockInvoice = this.existingStockInvoice;
    const supplierFieldOptions = this.suppliers?.map((supplier) => {
      return {
        key: supplier,
        label: supplier.name,
        value: supplier?.uuid,
        name: supplier?.name,
      };
    });
    this.commonFields = [
      new Dropdown({
        id: "supplier",
        key: "supplier",
        label: "Supplier",
        required: true,
        options: supplierFieldOptions,
        value: this.existingStockInvoice
          ? this.existingStockInvoice?.supplier?.uuid
          : "",
      }),
      new Textbox({
        id: "invoiceNumber",
        key: "invoiceNumber",
        label: "Invoice Number",
        required: true,
        value: this.existingStockInvoice
          ? this.existingStockInvoice?.invoiceNumber
          : "",
      }),
      new DateField({
        id: "receivingDate",
        key: "receivingDate",
        label: "Receiving Date",
        required: true,
        max: formatDateToYYMMDD(new Date()),
        value: this.existingStockInvoice
          ? formatDateToYYMMDD(
              new Date(this.existingStockInvoice?.receivingDate)
            )
          : "",
      }),
    ];
    this.setFields();
  }

  setFields(clearSetValues?: boolean) {
    const unitOfMeasureOptions = this.unitsOfMeasurements?.map((unit) => {
      return {
        key: unit?.uuid,
        label: unit?.display,
        value: unit,
        name: unit?.display,
      };
    });

    // this.itemField = new Dropdown({
    //   id: "item",
    //   key: "item",
    //   label: "Item",
    //   required: true,
    //   options: [],
    //   shouldHaveLiveSearchForDropDownFields: true,
    //   searchControlType: "billableItem",
    //   value: this.stockInvoiceItem ? this.stockInvoiceItem?.item?.display : "",
    // });
    this.unitField = new Dropdown({
      id: "unit",
      key: "unit",
      label: "Unit of Measure",
      required: true,
      options: unitOfMeasureOptions,
      value: clearSetValues
        ? null
        : this.stockInvoiceItem
        ? this.unitsOfMeasurements?.filter(
            (unit) => unit?.uuid === this.stockInvoiceItem?.uom?.uuid
          )[0]
        : null,
    });
    this.orderQuantityField = new Textbox({
      id: "orderQuantity",
      key: "orderQuantity",
      label: "Order Quantity",
      type: "number",
      required: true,
      min: 1,
      value: clearSetValues
        ? null
        : this.stockInvoiceItem
        ? this.stockInvoiceItem?.orderQuantity
        : "",
    });

    this.mfgBatchNumberField = new Textbox({
      id: "mfgBatchNumber",
      key: "mfgBatchNumber",
      label: "Mfg Batch Number",
      required: true,
      value: clearSetValues
        ? null
        : this.stockInvoiceItem
        ? this.stockInvoiceItem?.batchNo
        : "",
    });

    this.expiryDateField = new DateField({
      id: "expiryDate",
      key: "expiryDate",
      label: "Expiry Date",
      type: "date",
      required: true,
      value: clearSetValues
        ? null
        : this.stockInvoiceItem
        ? formatDateToYYMMDD(new Date(this.stockInvoiceItem?.expiryDate))
        : "",
    });
    // this.batchQuantityField = new Textbox({
    //   id: "batchQuantity",
    //   key: "batchQuantity",
    //   label: "Batch Quantity",
    //   type: "number",
    //   required: true,
    //   min: 1,
    //   disabled: true,
    //   value: clearSetValues
    //     ? null
    //     : this.stockInvoiceItem
    //     ? this.stockInvoiceItem?.batchQuantity
    //     : "",
    // });

    this.amount = this?.stockInvoiceItem
      ? this?.stockInvoiceItem?.amount
      : undefined;
    this.amountField = new Textbox({
      id: "amount",
      key: "amount",
      label: "Amount",
      type: "number",
      required: true,
      min: 1,
      disabled: true,
    });

    this.packagePriceField = new Textbox({
      id: "packPrice",
      key: "packPrice",
      label: "Pack price",
      type: "number",
      min: "0",
      required: true,
    });

    this.itemFields = [
      this.unitField,
      this.orderQuantityField,
      this.packagePriceField,
      this.mfgBatchNumberField,
      this.expiryDateField,
    ];
  }

  // filterStockableItems(searchingText: string): void {
  //   this.searchingText = searchingText;
  //   this.members$ =
  //     searchingText?.length > 2
  //       ? this.httpClient
  //           .get(`icare/item?limit=5&startIndex=0&q=${this.searchingText}`)
  //           .pipe(
  //             map((response) => {
  //               return orderBy(
  //                 uniqBy(
  //                   response?.results
  //                     .map((result) => {
  //                       return {
  //                         stockable: result?.stockable,
  //                         uuid: result?.uuid,
  //                         display: result?.display,
  //                         unit: result?.unit,
  //                       };
  //                     })
  //                     .filter((item) => item?.stockable),
  //                   "display"
  //                 ),
  //                 ["display"],
  //                 ["asc"]
  //               );
  //             })
  //           )
  //       : of([]);
  // }

  searchItemFromOptions(event: KeyboardEvent): void {
    const searchingText = (event?.target as any)?.value;
    this.members$ = this.httpClient
      .get(`icare/stockableitems?limit=15&startIndex=0&q=${searchingText}`)
      .pipe(
        debounceTime(300),
        map((response) => {
          return orderBy(
            uniqBy(
              response?.results
                .map((result) => {
                  return {
                    stockable: result?.stockable,
                    uuid: result?.uuid,
                    display: result?.display,
                    unit: result?.unit,
                  };
                })
                .filter((item) => item?.stockable),
              "display"
            ),
            ["display"],
            ["asc"]
          );
        })
      );
  }

  getSelectedItemFromOption(event: Event, option: any): void {
    event.stopPropagation();
    this.selectedItem = option;
    this.searchingText = this.selectedItem?.display;
    this.validForm =
      this.formValues?.supplier?.value?.toString()?.length &&
      this.formValues?.invoiceNumber?.value?.toString()?.length &&
      this.formValues?.receivingDate?.value?.toString()?.length &&
      this.selectedItem?.toString()?.length &&
      this.formValues?.unit?.value?.toString()?.length &&
      this.formValues?.packPrice?.value?.toString()?.length &&
      this.formValues?.orderQuantity?.value?.toString()?.length &&
      this.formValues?.mfgBatchNumber?.value?.toString()?.length &&
      this.formValues?.expiryDate?.value?.toString()?.length &&
      this.batchQuantity?.toString()?.length
        ? true
        : false;
  }

  onFormUpdate(formValues: FormValue) {
    this.formValues = {
      ...this.formValues,
      ...formValues.getValues(),
    };

    // Improve reference the code (mappings)
    // this.selectedItem = this.formValues?.item?.value;
    this.unitOfMeasure = this.formValues?.unit?.value
      ? this.formValues?.unit?.value
      : this.unitsOfMeasurements?.filter(
          (unit) => unit?.uuid === this.stockInvoiceItem?.uom?.uuid
        )?.length > 0
      ? this.unitsOfMeasurements?.filter(
          (unit) => unit?.uuid === this.stockInvoiceItem?.uom?.uuid
        )[0]
      : undefined;
    if (
      this.formValues?.orderQuantity?.value &&
      this.unitOfMeasure &&
      this.formValues?.packPrice?.value
    ) {
      const unit = Number(
        this.unitOfMeasure?.mappings?.filter(
          (mapping) =>
            mapping?.conceptReferenceTerm?.conceptSource?.uuid ===
            this.unitsOfMeasurementSettings?.uuid
        )[0]?.conceptReferenceTerm?.code || 1
      );
      this.unitItemValue = unit;
      this.batchQuantity = Number(this.formValues?.orderQuantity?.value) * unit;

      this.unitPrice = (
        parseFloat(this.formValues?.packPrice?.value || 0) / Number(unit)
      ).toFixed(2);

      this.amount = undefined;
      if (
        Number(this.formValues?.orderQuantity?.value) &&
        this.formValues?.packPrice?.value
      ) {
        // Calculate amount synchronously without setTimeout
        this.amount = (
          parseFloat(this.formValues?.packPrice?.value) *
          parseFloat(this.formValues?.orderQuantity?.value)
        ).toFixed(2);
      }
    }

    this.validForm =
      this.formValues?.supplier?.value?.toString()?.length &&
      this.formValues?.invoiceNumber?.value?.toString()?.length &&
      this.formValues?.receivingDate?.value?.toString()?.length &&
      this.selectedItem?.toString()?.length &&
      this.formValues?.unit?.value?.toString()?.length &&
      this.formValues?.packPrice?.value?.toString()?.length &&
      this.formValues?.orderQuantity?.value?.toString()?.length &&
      this.formValues?.mfgBatchNumber?.value?.toString()?.length &&
      this.formValues?.expiryDate?.value?.toString()?.length &&
      this.batchQuantity?.toString()?.length
        ? true
        : false;
  }

  onPageChange(event) {
    this.page = Number(event.pageIndex) + 1;
    this.pageSize = Number(event?.pageSize);
    this.pageIndex =
      event?.pageIndex > this.lastIndex
        ? this.pageIndex + this.pageSize
        : this.pageIndex - this.pageSize;
    this.endIndex =
      this.pageIndex + this.pageSize > this.items?.length
        ? this.items.length
        : this.pageIndex + this.pageSize;

    this.lastIndex = event?.pageIndex;

    this.getItemsInPages(false);
  }

  getItemsInPages(refresh: boolean = true) {
    this.searchingItems = true;
    if (refresh) {
      this.itemsPerPage = [];
      this.pageSize = 10;
      this.page = 1;
      this.pageIndex = 0;
      this.endIndex = 10;
      this.lastIndex = 0;
      setTimeout(() => {
        this.itemsPerPage = this.items?.slice(this.pageIndex, this.endIndex);
        this.searchingItems = false;
      }, 20);
    } else {
      setTimeout(() => {
        this.itemsPerPage = this.items?.slice(this.pageIndex, this.endIndex);
        this.searchingItems = false;
      }, 10);
    }
  }

  onSelectItem(item?: any) {
    this.selectedItem = item;
    this.reloadItemFields();
  }

  reloadItemFields(completely: boolean = false) {
    this.selectedItem = completely ? undefined : this.selectedItem;
    this.itemField = undefined;
    setTimeout(() => {
      this.itemField = new Textbox({
        id: "item",
        key: "item",
        label: "Item",
        required: true,
        value: this.selectedItem?.display,
      });
    }, 10);
  }

  saveInvoices(e: Event): void {
    e?.stopPropagation();
    // TODO: Add support to handle errors
    if (this.stockInvoice) {
      this.reloadAfterChanges = true;
      const invoice = {
        invoiceNumber: this.formValues?.invoiceNumber?.value,
        supplier: {
          uuid: this.formValues?.supplier?.value,
        },
        receivingDate: dateToISOStringMidnight(
          new Date(moment(this.formValues?.receivingDate?.value).toDate())
        ),
        stockInvoiceStatus: [
          {
            status: "DRAFT",
          },
        ],
        invoiceItems: [
          {
            item: {
              uuid: this.selectedItem?.uuid,
            },
            batchNo: this.formValues?.mfgBatchNumber?.value,
            orderQuantity: Number(this.formValues?.orderQuantity?.value),
            batchQuantity: Number(this.batchQuantity),
            amount: parseFloat(this.amount),
            unitPrice:
              parseFloat(this.formValues?.packPrice?.value) /
              parseFloat(this.unitItemValue),
            stockInvoiceItemStatus: [
              {
                status: "DRAFT",
              },
            ],
            location: {
              uuid: this.currentLocation?.uuid,
            },
            uom: {
              uuid: this.unitOfMeasure?.uuid,
            },
            expiryDate: dateToISOStringMidnight(
              new Date(moment(this.formValues?.expiryDate?.value).toDate())
            ),
          },
        ],
      };

      this.stockInvoicesService
        .updateStockInvoice(this.stockInvoice?.uuid, invoice)
        .subscribe((response: any) => {
          if (!response?.error) {
            this.stockInvoice = response;
            this.loadInvoices.emit(response);
          }
          if (!response?.error) {
            this.stockInvoice = response;
            this.loadInvoices.emit(response);
          }
          this.setFields();
          this.reloadAfterChanges = false;
          this.amount = undefined;
          this.batchQuantity = 0;
        });
    } else {
      const invoicesObject = [
        {
          invoiceNumber: this.formValues?.invoiceNumber?.value,
          supplier: {
            uuid: this.formValues?.supplier?.value,
          },
          receivingDate: dateToISOStringMidnight(
            new Date(moment(this.formValues?.receivingDate?.value).toDate())
          ),
          stockInvoiceStatus: [
            {
              status: "DRAFT",
            },
          ],
          invoiceItems: [
            {
              item: {
                uuid: this.selectedItem?.uuid,
              },
              batchNo: this.formValues?.mfgBatchNumber?.value,
              orderQuantity: Number(this.formValues?.orderQuantity?.value),
              batchQuantity: this.batchQuantity,
              amount: parseFloat(this.amount),
              unitPrice:
                parseFloat(this.formValues?.packPrice?.value) /
                parseFloat(this.unitItemValue),
              uom: {
                uuid: this.unitOfMeasure?.uuid,
              },
              location: {
                uuid: this.currentLocation?.uuid,
              },
              stockInvoiceItemStatus: [
                {
                  status: "DRAFT",
                },
              ],
              expiryDate: new Date(
                moment(this.formValues?.expiryDate?.value).toDate()
              )?.toISOString(),
            },
          ],
        },
      ];
      this.reloadAfterChanges = true;

      this.stockInvoicesService
        .createStockInvoices(invoicesObject)
        .subscribe((response: any) => {
          if (!response?.error) {
            this.stockInvoice = response;
            this.loadInvoices.emit(response);
          }
          this.setFields();
          this.reloadAfterChanges = false;
          this.amount = undefined;
          this.batchQuantity = 0;
          this.reloadItemFields(true);
        });
    }
  }

  onSaveUpdatedInvoice(event: Event): void {
    event.stopPropagation();
    const invoice = {
      invoiceNumber: this.formValues?.invoiceNumber?.value,
      supplier: {
        uuid: this.formValues?.supplier?.value,
      },
      receivingDate: dateToISOStringMidnight(
        new Date(moment(this.formValues?.receivingDate?.value).toDate())
      ),
      stockInvoiceStatus: [
        {
          status: "DRAFT",
        },
      ],
    };

    this.stockInvoicesService
      .updateStockInvoice(this.stockInvoice?.uuid, invoice)
      .pipe(
        tap((response) => {
          if (!response?.error) {
            this.stockInvoice = response;
          }
          this.itemFields = [];
          setTimeout(() => {
            this.setFields();
          }, 10);
          this.closeDialog.emit();
          this.reloadForm.emit();
        })
      )
      .subscribe();
  }

  updateInvoiceItem(e: any) {
    e?.stopPropagation();
    const invoicesItemObject = {
      item: {
        uuid: this.selectedItem
          ? this.selectedItem?.uuid
          : this.stockInvoiceItem?.item?.uuid,
      },
      batchNo: this.formValues?.mfgBatchNumber?.value,
      orderQuantity: Number(this.formValues?.orderQuantity?.value),
      batchQuantity: this.batchQuantity,
      amount: parseFloat(this.amount),
      unitPrice: parseFloat(this.unitPrice),
      location: {
        uuid: this.currentLocation?.uuid,
      },
      stockInvoiceItemStatus: [
        {
          status: "DRAFT",
        },
      ],
      uom: {
        uuid: this.unitOfMeasure?.uuid,
      },
      expiryDate: dateToISOStringMidnight(
        new Date(moment(this.formValues?.expiryDate?.value).toDate())
      ),
    };
    this.saving = true;
    this.stockInvoicesService
      .updateStockInvoiceItem(this.stockInvoiceItem?.uuid, invoicesItemObject)
      .pipe(tap((response) => {}))
      .subscribe((response: any) => {
        this.saving = false;
        this.setFields();
        this.closeDialog.emit();
      });
  }

  // onGetBatchQuantity(formValue: FormValue) {
  //   this.batchQuantity = formValue.getValues()?.batchQuantity?.value;
  //   if (this.batchQuantity.length && this.unitPrice.length) {
  //     const unit =
  //       this.unitOfMeasure?.mappings?.filter(
  //         (mapping) =>
  //           mapping?.conceptReferenceTerm?.uuid ===
  //           this.unitsOfMeasurementSettings?.conceptReferenceTerm
  //       )[0]?.conceptReferenceTerm?.code || 1;
  //     this.amount = (
  //       parseFloat(this.unitPrice) *
  //       this.batchQuantity *
  //       unit
  //     ).toFixed(2);
  //   }
  // }

  // onGetUnitPrice(formValue: FormValue) {
  //   this.unitPrice = formValue.getValues()?.unitPrice?.value;

  //   if (this.batchQuantity?.length * this.unitPrice?.length) {
  //     const unit =
  //       this.unitOfMeasure?.mappings?.filter(
  //         (mapping) =>
  //           mapping?.conceptReferenceTerm?.uuid ===
  //           this.unitsOfMeasurementSettings?.conceptReferenceTerm
  //       )[0]?.conceptReferenceTerm?.code || 1;
  //     this.amount = (
  //       parseFloat(this.unitPrice) *
  //       parseInt(this.batchQuantity) *
  //       unit
  //     ).toFixed(2);
  //   }
  // }

  onClosePopup(e: any) {
    e?.stopPropagation();
    this.closeDialog.emit();
  }
}
