import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";

import { combineLatest } from "rxjs";
import { take } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { MatSelectChange } from "@angular/material/select";
import { select, Store } from "@ngrx/store";
import { find } from "lodash";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { ManageItemPriceComponent } from "src/app/shared/components/manage-item-price/manage-item-price.component";
import { PaymentScheme } from "src/app/shared/models/payment-scheme.model";
import { PaymentTypeInterface } from "src/app/shared/models/payment-type.model";
import { Field } from "src/app/shared/modules/form/models/field.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { setCurrentPaymentType } from "src/app/store/actions/payment-type.actions";
import { AppState } from "src/app/store/reducers";
import {
  clearPricingItems,
  initiatePricingItems,
  loadPricingItems,
  saveItemPrice,
  upsertPricingItem,
} from "../../../store/actions/pricing-item.actions";
import { getItemPriceEntities } from "../../../store/selectors/item-price.selectors";
import {
  getAllPaymentTypes,
  getCurrentPaymentType,
  getPaymentSchemes,
  getPaymentTypeLoadingState,
} from "../../../store/selectors/payment-type.selectors";
import {
  getAllPricingItems,
  getPricingItemLoadingState,
} from "../../../store/selectors/pricing-item.selectors";
import { ItemPriceInterface } from "../../../modules/maintenance/models/item-price.model";
import { PricingItemInterface } from "../../../modules/maintenance/models/pricing-item.model";
import { ItemPriceService } from "../../services/item-price.service";
import { PricingService } from "../../services/pricing.service";
import { all } from "cypress/types/bluebird";
import * as XLSX from 'xlsx';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-price-list",
  templateUrl: "./price-list.component.html",
  styleUrls: ["./price-list.component.scss"],
})
export class PriceListComponent implements OnInit, OnChanges {
  @Input() paymentTypes: PaymentTypeInterface[];
  @Input() departmentId: string;
  currentDepartmentId: number;

  priceList: any[];
  priceList$: Observable<any[]>;

  field: Field<string>;
  itemInEditing: any;
  itemForSaving: any;
  loadingPaymentTypes$: Observable<boolean>;
  itemSearchTerm: string;

  paymentTypes$: Observable<PaymentTypeInterface[]>;
  currentPaymentType$: Observable<PaymentTypeInterface>;
  currentPaymentType: PaymentTypeInterface;
  paymentSchemes: any[];
  paymentSchemes$: Observable<PaymentScheme[]>;

  addingPricingItem: boolean;
  loadingPricingItems$: Observable<boolean>;
  pricingItems$: Observable<PricingItemInterface[]>;

  itemPriceEntities$: Observable<{ [id: string]: ItemPriceInterface }>;

  paymentTypesAndSchemes: any[] = [];
  currentPage: number = 0;

  priceListDepartments$: Observable<any[]>;
  selectedPriceListDepartment: any;
  errors: any[] = [];
  isDrug: boolean = false;
  isUploading: boolean = false;
  // isDownloading: boolean = false;

  constructor(
    private dialog: MatDialog,
    private itemPriceService: ItemPriceService,
    private pricingService: PricingService,
    private store: Store<AppState>,
    private route: ActivatedRoute
  ) {
    this.currentDepartmentId = Number(this.route.snapshot.paramMap.get('departmentId'));
  }

