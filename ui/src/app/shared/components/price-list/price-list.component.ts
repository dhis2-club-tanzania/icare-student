import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
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
import { GoogleAnalyticsService } from "src/app/google-analytics.service";
@Component({
  selector: "app-price-list",
  templateUrl: "./price-list.component.html",
  styleUrls: ["./price-list.component.scss"],
})
export class PriceListComponent implements OnInit, OnChanges {
  @Input() paymentTypes: PaymentTypeInterface[];
  @Input() departmentId: string;
  @Input() hideDepartmentsSelection: boolean;
  currentDepartmentId: string;
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

  constructor(
    private dialog: MatDialog,
    private itemPriceService: ItemPriceService,
    private pricingService: PricingService,
    private store: Store<AppState>,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {}

  ngOnInit() {
    this.currentDepartmentId = this.departmentId;
    this.isDrug =
      this.currentDepartmentId && this.currentDepartmentId == "Drug"
        ? true
        : false;

    this.loadData();
    this.priceListDepartments$ =
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
          conceptSet: this.currentDepartmentId,
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
      minWidth: "50%",
      panelClass: "custom-dialog-container",
      data: { pricingItems },
    });
    this.trackActionForAnalytics("Add Price List: Open");
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
      [`${paymentScheme.uuid}_${priceItem.uuid}`]: false,
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
                conceptSet: this.currentDepartmentId,
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
      ? formValues[`${paymentSchemeUuid}_${priceItem.uuid}`]?.value
      : undefined;

    this.itemForSaving[`${paymentSchemeUuid}_${priceItem.uuid}`] = {
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
    const encodedSearchTerm = encodeURIComponent(this.itemSearchTerm);
    if (
      (this.itemSearchTerm && this.itemSearchTerm.length >= 3) ||
      this.itemSearchTerm === ""
    ) {
      this.store.dispatch(clearPricingItems());
      this.store.dispatch(
        loadPricingItems({
          filterInfo: {
            limit: 25,
            startIndex: 0,
            searchTerm: this.itemSearchTerm !== "" ? encodedSearchTerm : null,
            conceptSet: departmentId,
            isDrug: this.isDrug,
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
  trackActionForAnalytics(eventname: any) {
    // Send data to Google Analytics
    this.googleAnalyticsService.sendAnalytics(
      "Pharmacy",
      eventname,
      "Pharmacy"
    );
  }
}
