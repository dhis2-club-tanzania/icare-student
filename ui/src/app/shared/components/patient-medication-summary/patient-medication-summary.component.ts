import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Observable, of, zip } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";
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
  generalPrescriptionOrderType$: Observable<string>;
  useGeneralPrescription$: Observable<boolean>;
  currentVisit$: Observable<Visit>;
  filteredDrugOrders$: Observable<{ dispensedDrugOrders: any[]; toBeDispensedDrugOrders: any[] }>;

  @Output() updateConsultationOrder = new EventEmitter<void>();
  @Output() updateMedicationComponent = new EventEmitter<void>();

  constructor(
    private store: Store<AppState>,
    private ordersService: OrdersService,
    private dialog: MatDialog,
    private visitService: VisitsService,
    private systemSettingsService: SystemSettingsService,
    private drugOrderService: DrugOrdersService
  ) {}

  ngOnInit(): void {
    this.generalPrescriptionOrderType$ = this.systemSettingsService.getSystemSettingsByKey(
      "iCare.clinic.genericPrescription.orderType"
    );
    this.useGeneralPrescription$ = this.systemSettingsService.getSystemSettingsByKey(
      "iCare.clinic.useGeneralPrescription"
    );

    this.loadVisit();

    if (this.patientVisit) {
      this.initializeDrugOrders();
    }
  }

  private initializeDrugOrders(): void {
    this.drugOrders$ = this.ordersService
      .getOrdersByVisitAndOrderType({
        visit: this.patientVisit?.uuid,
        orderType: "iCARESTS-PRES-1111-1111-525400e4297f", // TODO: Replace with a dynamic value from system settings
      })
      .pipe(
        map((response) =>
          response?.map((drugOrder) => ({
            ...drugOrder,
            dispensed: drugOrder?.statuses?.some((status) => status?.status === "DISPENSED"),
          }))
        ),
        catchError((error) => {
          console.error("Error fetching drug orders", error);
          return of([]);
        })
      );

    this.filteredDrugOrders$ = zip(this.drugOrders$, this.getDrugOrderStatuses()).pipe(
      map(([drugOrders, drugOrdersStatuses]) => {
        const dispensedDrugOrders = drugOrders.filter(
          (order) => drugOrdersStatuses[order?.uuid]?.status === "DISPENSED"
        );

        const toBeDispensedDrugOrders = drugOrders.filter(
          (order) => !drugOrdersStatuses[order?.uuid]?.status || drugOrdersStatuses[order?.uuid]?.status !== "DISPENSED"
        );

        return { dispensedDrugOrders, toBeDispensedDrugOrders };
      })
    );
  }

  private getDrugOrderStatuses(): Observable<any> {
    return this.drugOrderService.getDrugOrderStatus(this.patientVisit?.uuid).pipe(
      map((response) => response || {}),
      catchError((error) => {
        console.error("Error fetching drug order statuses", error);
        return of({});
      })
    );
  }

  private loadVisit(): void {
    const visitUuid = this.patientVisit?.uuid || "";
    this.currentVisit$ = this.visitService.getVisitDetailsByVisitUuid(visitUuid, {
      v:
        "custom:(uuid,display,patient,startDatetime,attributes,stopDatetime," +
        "patient:(uuid,display,identifiers,person,voided)," +
        "encounters:(uuid,diagnoses,display,obs,orders,encounterProviders," +
        "encounterDatetime,encounterType,voided,voidReason),attributes)",
    });
  }

  onAddOrder(e: Event): void {
    e.stopPropagation();

    const dialogRef = this.dialog.open(DispensingFormComponent, {
      width: "80%",
      disableClose: true,
      data: {
        drugOrder: null,
        patient: this.patientVisit?.patientUuid,
        patientUuid: this.patientVisit?.patientUuid,
        visit: this.patientVisit,
        location: this.getCurrentLocation(),
        encounterUuid: this.getEncounterUuid(),
        fromDispensing: this.fromDispensing,
        showAddButton: false,
        forConsultation: this.forConsultation,
      },
    });

    dialogRef.afterClosed().subscribe((data) => {
      this.loadVisit();
      if (data?.updateConsultationOrder) {
        this.updateMedicationComponent.emit();
        this.updateConsultationOrder.emit();
      }
    });
  }

  private getCurrentLocation(): any {
    return localStorage.getItem("currentLocation")
      ? JSON.parse(localStorage.getItem("currentLocation"))
      : null;
  }

  private getEncounterUuid(): string {
    const consultation = localStorage.getItem("patientConsultation");
    return consultation ? JSON.parse(consultation)["encounterUuid"] : "";
  }
}
