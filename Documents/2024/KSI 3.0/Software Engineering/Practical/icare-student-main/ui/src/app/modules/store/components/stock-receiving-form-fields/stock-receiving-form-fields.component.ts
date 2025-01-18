import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { flatten } from "lodash";
import * as moment from "moment";
import { from, Observable, of, zip } from "rxjs";
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from "rxjs/operators";
import { dateToISOStringMidnight, formatDateToYYMMDD } from "src/app/shared/helpers/format-date.helper";
import { DateField } from "src/app/shared/modules/form/models/date-field.model";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";
import { Api } from "src/app/shared/resources/openmrs";
import { StockInvoicesService } from "src/app/shared/resources/store/services/stockInvoice.service";
import { ItemPriceService } from "src/app/shared/services/item-price.service";

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
  reloadFields: boolean = false;
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
  unitOfMeasure: any;
  stockInvoice: any;

  constructor(
    private api: Api,
    private itemPriceService: ItemPriceService,
    private stockInvoicesService: StockInvoicesService
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
        options: supplierFieldOptions,
        value: this.existingStockInvoice
          ? this.existingStockInvoice?.supplier?.uuid
          : "",
      }),
      new Textbox({
        id: "invoiceNumber",
        key: "invoiceNumber",
        label: "Invoice Number",
        value: this.existingStockInvoice
          ? this.existingStockInvoice?.invoiceNumber
          : "",
      }),
      new DateField({
        id: "receivingDate",
        key: "receivingDate",
        label: "Receiving Date",
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

  setFields() {
    const unitOfMeasureOptions = this.unitsOfMeasurements?.map((unit) => {
      return {
        key: unit?.uuid,
        label: unit?.display,
        value: unit,
        name: unit?.display,
      };
    });

    // this.itemField = new Textbox({
    //   id: "item",
    //   key: "item",
    //   label: "Item",
    //   value: this.stockInvoiceItem ? this.stockInvoiceItem?.item?.display : "",
    // });
    this.itemField = new Dropdown({
      id: "item",
      key: "item",
      label: "Item",
      required: true,
      options: [],
      shouldHaveLiveSearchForDropDownFields: true,
      searchControlType: "billableItem",
      value: this.stockInvoiceItem ? this.stockInvoiceItem?.item?.display : "",
    });
    (this.unitField = new Dropdown({
      id: "unit",
      key: "unit",
      label: "Unit of Measure",
      options: unitOfMeasureOptions,
      value: this.stockInvoiceItem
        ? this.unitsOfMeasurements?.filter(
            (unit) => unit?.uuid === this.stockInvoiceItem?.uom?.uuid
          )[0]
        : null,
    })),
      (this.orderQuantityField = new Textbox({
        id: "orderQuantity",
        key: "orderQuantity",
        label: "Order Quantity",
        value: this.stockInvoiceItem
          ? this.stockInvoiceItem?.orderQuantity
          : "",
      })),
      (this.mfgBatchNumberField = new Textbox({
        id: "mfgBatchNumber",
        key: "mfgBatchNumber",
        label: "Mfg Batch Number",
        value: this.stockInvoiceItem ? this.stockInvoiceItem?.batchNo : "",
      })),
      (this.expiryDateField = new DateField({
        id: "expiryDate",
        key: "expiryDate",
        label: "Expiry Date",
        value: this.stockInvoiceItem
          ? formatDateToYYMMDD(new Date(this.stockInvoiceItem?.expiryDate))
          : "",
      })),
      (this.batchQuantityField = new Textbox({
        id: "batchQuantity",
        key: "batchQuantity",
        label: "Batch Quantity",
        disabled: true,
        value: this.stockInvoiceItem
          ? this.stockInvoiceItem?.batchQuantity
          : "",
      })),
      (this.unitPriceField = new Textbox({
        id: "unitPrice",
        key: "unitPrice",
        label: "Unit Price",
        value: this.stockInvoiceItem ? this.stockInvoiceItem?.unitPrice : "",
      })),
      (this.amount = this?.stockInvoiceItem
        ? this?.stockInvoiceItem?.amount
        : undefined);
    this.amountField = new Textbox({
      id: "amount",
      key: "amount",
      label: "Amount",
      disabled: true,
    });

    this.itemFields = [
      this.unitField,
      this.orderQuantityField,
      this.mfgBatchNumberField,
      this.expiryDateField,
      this.unitPriceField,
    ];
  }

  onFormUpdate(formValues: FormValue) {
    this.formValues = {
      ...this.formValues,
      ...formValues.getValues(),
    };

    // if (this.formValues?.item?.value?.length >= 3) {
    //   if (this.selectedItem?.display === this.formValues?.item?.value) {
    //     this.showItems = false;
    //   }
    //   if (this.selectedItem?.display !== this.formValues?.item?.value) {
    //     this.showItems = true;
    //     this.searchingItems = true;
    //     this.itemPriceService
    //       .getItem(this.formValues?.item?.value)
    //       .pipe(
    //         map((response) => {
    //           if (!response?.error) {
    //             this.searchingItems = false;
    //             this.items = response;
    //             this.getItemsInPages();
    //           }
    //         })
    //       )
    //       .subscribe();
    //   }
    // }

    this.selectedItem = this.formValues?.item?.value;
    this.unitOfMeasure = this.formValues?.unit?.value
      ? this.formValues?.unit?.value
      : this.unitsOfMeasurements?.filter(
        (unit) => unit?.uuid === this.stockInvoiceItem?.uom?.uuid
      )?.length > 0 ? this.unitsOfMeasurements?.filter(
        (unit) => unit?.uuid === this.stockInvoiceItem?.uom?.uuid
      )[0]: undefined;
    if (this.formValues?.orderQuantity?.value && this.unitOfMeasure) {
      const unit =
        this.unitOfMeasure?.mappings?.filter(
          (mapping) =>
            mapping?.conceptReferenceTerm?.conceptSource?.uuid ===
            this.unitsOfMeasurementSettings?.uuid
        )[0]?.conceptReferenceTerm?.code || 1;
      this.batchQuantity =
        this.batchQuantity &&
        this.formValues?.orderQuantity?.value * unit === this.batchQuantity
          ? this.batchQuantity
          : undefined;
      setTimeout(() => {
        this.batchQuantity =
          Number(this.formValues?.orderQuantity?.value) * unit;
        this.batchQuantityField.value = this.batchQuantity.toString();
      }, 100);
    }
    this.unitPrice = this.formValues?.unitPrice?.value;
    this.amount = undefined;
    if (this.batchQuantity && this.unitPrice && this.unitPrice !== "") {
      setTimeout(() => {
        this.amount = (parseFloat(this.unitPrice) * this.batchQuantity).toFixed(
          2
        );
      }, 100);
    }
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
      }, 200);
    } else {
      setTimeout(() => {
        this.itemsPerPage = this.items?.slice(this.pageIndex, this.endIndex);
        this.searchingItems = false;
      }, 100);
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
        value: this.selectedItem?.display,
      });
    }, 100);
  }

  saveInvoices(e: any) {
    e?.stopPropagation();
    if (this.stockInvoice) {
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
              uuid: this.selectedItem,
            },
            batchNo: this.formValues?.mfgBatchNumber?.value,
            orderQuantity: Number(this.formValues?.orderQuantity?.value),
            batchQuantity: Number(this.batchQuantity),
            amount: parseFloat(this.amount),
            unitPrice: parseFloat(this.unitPrice),
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
        .pipe(
          tap((response) => {
            if (!response?.error) {
              this.stockInvoice = response;
            }
            this.itemFields = [];
            setTimeout(() => {
              this.setFields();
            }, 100);
            this.loadInvoices.emit(response);
          })
        )
        .subscribe();
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
                uuid: this.selectedItem,
              },
              batchNo: this.formValues?.mfgBatchNumber?.value,
              orderQuantity: Number(this.formValues?.orderQuantity?.value),
              batchQuantity: this.batchQuantity,
              amount: parseFloat(this.amount),
              unitPrice: parseFloat(this.unitPrice),
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

      this.stockInvoicesService
        .createStockInvoices(invoicesObject)
        .pipe(
          tap((response) => {
            if (!response?.error) {
              this.stockInvoice = response;
            }
            this.itemFields = [];
            setTimeout(() => {
              this.setFields();
            }, 100);
            this.loadInvoices.emit(response);
          })
        )
        .subscribe();
    }
    this.amount = undefined;
    this.reloadItemFields(true);
  }

  onSaveUdatedInvoice() {
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
          }, 100);
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
          ? this.selectedItem
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

    this.stockInvoicesService
      .updateStockInvoiceItem(this.stockInvoiceItem?.uuid, invoicesItemObject)
      .pipe(
        tap((response) => {
          this.closeDialog.emit();
        })
      )
      .subscribe();
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
