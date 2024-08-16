import { Component, Input, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, of, zip } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { TextArea } from "src/app/shared/modules/form/models/text-area.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";
import { ICARE_CONFIG } from "src/app/shared/resources/config";
import { ObservationService } from "src/app/shared/resources/observation/services";
import { DrugOrdersService } from "src/app/shared/resources/order/services";
import { VisitsService } from "src/app/shared/resources/visits/services";
import { ItemPriceService } from "src/app/shared/services/item-price.service";
import { loadCustomOpenMRSForm } from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import { getCurrentLocation } from "src/app/store/selectors";
import { getCustomOpenMRSFormById } from "src/app/store/selectors/form.selectors";
import { sum, keyBy, omit } from "lodash";
import { MatDialog } from "@angular/material/dialog";
import { PosConfirmSalesModalComponent } from "../../modals/pos-confirm-sales-modal/pos-confirm-sales-modal.component";
import { OrdersService } from "src/app/shared/resources/order/services/orders.service";

@Component({
  selector: "app-cashier-dashboard",
  templateUrl: "./cashier-dashboard.component.html",
  styleUrls: ["./cashier-dashboard.component.scss"],
})
export class CashierDashboardComponent implements OnInit {
  @Input() formId: string;
  @Input() currentUser: any;
  @Input() currentLocation: any;
  @Input() visitUuid: string;
  @Input() patientUuid: string;
  @Input() encounterTypeUuid: string;
  @Input() provider: any;
  @Input() prescriptionVariables: any;
  @Input() shouldShowDoseDetails: string;
  customForm$: Observable<any>;
  searchItemFormField: any;
  selectedItems: any[] = [];
  formData: any;
  obsFormData: any;
  saving: boolean = false;
  quantityFields: any = {};
  doseFields: any = {};
  dosingUnitsFields: any = {};
  frequencysFields: any = {};
  durationFields: any = {};
  durationUnitsFields: any = {};
  routeFields: any = {};
  itemData: any;
  visitDetails$: Observable<any>;
  currentLocation$: Observable<any>;
  errors: any[] = [];
  itemsPrices: any = {};

  constructor(
    private store: Store<AppState>,
    private drugOrderService: DrugOrdersService,
    private visitService: VisitsService,
    private observationService: ObservationService,
    private itemPricesService: ItemPriceService,
    private dialog: MatDialog,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    if (this.shouldShowDoseDetails == "true") {
      this.prescriptionVariables = Object.keys(this.prescriptionVariables).map(
        (key: string) => {
          return this.prescriptionVariables[key];
        }
      );
    }
    this.loadVisitDetails();
    if (this.formId) {
      this.store.dispatch(loadCustomOpenMRSForm({ formUuid: this.formId }));
      this.customForm$ = this.store.select(
        getCustomOpenMRSFormById(this.formId)
      );
    }
    this.currentLocation$ = this.store.select(getCurrentLocation());
    this.createSearchItemFormField();
  }

  loadVisitDetails(): void {
    this.visitDetails$ = this.visitService.getVisitDetailsByVisitUuid(
      this.visitUuid
    );
  }

  createQuantityField(id?: string): void {
    this.quantityFields[id] = new Textbox({
      id: "quantity" + (id ? id : ""),
      key: "quantity" + (id ? id : ""),
      label: "Quantity",
      type: "number",
      min: 0,
    });
  }
  checkValue() {
    // console.log("selectedItems && " ,this.selectedItems)
  }

  createDoseInfoFields(id?: string): void {
    if (this.shouldShowDoseDetails == "true") {
      this.prescriptionVariables.forEach((variable: any) => {
        this.doseFields[variable?.key + id] =
          variable?.controlType === "textbox"
            ? new Textbox({
                id: variable?.key + (id ? id : ""),
                key: variable?.key + (id ? id : ""),
                label: variable?.name,
                required: true,
                type: variable?.type,
                min: 0,
              })
            : new Dropdown({
                id: variable?.key + (id ? id : ""),
                key: variable?.key + (id ? id : ""),
                label: variable?.name,
                required: true,
                searchControlType: "concept",
                conceptClass: "Misc",
                conceptUuid: variable?.uuid,
                shouldHaveLiveSearchForDropDownFields: true,
              });
      });
    } else {
      this.doseFields["instructions" + id] = new TextArea({
        id: "instructions" + (id ? id : ""),
        key: "instructions" + (id ? id : ""),
        label: "Instructions",
        rows: 1,
        required: false,
      });
    }
  }

