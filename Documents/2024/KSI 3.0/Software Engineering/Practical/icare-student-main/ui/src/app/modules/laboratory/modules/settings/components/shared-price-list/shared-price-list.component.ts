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
import { ItemPriceInterface } from "src/app/modules/maintenance/models/item-price.model";
import { PricingItemInterface } from "src/app/modules/maintenance/models/pricing-item.model";
import { PaymentScheme } from "src/app/shared/models/payment-scheme.model";
import { PaymentTypeInterface } from "src/app/shared/models/payment-type.model";
import { Field } from "src/app/shared/modules/form/models/field.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { setCurrentPaymentType } from "src/app/store/actions/payment-type.actions";
import {
  clearPricingItems,
  initiatePricingItems,
  loadPricingItems,
  upsertPricingItem,
} from "src/app/store/actions/pricing-item.actions";
import { AppState } from "src/app/store/reducers";
import { getItemPriceEntities } from "src/app/store/selectors/item-price.selectors";
import {
  getAllPaymentTypes,
  getCurrentPaymentType,
  getPaymentSchemes,
  getPaymentTypeLoadingState,
} from "src/app/store/selectors/payment-type.selectors";
import {
  getAllPricingItems,
  getPricingItemLoadingState,
} from "src/app/store/selectors/pricing-item.selectors";
import { ItemPriceService } from "../../../../../../shared/services/item-price.service";
import { PricingService } from "../../../../../../shared/services/pricing.service";
import { ManageItemPriceComponent } from "../../../../../../shared/components/manage-item-price/manage-item-price.component";

@Component({
  selector: "app-shared-price-list",
  templateUrl: "./shared-price-list.component.html",
  styleUrls: ["./shared-price-list.component.scss"],
})
export class SharedPriceListComponent implements OnInit {
  @Input() paymentTypes: PaymentTypeInterface[];
  @Input() departmentId: string;
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
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    console.log(this.paymentTypes);
    this.currentDepartmentId = this.departmentId;
    this.loadData();
    this.priceListDepartments$ =
      this.itemPriceService.getDepartmentsByMappingSearchQuery("PRICE_LIST");
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
      [`${paymentScheme.uuid}_${priceItem.uuid}`]: false,
    };
  }

  onSaveItem(itemPrice): void {
    // this.store.dispatch(saveItemPrice({ itemPrice }));
    this.pricingService.saveItemPrice(itemPrice).subscribe((response) => {
      if (response && !response?.error) {
        this.loadData();
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
}
