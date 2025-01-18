import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Observable, of, zip } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
import { OrdersService } from "src/app/shared/resources/order/services/orders.service";
import { Visit } from "src/app/shared/resources/visits/models/visit.model";
import { ItemPriceService } from "src/app/shared/services/item-price.service";
import { sum } from "lodash";
import { DrugOrdersService } from "src/app/shared/resources/order/services";
import { DrugOrder } from "src/app/shared/resources/order/models";
import { keyBy, omit } from "lodash";
import { MatCheckboxChange } from "@angular/material/checkbox";

@Component({
  selector: "app-drugs-list-to-send-for-billing",
  templateUrl: "./drugs-list-to-send-for-billing.component.html",
  styleUrls: ["./drugs-list-to-send-for-billing.component.scss"],
})
export class DrugsListToSendForBillingComponent implements OnInit {
  @Input() currentLocation: any;
  @Input() visit: Visit;
  @Input() loading: boolean;
  @Input() loadingError: string;
  @Input() encounterUuid: string;
  @Input() canAddPrescription: boolean;
  @Input() currentPatient: any;
  @Input() generalMetadataConfigurations: any;
  @Input() provider: any;
  @Output() reload: EventEmitter<boolean> = new EventEmitter<boolean>();
  drugOrders$: Observable<any[]>;
  drugQuantities: any = {};
  prices: any = {};
  prices$: Observable<any>;
  pricesForSelectedDrugOrders$: Observable<any>;
  totalPrice$: Observable<number>;
  saving: boolean = false;
  selectedDrugOrders: any = {};
  allSelected: boolean = false;
  constructor(
    private ordersService: OrdersService,
    private itemPricesService: ItemPriceService,
    private drugOrderService: DrugOrdersService
  ) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    this.drugOrders$ = this.ordersService
      .getOrdersByVisitAndOrderType({
        visit: this.visit?.uuid,
        orderType: "iCARESTS-PRES-1111-1111-525400e4297f",
      })
      .pipe(filter((order) => !order?.previousOrder?.uuid));
    this.drugOrders$.subscribe((drugOrders) => {
      if (drugOrders) {
        const previousOrders =
          (
            drugOrders?.filter((drugOrder) => drugOrder?.previousOrder?.uuid) ||
            []
          )?.map((order) => order?.previousOrder) || [];
        const keyedPreviousOrder = keyBy(previousOrders, "uuid");

        drugOrders =
          drugOrders?.filter(
            (drugOrder) =>
              drugOrder?.statuses?.length === 0 &&
              !keyedPreviousOrder[drugOrder?.uuid]
          ) || [];
        drugOrders?.forEach((order) => {
          this.drugQuantities[order?.uuid] = Number(order?.quantity);
          this.getPrice(
            this.visit?.uuid,
            order?.uuid,
            Number(order?.quantity),
            order?.drug?.uuid
          );
        });
      }
    });
  }

  setDrugQuantity(
    event: KeyboardEvent,
    drugOrderUuid: string,
    visitUuid: string,
    drugUuid: string
  ): void {
    const quantity = Number((event.target as HTMLInputElement)?.value);
    this.drugQuantities[drugOrderUuid] = quantity;
    this.getPrice(visitUuid, drugOrderUuid, quantity, drugUuid);
  }

  validOrders(drugOrders): any[] {
    const previousOrders =
      (
        drugOrders?.filter((drugOrder) => drugOrder?.previousOrder?.uuid) || []
      )?.map((order) => order?.previousOrder) || [];
    const keyedPreviousOrder = keyBy(previousOrders, "uuid");

    return (
      drugOrders?.filter(
        (drugOrder) =>
          drugOrder?.statuses?.length === 0 &&
          !keyedPreviousOrder[drugOrder?.uuid]
      ) || []
    );
  }

  sendToCashier(event: Event, drugOrders: any[]): void {
    event.stopPropagation();
    this.saving = true;
    const previousOrders =
      (
        drugOrders?.filter((drugOrder) => drugOrder?.previousOrder?.uuid) || []
      )?.map((order) => order?.previousOrder) || [];
    const keyedPreviousOrder = keyBy(previousOrders, "uuid");

    drugOrders =
      drugOrders?.filter(
        (drugOrder) =>
          drugOrder?.statuses?.length === 0 &&
          !keyedPreviousOrder[drugOrder?.uuid]
      ) || [];
    const formattedOrders = (
      drugOrders?.filter(
        (drugOrder) => this.selectedDrugOrders[drugOrder?.uuid]
      ) || []
    )?.map((order) => {
      return {
        orderType: "iCARESTS-PRES-1111-1111-525400e4297f",
        drug: {
          uuid: order?.drug?.uuid,
        },
        concept: {
          uuid: order?.drug?.concept?.uuid,
        },
        action: order?.action || "REVISE",
        instructions: order?.instructions,
        urgency: "ROUTINE",
        location: localStorage.getItem("currentLocation")
          ? JSON.parse(localStorage.getItem("currentLocation"))["uuid"]
          : null,
        providerUuid: this.provider?.uuid,
        encounterUuid: order?.encounter?.uuid,
        patientUuid: this.visit.visit.patient?.uuid,
        status: "EMPTY",
        quantity: this.drugQuantities[order?.uuid],
        remarks: "Control status",
        previousOrder: order?.uuid,
      };
    });
    // console.log("orders", formattedOrders);
    zip(
      ...formattedOrders.map((drugOrder) =>
        this.drugOrderService.saveDrugOrder(
          DrugOrder.getOrderForSaving(drugOrder),
          "PRESCRIBE",
          this.visit.visit?.uuid,
          JSON.parse(localStorage.getItem("currentLocation"))["uuid"],
          this.provider?.uuid
        )
      )
    ).subscribe((response) => {
      if (response) {
        this.saving = false;
        this.getOrders();
        setTimeout(() => {
          this.reload.emit(true);
          this.allSelected = false;
        }, 200);
      }
    });
  }

  selectAllOrders(event: MatCheckboxChange, orders: any[]): void {
    // console.log(event);
    if (event.checked) {
      const drugOrders = this.validOrders(orders);
      this.selectedDrugOrders = keyBy(drugOrders, "uuid");
      this.allSelected = true;
    } else {
      this.selectedDrugOrders = {};
      this.allSelected = false;
    }

    this.formulatePriceForSelectedOrders();
  }

  selectDrugOrder(event: MatCheckboxChange, order: any, orders: any[]): void {
    if (event.checked) {
      this.selectedDrugOrders[order?.uuid] = order?.uuid;
      if (
        Object.keys(this.selectedDrugOrders).length ===
        this.validOrders(orders)?.length
      ) {
        this.allSelected = true;
      }
    } else {
      this.selectedDrugOrders = omit(this.selectedDrugOrders, order?.uuid);
      this.allSelected = false;
    }

    this.formulatePriceForSelectedOrders();
  }

  get isSendValid(): boolean {
    return Object.keys(this.selectedDrugOrders)?.length > 0;
  }

  getPrice(
    visitUuid: string,
    drugOrderUuid: string,
    quantity: number,
    drugUuid: string
  ): void {
    const pricePayload = {
      visitUuid: visitUuid,
      drugUuid: drugUuid,
    };
    this.itemPricesService
      .getItemPrice(pricePayload)
      .pipe(
        tap((response: any) => {
          this.prices[drugOrderUuid] = quantity * response?.price;
          this.prices$ = of(this.prices);
          this.totalPrice$ = of(
            sum(Object.keys(this.prices).map((key) => this.prices[key]))
          );
          this.formulatePriceForSelectedOrders();
        })
      )
      .subscribe();
  }

  formulatePriceForSelectedOrders(): void {
    this.pricesForSelectedDrugOrders$ = of(
      sum(
        (
          Object.keys(this.prices)?.filter(
            (key) => this.selectedDrugOrders[key]
          ) || []
        ).map((key) => this.prices[key])
      )
    );
  }
}