  createSearchItemFormField(): void {
    this.searchItemFormField = new Dropdown({
      id: "item",
      key: "item",
      required: true,
      options: [],
      shouldHaveLiveSearchForDropDownFields: true,
      searchControlType: "drugStock",
      locationUuid: this.currentLocation?.uuid,
      placeholder: "Search item",
      label: "Search item",
    });
  }

  onFormUpdate(data: FormValue): void {
    this.obsFormData = data.getValues();
  }

  onSearchItemFormUpdate(formValues: FormValue): void {
    this.itemData = formValues.getValues()?.item?.value;
  }

  onFormDataUpdate(
    formValue: FormValue,
    itemUuid?: string,
    drugOrConceptUuid?: string,
    isDrug?: boolean
  ): void {
    this.formData = {
      ...this.formData,
      ...formValue.getValues(),
    };
    if (itemUuid && drugOrConceptUuid) {
      this.onChangeDrugQuantity(itemUuid, drugOrConceptUuid, isDrug);
    }
  }

  onChangeDrugQuantity(
    itemUuid: string,
    drugOrConceptUuid: string,
    isDrug?: boolean
  ): void {
    const pricePayload = isDrug
      ? {
          visitUuid: this.visitUuid,
          drugUuid: drugOrConceptUuid,
        }
      : {
          visitUuid: this.visitUuid,
          conceptUuid: drugOrConceptUuid,
        };

    this.itemsPrices[itemUuid] = {
      ready: false,
    };

    this.itemPricesService
      .getItemPrice(pricePayload)
      .pipe(
        tap((response: any) => {
          if (response) {
            this.itemsPrices[itemUuid] = {
              ready: true,
              price: !isNaN(
                Number(this.formData["quantity" + itemUuid]?.value) *
                  response?.price
              )
                ? Number(this.formData["quantity" + itemUuid]?.value) *
                  response?.price
                : null,
              isPriceSet: !isNaN(
                Number(this.formData["quantity" + itemUuid]?.value) *
                  response?.price
              )
                ? true
                : false,
            };
            const total = sum(
              this.selectedItems?.map((item: any) => {
                return this.itemsPrices[item?.itemUuid]?.price;
              })
            );
            this.itemsPrices["total"] = !isNaN(total) ? total : null;
          }
        })
      )
      .subscribe();
  }

  onAddToList(event: Event, item: any): void {
    if (event) {
      event.stopPropagation();
    }

    if (!keyBy(this.selectedItems, "itemUuid")[item?.itemUuid]) {
      this.itemsPrices[item?.itemUuid] = {
        ready: false,
      };
      this.selectedItems = [...this.selectedItems, item];
      this.createQuantityField(item?.itemUuid);
      this.createDoseInfoFields(item?.itemUuid);
      this.createSearchItemFormField();
    }
  }

  onRemove(event: Event, itemToRemove: any): void {
    event.stopPropagation();
    this.selectedItems = this.selectedItems?.filter(
      (item: any) => item?.name != itemToRemove?.name
    );

    // Recalculatr total price
    this.itemsPrices["total"] = sum(
      this.selectedItems?.map((item: any) => {
        return this.itemsPrices[item?.itemUuid]?.price;
      })
    );
  }

