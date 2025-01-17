import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Observable, of, zip } from "rxjs";
import { map, tap } from "rxjs/operators";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { AppState } from "src/app/store/reducers";
import { DispensingFormComponent } from "../../dialogs";
import { DrugOrdersService } from "../../resources/order/services";
import { OrdersService } from "../../resources/order/services/orders.service";
import { VisitObject } from "../../resources/visits/models/visit-object.model";
import { Visit } from "../../resources/visits/models/visit.model";
import { VisitsService } from "../../resources/visits/services";

@Component({
  selector: "app-patient-medication-summary",
  templateUrl: "./patient-medication-summary.component.html",
  styleUrls: ["./patient-medication-summary.component.scss"],
})
export class PatientMedicationSummaryComponent implements OnInit {
  @Input() patientVisit: VisitObject;
  @Input() forConsultation: boolean;
  @Input() fromDispensing: boolean;
  @Input() isInpatient: boolean;
  @Input() previous: boolean;
  @Input() forHistory: boolean;
  drugOrders$: Observable<any>;
  patientVisitData$: Observable<any>;
  generalPrescriptionOrderType$: Observable<any>;
  useGeneralPrescription$: Observable<any>;
  currentVisit$: Observable<any>;

  @Output() updateConsultationOrder = new EventEmitter();
  @Output() updateMedicationComponent = new EventEmitter();
  patientDrugOrdersStatuses$: Observable<any>;
  filteredDrugOrders$: Observable<any>;
  visitDetails$: Observable<any>;
  constructor(
    private store: Store<AppState>,
    private ordersService: OrdersService,
    private dialog: MatDialog,
    private visitService: VisitsService,
    private systemSettingsService: SystemSettingsService,
    private drugOrderService: DrugOrdersService
  ) {}

  ngOnInit(): void {
    this.generalPrescriptionOrderType$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "iCare.clinic.genericPrescription.orderType"
      );
    this.useGeneralPrescription$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "iCare.clinic.useGeneralPrescription"
      );
    if (this.previous) {
      this.currentVisit$ = of(new Visit(this.patientVisit));
    } else if (!this.previous && !this.forHistory) {
      this.loadVisit();
    } else {
      this.currentVisit$ = of(this.patientVisit);
    }
    if (this.patientVisit) {
      this.drugOrders$ = this.ordersService
        .getOrdersByVisitAndOrderType({
          visit: this.patientVisit?.uuid,
          orderType: "iCARESTS-PRES-1111-1111-525400e4297f", // TODO: This has to be softcoded
        })
        .pipe(
          map((response) => {
            return response?.map((drugOrder) => {
              return {
                ...drugOrder,
                dispensed:
                  (
                    drugOrder?.statuses?.filter(
                      (status) => status?.status === "DISPENSED"
                    ) || []
                  ).length > 0,
              };
            });
          })
        );
      this.patientDrugOrdersStatuses$ = this.drugOrderService
        .getDrugOrderStatus(this.patientVisit?.uuid)
        .pipe(
          map((response) => {
            return response;
          })
        );

      this.filteredDrugOrders$ = zip(
        this.drugOrders$,
        this.patientDrugOrdersStatuses$
      ).pipe(
        map((res) => {
          let drugOrders = res[0];
          let drugOrdersStatuses = res[1];
          let toBeDispensedDrugOrders: any[] = [];
          let dispensedDrugOrders: any[] = [];

          if (drugOrders?.length > 0) {
            drugOrders?.forEach((drugOrder) => {
              if (
                drugOrder?.uuid in drugOrdersStatuses &&
                drugOrdersStatuses[drugOrder?.uuid]["status"] === "DISPENSED"
              ) {
                dispensedDrugOrders = [...dispensedDrugOrders, drugOrder];
              } else {
                toBeDispensedDrugOrders = [
                  ...toBeDispensedDrugOrders,
                  drugOrder,
                ];
              }
            });
          }

          return {
            dispensedDrugOrders: dispensedDrugOrders,
            toBeDispensedDrugOrders: toBeDispensedDrugOrders,
          };
        })
      );
    }
  }

  loadVisit(visit?: any) {
    this.currentVisit$ = of(null);
    let visitUuid = this.patientVisit?.uuid
      ? this.patientVisit?.uuid
      : visit
      ? visit?.uuid
      : "";
    this.currentVisit$ = this.visitService.getVisitDetailsByVisitUuid(
      visitUuid,
      {
        v:
          "custom:(uuid,display,patient,startDatetime,attributes,stopDatetime," +
          "patient:(uuid,display,identifiers,person,voided)," +
          "encounters:(uuid,diagnoses,display,obs,orders,encounterProviders," +
          "encounterDatetime,encounterType,voided,voidReason),attributes)",
      }
    );
  }

  onAddOrder(e: Event) {
    e.stopPropagation();
    const dialog = this.dialog.open(DispensingFormComponent, {
      width: "80%",
      disableClose: true,
      data: {
        drugOrder: null,
        patient: this.patientVisit?.patientUuid,
        patientUuid: this.patientVisit?.patientUuid,
        visit: this.patientVisit,
        location: localStorage.getItem("currentLocation")
          ? JSON.parse(localStorage.getItem("currentLocation"))
          : null,
        encounterUuid: JSON.parse(localStorage.getItem("patientConsultation"))[
          "encounterUuid"
        ],
        fromDispensing: this.fromDispensing,
        showAddButton: false,
        forConsultation: this.forConsultation,
      },
    });

    dialog.afterClosed().subscribe((data) => {
      this.loadVisit();
      if (data?.updateConsultationOrder) {
        this.updateMedicationComponent.emit();
        this.updateConsultationOrder.emit();
      }
    });
  }
}