  ngOnInit() {
    this.currentDepartmentId = parseInt(this.departmentId, 10);
    this.loadData();
    const newLocal = this;
    newLocal.priceListDepartments$ =
      this.itemPriceService.getDepartmentsByMappingSearchQuery("PRICE_LIST");
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes?.departmentId?.firstChange) {
      this.currentDepartmentId = changes?.departmentId?.currentValue;
      this.loadData();
    }
  }

  loadData(): void {
    this.paymentTypesAndSchemes = [];
    this.store.dispatch(
      initiatePricingItems({
        filterInfo: {
          limit: 25,
          startIndex: 0,
          searchTerm: null,
          conceptSet: this.currentDepartmentId.toString(),
          isDrug: this.isDrug,
        },
      })
    );

    this.paymentTypes.forEach((paymentType) => {
      paymentType.paymentSchemes.forEach((scheme) => {
        this.paymentTypesAndSchemes = [
          ...this.paymentTypesAndSchemes,
          { ...scheme, paymentType },
        ];
      });
    });
    this.currentPaymentType = this.paymentTypes[0];
    this.itemInEditing = {};
    this.itemForSaving = {};
    this.priceList = [];

    this.loadingPaymentTypes$ = this.store.pipe(
      select(getPaymentTypeLoadingState)
    );
    this.paymentTypes$ = this.store.pipe(select(getAllPaymentTypes));
    this.currentPaymentType$ = this.store.pipe(select(getCurrentPaymentType));
    this.paymentSchemes$ = this.store.pipe(select(getPaymentSchemes));

    this.loadingPricingItems$ = this.store.pipe(
      select(getPricingItemLoadingState)
    );
    this.pricingItems$ = this.store.pipe(select(getAllPricingItems));

    this.itemPriceEntities$ = this.store.pipe(select(getItemPriceEntities));
  }

  onCreate(e, pricingItems: PricingItemInterface[]): void {
    e.stopPropagation();
    const dialog = this.dialog.open(ManageItemPriceComponent, {
      width: "50%",
      panelClass: "custom-dialog-container",
      data: { pricingItems },
    });

    // TODO: Find best way in order to stop subscribing here
    dialog.afterClosed().subscribe((results) => {
      if (results) {
        const { priceItemInput, concept, drug } = results;

        const availableItem =
          find(pricingItems, ["drug", drug?.uuid]) ||
          find(pricingItems, ["concept", concept?.uuid]);
        if (false) {
          console.warn("ITEM ALREADY EXIST");
        } else {
          this.addingPricingItem = true;
          // TODO: Find best way to avoid subscription and handle update of table with new item
          if (priceItemInput) {
            this.itemPriceService
              .createItem(priceItemInput, this.paymentSchemes)
              .pipe(
                tap((response) => {
                  if (response.error) {
                    this.addingPricingItem = false;
                    this.errors = [
                      ...this.errors,
                      response.error,
                      {
                        error: {
                          message: response?.message,
                          detail: response?.error,
                        },
                      },
                    ];
                  }
                })
              )
              .subscribe((itemPrices) => {
                this.priceList = [...itemPrices, ...this.priceList];
              });
          } else {
            this.pricingService
              .createPricingItem(concept, drug)
              .pipe(
                tap((response) => {
                  if (response.error) {
                    this.addingPricingItem = false;
                    this.errors = [
                      ...this.errors,
                      {
                        error: {
                          message: response?.message,
                          detail: response?.error,
                        },
                      },
                    ];
                  }
                })
              )
              .subscribe(
                (pricingItem: PricingItemInterface) => {
                  this.addingPricingItem = false;
                  this.store.dispatch(upsertPricingItem({ pricingItem }));
                },
                () => {
                  this.addingPricingItem = false;
                }
              );
            this.addingPricingItem = false;
          }
        }
      }
    });
  }

  onViewItem(e, priceItem, paymentScheme): void {
    e.stopPropagation();
    this.itemInEditing = {
      ...this.itemInEditing,
      [${paymentScheme.uuid}_${priceItem.uuid}]: false,
    };
  }

  onSaveItem(itemPrice): void {
    // this.store.dispatch(saveItemPrice({ itemPrice }));
    this.pricingService.saveItemPrice(itemPrice).subscribe((response) => {
      if (response && !response?.error) {
        this.loadData();
        if (
          (this.itemSearchTerm && this.itemSearchTerm.length >= 3) ||
          this.itemSearchTerm === ""
        ) {
          this.store.dispatch(clearPricingItems());
          this.store.dispatch(
            loadPricingItems({
              filterInfo: {
                limit: 25,
                startIndex: this.currentPage,
                searchTerm:
                  this.itemSearchTerm !== "" ? this.itemSearchTerm : null,
                conceptSet: this.currentDepartmentId.toString(),
              },
            })
          );
        }
      }
    });
  }

  onFormUpdate(
    formValue: FormValue,
    priceItem: any,
    paymentSchemeUuid: string
  ) {
    const formValues = formValue.getValues();
    const price = formValues
      ? formValues[${paymentSchemeUuid}_${priceItem.uuid}]?.value
      : undefined;

    this.itemForSaving[${paymentSchemeUuid}_${priceItem.uuid}] = {
      item: {
        uuid: priceItem.uuid,
      },
      paymentType: priceItem.paymentType,
      paymentScheme: { uuid: paymentSchemeUuid },
      price,
    };
  }

  onSelectPaymentType(selectionChange: MatSelectChange) {
    if (selectionChange) {
      this.store.dispatch(
        setCurrentPaymentType({ currentPaymentType: selectionChange.value })
      );
    }
  }

  getAnotherList(event: Event, type: string, departmentId?: string): void {
    event.stopPropagation();
    this.currentPage =
      type === "next" ? this.currentPage + 1 : this.currentPage - 1;
    this.store.dispatch(clearPricingItems());
    this.store.dispatch(
      loadPricingItems({
        filterInfo: {
          limit: 25,
          startIndex: this.currentPage,
          searchTerm: this.itemSearchTerm,
          conceptSet: departmentId,
          isDrug: this.isDrug,
        },
      })
    );
  }

  onSearch(e: any, departmentId: string): void {
    e.stopPropagation();
    this.itemSearchTerm = e?.target?.value;
    if (
      (this.itemSearchTerm && this.itemSearchTerm.length >= 3) ||
      this.itemSearchTerm === ""
    ) {
      this.store.dispatch(clearPricingItems());
      this.store.dispatch(
        loadPricingItems({
          filterInfo: {
            limit: 25,
            startIndex: this.currentPage,
            searchTerm: this.itemSearchTerm !== "" ? this.itemSearchTerm : null,
            conceptSet: departmentId,
          },
        })
      );
    }
  }

  getSelectedDepartment(event: MatSelectChange): void {
    this.selectedPriceListDepartment = event?.value;
    this.isDrug = event?.value == "Drug";
    this.currentDepartmentId = this.selectedPriceListDepartment?.uuid;
    this.loadData();
  }

 
  
  // START CODES FOR DOWNLOADING METHOD

  downloadExcel(): void {
    // Combine latest values from observables using combineLatest
    combineLatest([
      this.pricingItems$,
      this.itemPriceEntities$
    ]).pipe(
      take(1)  // Take only the first emission
    ).subscribe(([pricingItems, priceEntities]) => {
      if (pricingItems && pricingItems.length > 0) {
        // Prepare worksheet data
        const worksheetData = pricingItems.map((item, index) => {
          // Get all prices for this item
          const itemPrices = item.prices || [];
          
          // Create the base data object
          const rowData = {
            '#': index + 1,
            'Item': item.display || item.name,
            // Cash payment categories
            'Cash - Normal track': this.findPrice(itemPrices, 'Normal track'),
            'Cash - Fast Track': this.findPrice(itemPrices, 'Fast Track'),
            'Cash - Post Graduate': this.findPrice(itemPrices, 'Post Graduate'),
            'Cash - Undergraduate': this.findPrice(itemPrices, 'Undergraduate'),
            // NHIF category
            'NHIF:1001': this.findPrice(itemPrices, 'NHIF:1001'),
            // Gepg category
            'Gepg': this.findPrice(itemPrices, 'Gepg')
          };
  
          return rowData;
        });
  
        // Create worksheet
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(worksheetData);
  
        // Set column widths
        ws['!cols'] = [
          { wch: 5 },    // #
          { wch: 40 },   // Item name
          { wch: 15 },   // Normal track
          { wch: 15 },   // Fast Track
          { wch: 15 },   // Post Graduate
          { wch: 15 },   // Undergraduate
          { wch: 15 },   // NHIF
          { wch: 15 }    // Gepg
        ];
  
        // Add header styling
        const headerRange = XLSX.utils.decode_range(ws['!ref']);
        for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
          const address = XLSX.utils.encode_col(C) + "1";
          if (!ws[address]) continue;
          ws[address].s = {
            fill: { fgColor: { rgb: "CCCCCC" } },
            font: { bold: true }
          };
        }
  
        // Create workbook and append worksheet
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Price List');
  
        // Generate excel file
        const excelBuffer: ArrayBuffer = XLSX.write(wb, { 
          bookType: 'xlsx', 
          type: 'array' 
        });
        
        // Create blob and trigger download
        const data = new Blob([excelBuffer], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(data);
        link.download = Drug_Price_List_${new Date().toISOString().split('T')[0]}.xlsx;
        link.click();
        
        // Clean up
        URL.revokeObjectURL(link.href);
      } else {
        console.warn('No pricing items to download');
        // Optionally show user feedback
        this.errors = [...this.errors, {
          error: {
            message: 'No pricing items available to download',
            detail: 'Please ensure there are items in the price list'
          }
        }];
      }
    });
  }
  
  // Helper method to find price by scheme name
  private findPrice(prices: any[], schemeName: string): number | string {
    const price = prices.find(p => 
      p.paymentScheme?.name === schemeName || 
      p.paymentScheme?.display === schemeName
    );
    return price ? price.price : '';
  }

  // END CODES FOR DOWNLOADING METHOD



  // START CODES FOR UPLOADING METHOD 

  uploadExcel(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    // Track analytics
    this.trackActionForAnalytics("Upload Price List Excel");

    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        // Read the Excel file
        const workBook: XLSX.WorkBook = XLSX.read(e.target.result, { type: 'array' });
        const workSheet: XLSX.WorkSheet = workBook.Sheets[workBook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(workSheet);

        // Get existing pricing items for reference
        this.pricingItems$.pipe(take(1)).subscribe(pricingItems => {
          const priceUpdates = [];

          jsonData.forEach((row: any) => {
            // Find matching item by name
            const matchingItem = pricingItems.find(item => 
              item.display === row['Item'] || item.name === row['Item']
            );

            if (matchingItem) {
              // Process Cash prices
              if (row['Cash - Normal track'] !== undefined) {
                priceUpdates.push(this.createPriceUpdate(
                  matchingItem.uuid,
                  'Normal track',
                  row['Cash - Normal track']
                ));
              }

              if (row['Cash - Fast Track'] !== undefined) {
                priceUpdates.push(this.createPriceUpdate(
                  matchingItem.uuid,
                  'Fast Track',
                  row['Cash - Fast Track']
                ));
              }

              if (row['Cash - Post Graduate'] !== undefined) {
                priceUpdates.push(this.createPriceUpdate(
                  matchingItem.uuid,
                  'Post Graduate',
                  row['Cash - Post Graduate']
                ));
              }

              if (row['Cash - Undergraduate'] !== undefined) {
                priceUpdates.push(this.createPriceUpdate(
                  matchingItem.uuid,
                  'Undergraduate',
                  row['Cash - Undergraduate']
                ));
              }

              // Process NHIF price
              if (row['NHIF:1001'] !== undefined) {
                priceUpdates.push(this.createPriceUpdate(
                  matchingItem.uuid,
                  'NHIF:1001',
                  row['NHIF:1001']
                ));
              }

              // Process Gepg price
              if (row['Gepg'] !== undefined) {
                priceUpdates.push(this.createPriceUpdate(
                  matchingItem.uuid,
                  'Gepg',
                  row['Gepg']
                ));
              }
            }
          });

          // Save all price updates
          if (priceUpdates.length > 0) {
            this.saveBatchPriceUpdates(priceUpdates);
          } else {
            this.errors = [...this.errors, {
              error: {
                message: 'No valid price updates found',
                detail: 'Please check the Excel file format and data'
              }
            }];
          }
        });

      } catch (error) {
        console.error('Error processing Excel file:', error);
        this.errors = [...this.errors, {
          error: {
            message: 'Failed to process Excel file',
            detail: error.message
          }
        }];
      }
    };

    reader.onerror = (error) => {
      this.errors = [...this.errors, {
        error: {
          message: 'Failed to read Excel file',
          detail: error
        }
      }];
    };

    reader.readAsArrayBuffer(file);
  }
  trackActionForAnalytics(arg0: string) {
    throw new Error("Method not implemented.");
  }

  private createPriceUpdate(itemUuid: string, schemeName: string, price: any): any {
    const scheme = this.paymentTypesAndSchemes.find(s => 
      s.name === schemeName || s.display === schemeName
    );

    if (!scheme) return null;

    return {
      item: { uuid: itemUuid },
      paymentScheme: { uuid: scheme.uuid },
      paymentType: scheme.paymentType,
      price: price !== '' ? parseFloat(price) : 0
    };
  }

  private saveBatchPriceUpdates(updates: any[]): void {
    const validUpdates = updates.filter(update => update !== null);
    
    if (validUpdates.length === 0) {
      this.errors = [...this.errors, {
        error: {
          message: 'No valid price updates to save',
          detail: 'Please check the payment scheme names in your Excel file'
        }
      }];
      return;
    }

    this.pricingService.saveItemPrice(validUpdates).pipe(
      take(1)
    ).subscribe(
      (response) => {
        if (response?.error) {
          this.errors = [...this.errors, {
            error: {
              message: 'Failed to save price updates',
              detail: response.error
            }
          }];
        } else {
          // Refresh the price list
          this.loadData();
        }
      },
      (error) => {
        this.errors = [...this.errors, {
          error: {
            message: 'Failed to save price updates',
            detail: error
          }
        }];
      }
    );
  }
}