  onSave(event, items, currentLocation: any, customForm: any): void {
    event.stopPropagation();
    this.dialog
      .open(PosConfirmSalesModalComponent, {
        minWidth: "30%",
        data: {
          items,
          currentLocation,
          customForm,
          selectedItems: this.selectedItems,
          itemsPrices: this.itemsPrices,
        },
      })
      .afterClosed()
      .subscribe((shouldSave: boolean) => {
        if (shouldSave) {
          this.saving = true;
          /**1. Create encounter with obs
       2. Save prescription order
       3 Dispense */

          const generalOrders =
            (items?.filter((item: any) => item?.concept) || []).map(
              (item: any) => {
                return {
                  orderType: "iCARESTS-ADMS-1111-1111-525400e4297f",
                  concept: item?.concept?.uuid,
                  action: "NEW",
                  urgency: "ROUTINE",
                  type: "order",
                  orderer: this.provider?.uuid,
                  patient: this.patientUuid,
                  orderReason: null,
                  instructions:
                    this.formData["instructions" + item?.itemUuid] &&
                    this.formData["instructions" + item?.itemUuid]?.value
                      ? this.formData["instructions" + item?.itemUuid]?.value
                      : "",
                  careSetting: "Outpatient",
                  quantity: Number(
                    this.formData["quantity" + item?.itemUuid]?.value
                  ),
                };
              }
            ) || [];

          let encounterObject = {
            patient: this.patientUuid,
            encounterType: this.encounterTypeUuid,
            location: this.currentLocation?.uuid,
            encounterProviders: [
              {
                provider: this.provider?.uuid,
                encounterRole: ICARE_CONFIG?.encounterRole?.uuid,
              },
            ],
            visit: this.visitUuid,
            obs: this.obsFormData
              ? (
                  Object.keys(this.obsFormData).map((key: string) => {
                    return {
                      concept: key,
                      value: this.obsFormData[key]?.value,
                    };
                  }) || []
                ).filter((obs: any) => obs?.value) || []
              : [],
            orders: [],
            form:
              this.formId && customForm
                ? {
                    uuid: customForm?.uuid,
                  }
                : null,
          };

          this.observationService
            .saveEncounterWithObsDetails(encounterObject)
            .subscribe((encounterResponse: any) => {
              if (encounterResponse && !encounterResponse?.error) {
                const prescriptionOrders = (
                  items?.filter((item: any) => item?.drug) || []
                ).map((item: any) => {
                  const prescriptionOrder = {
                    encounter: encounterResponse?.uuid,
                    orderType: "iCARESTS-PRES-1111-1111-525400e4297f",
                    concept: item?.drug?.concept?.uuid,
                    drug: item?.id,
                    action: "NEW",
                    urgency: "ROUTINE",
                    type: "prescription",
                    orderer: this.provider?.uuid,
                    patient: this.patientUuid,
                    dose:
                      this.formData["dose" + item?.itemUuid] &&
                      this.formData["dose" + item?.itemUuid]?.value
                        ? this.formData["dose" + item?.itemUuid]?.value
                        : 1,
                    orderReason: null,
                    instructions:
                      this.formData["instructions" + item?.itemUuid] &&
                      this.formData["instructions" + item?.itemUuid]?.value
                        ? this.formData["instructions" + item?.itemUuid]?.value
                        : "",
                    doseUnits: {
                      uuid:
                        this.formData["doseUnits" + item?.itemUuid] &&
                        this.formData["doseUnits" + item?.itemUuid]?.value
                          ? this.formData["doseUnits" + item?.itemUuid]?.value
                          : "d8448002-3243-456b-bbe9-fc95562cf1f9",
                    },
                    route: {
                      uuid:
                        this.formData["route" + item?.itemUuid] &&
                        this.formData["route" + item?.itemUuid]?.value
                          ? this.formData["route" + item?.itemUuid]?.value
                          : "d8448002-3243-456b-bbe9-fc95562cf1f9",
                    },
                    frequency: {
                      uuid:
                        this.formData["frequency" + item?.itemUuid] &&
                        this.formData["frequency" + item?.itemUuid]?.value
                          ? this.formData["frequency" + item?.itemUuid]?.value
                          : "d8448002-3243-456b-bbe9-fc95562cf1f9",
                    },
                    duration:
                      this.formData["duration" + item?.itemUuid] &&
                      this.formData["duration" + item?.itemUuid]?.value
                        ? this.formData["duration" + item?.itemUuid]?.value
                        : 2,
                    durationUnits: {
                      uuid:
                        this.formData["durationUnits" + item?.itemUuid] &&
                        this.formData["durationUnits" + item?.itemUuid]?.value
                          ? this.formData["durationUnits" + item?.itemUuid]
                              ?.value
                          : "d8448002-3243-456b-bbe9-fc95562cf1f9",
                    },
                    careSetting: "Outpatient",
                    quantity: Number(
                      this.formData["quantity" + item?.itemUuid]?.value
                    ),
                    quantityUnits: {
                      uuid: "1513AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    },
                    numRefills: 1,
                    status: "EMPTY",
                    remarks: "Control status",
                    previousOrder: null,
                  };
                  return prescriptionOrder;
                });

                this.customForm$ = of(null);

                this.currentLocation$ = of(null);
                zip(
                  ...prescriptionOrders?.map((prescriptionOrder: any) => {
                    return this.drugOrderService
                      .saveDrugOrder(prescriptionOrder)
                      .pipe(
                        map((response: any) => response),
                        catchError((error: any) => of(error))
                      );
                  }),
                  ...generalOrders.map((generalOrder: any) => {
                    return this.ordersService
                      .createOrder({
                        ...omit(generalOrder, ["quantity"]),
                        encounter: encounterResponse?.uuid,
                      })
                      .pipe(
                        map((response: any) => {
                          return {
                            ...response,
                            concept: {
                              uuid: generalOrder?.concept,
                            },
                            quantity: generalOrder?.quantity,
                          };
                        })
                      );
                  })
                ).subscribe((responses: any) => {
                  // nondrugorderbillanddispensing
                  // console.log("responses", responses);
                  if (responses) {
                    // DIspense all (TODO: improve api to accommodate direct dispensing)
                    zip(
                      ...responses.map((order: any) => {
                        const dispendingDetails = order?.drug
                          ? {
                              uuid: order?.uuid,
                              location: currentLocation?.uuid,
                              drug: {
                                uuid: order?.drug?.uuid,
                              },
                              quantity: order?.quantity,
                            }
                          : {
                              uuid: order?.uuid,
                              location: currentLocation?.uuid,
                              concept: {
                                uuid: order?.concept?.uuid,
                              },
                              quantity: order?.quantity,
                            };
                        return order?.drug
                          ? this.drugOrderService.dispenseOrderedDrugOrder(
                              dispendingDetails
                            )
                          : this.ordersService.createBillAndDispenseNonDrugOrder(
                              {
                                order: dispendingDetails?.uuid,
                                location: dispendingDetails?.location,
                                quantity: dispendingDetails?.quantity,
                              }
                            );
                      })
                    ).subscribe((dispenseResponses: any) => {
                      if (dispenseResponses) {
                        this.selectedItems = [];

                        this.currentLocation$ = this.store.select(
                          getCurrentLocation()
                        );
                        this.createSearchItemFormField();
                        this.saving = false;
                      }
                    });
                  }
                });
              } else {
                this.saving = false;
                this.errors =
                  encounterResponse?.error?.error?.fieldErrors &&
                  encounterResponse?.error?.error?.fieldErrors?.visit
                    ? encounterResponse?.error?.error?.fieldErrors?.visit?.map(
                        (fieldError: any) => {
                          return {
                            error: {
                              ...fieldError,
                              error: fieldError?.message,
                            },
                          };
                        }
                      ) || []
                    : [encounterResponse?.error];
              }
            });
        }
      });
  }

  onSelectDrug(selectedDrug: any): void {
    this.onAddToList(null, {
      ...selectedDrug,
      id: selectedDrug?.drug?.uuid,
      itemUuid: selectedDrug?.drug?.uuid,
      name: selectedDrug?.drug?.display,
      quantity: selectedDrug?.drug?.quantity,
    });
  }
}
