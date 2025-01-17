import { Component, Input, OnInit, Provider } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { CreatePatientBedOrderModalComponent } from "src/app/shared/components/create-patient-bed-order-modal/create-patient-bed-order-modal.component";
import { DischargePatientModalComponent } from "src/app/shared/components/discharge-patient-modal/discharge-patient-modal.component";
import { TransferPatientOutsideComponent } from "src/app/shared/components/transfer-patient-outside/transfer-patient-outside.component";
import { TransferWithinComponent } from "src/app/shared/components/transfer-within/transfer-within.component";
import { Patient } from "src/app/shared/resources/patient/models/patient.model";
import { Visit } from "src/app/shared/resources/visits/models/visit.model";
import { go } from "src/app/store/actions";
import { clearBills } from "src/app/store/actions/bill.actions";
import { saveObservationsUsingEncounter } from "src/app/store/actions/observation.actions";
import { AppState } from "src/app/store/reducers";
import { getCurrentLocation } from "src/app/store/selectors";
import {
  getCurrentUserDetails,
  getCurrentUserPrivileges,
} from "src/app/store/selectors/current-user.selectors";
import {
  getGroupedObservationByConcept,
  getSavingObservationStatus,
} from "src/app/store/selectors/observation.selectors";
import {
  getActiveVisit,
  getVisitLoadingState,
} from "src/app/store/selectors/visit.selectors";
import {
  addBillStatusOnBedOrders,
  getCountOfUnPaidBedOrders,
} from "../../helpers/sanitize-bed-orders.helper";
import { AssignBedToPatientComponent } from "../assign-bed-to-patient/assign-bed-to-patient.component";

@Component({
  selector: "app-inpatient",
  templateUrl: "./inpatient.component.html",
  styleUrls: ["./inpatient.component.scss"],
})
export class InpatientComponent implements OnInit {
  @Input() activeVisit: Visit;
  @Input() bedsByLocationDetails: any;
  @Input() currentPatient: Patient;
  @Input() provider: Provider;
  @Input() patientBillingDetails: any;
  @Input() formPrivilegesConfigs: any[];
  @Input() currentUser: any;
  @Input() userPrivileges: any;
  savingObservations$: Observable<boolean>;
  bedOrdersWithBillStatus: any[];
  countOfUnPaidBedOrders: number;
  now: Date = new Date();
  currentBedOrder: any;
  applicableForms: any[];
  forms$: Observable<any[]>;
  observations$: Observable<any>;

  selectedTab = new UntypedFormControl(0);
  lastBedOrder: any;
  observationsGroupedByConcept$: Observable<any>;

  // For shared patient dashboard
  iCareGeneralConfigurations$: any;
  currentUser$: Observable<any>;
  userPrivileges$: Observable<any>;
  loadingVisit$: Observable<any>;
  activeVisit$: Observable<any>;
  currentLocation$: Observable<any>;

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private systemSettingsService: SystemSettingsService
  ) {}

  ngOnInit(): void {
    const bedOrders =
      this.activeVisit &&
      this.activeVisit.otherOrders &&
      this.activeVisit.otherOrders?.length > 0
        ? this.activeVisit.otherOrders.filter(
            (otherOrder) =>
              otherOrder?.order?.orderType?.name.toLowerCase() === "bed order"
          ) || []
        : [];
    this.bedOrdersWithBillStatus = addBillStatusOnBedOrders(
      bedOrders,
      this.patientBillingDetails?.bills,
      this.activeVisit
    );

    this.currentBedOrder = this.bedOrdersWithBillStatus[0];
    this.lastBedOrder = this.bedOrdersWithBillStatus[0];

    this.countOfUnPaidBedOrders = getCountOfUnPaidBedOrders(
      this.bedOrdersWithBillStatus
    );

    this.observations$ = this.store.select(getGroupedObservationByConcept);
    this.savingObservations$ = this.store.pipe(
      select(getSavingObservationStatus)
    );

    this.observationsGroupedByConcept$ = this.store.select(
      getGroupedObservationByConcept
    );

    // New for shared consultation
    this.iCareGeneralConfigurations$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "iCare.GeneralMetadata.Configurations"
      );
    this.currentUser$ = this.store.select(getCurrentUserDetails);
    this.userPrivileges$ = this.store.select(getCurrentUserPrivileges);
    this.loadingVisit$ = this.store.pipe(select(getVisitLoadingState));
    this.activeVisit$ = this.store.pipe(select(getActiveVisit));
    this.currentLocation$ = this.store.select(getCurrentLocation(false));
  }

  onAssignBed(location, patient, provider, visit, bedOrdersWithBillStatus) {
    this.dialog.open(AssignBedToPatientComponent, {
      width: "70%",
      maxHeight: "570px",
      data: {
        location,
        patient,
        provider,
        visit,
        bedOrdersWithBillStatus,
      },
      disableClose: true,
      panelClass: "custom-dialog-container",
    });
  }

  onAdmit(e, location, patient, provider, visit, bedOrdersWithBillStatus) {
    e.stopPropagation();
    this.dialog.open(AssignBedToPatientComponent, {
      width: "70%",
      maxHeight: "570px",
      data: {
        location,
        patient,
        provider,
        visit,
        bedOrdersWithBillStatus,
      },
      disableClose: true,
      panelClass: "custom-dialog-container",
    });
  }

  clearBills(event: Event) {
    event.stopPropagation();
    this.store.dispatch(clearBills());
  }

  changeTab(index) {
    this.selectedTab.setValue(index);
  }

  onSaveObservations(data: any, patient): void {
    this.store.dispatch(
      saveObservationsUsingEncounter({
        data,
        patientId: patient?.patient?.uuid,
      })
    );
  }

  setCurrentBedOrder(event: Event, bedOrder) {
    event.stopPropagation();
    this.currentBedOrder = null;
    setTimeout(() => {
      this.currentBedOrder = bedOrder;
    }, 100);
  }

  transferPatient(event: Event, visit): void {
    event.stopPropagation();
    this.dialog.open(TransferWithinComponent, {
      height: "250px",
      width: "40%",
      data: {
        patient: this.currentPatient,
        form: { form: { formUuid: null } },
        visit,
        locationType: "Bed Location",
        path: "/inpatient",
      },
      disableClose: false,
      panelClass: "custom-dialog-container",
    });
  }

  transferPatientOutSide(event: Event, visit): void {
    event.stopPropagation();
    this.dialog.open(TransferPatientOutsideComponent, {
      minHeight: "250px",
      width: "70%",
      data: {
        patient: this.currentPatient,
        form: {
          formUuid: "iCARE703-FORM-4df6-a364-abc9b1f48193",
          locationType: "Refer-to Location",
        },
        visit,
        path: "/inpatient/dashboard/" + this.currentPatient["patient"]["uuid"],
        params: { patient: this.currentPatient["patient"]["uuid"] },
      },
      disableClose: false,
      panelClass: "custom-dialog-container",
    });
  }

  dischargePatient(event: any, visit, currentPatient, provider, lastBedOrder) {
    this.dialog.open(DischargePatientModalComponent, {
      minWidth: "50%",
      data: {
        ...visit,
        provider,
        patient: currentPatient?.patient,
        lastBedOrder,
        invoice: event?.invoice,
      },
    });
  }

  createNewOrder(event: Event, visit, currentPatient, provider, lastBedOrder) {
    event.stopPropagation();
    this.dialog
      .open(CreatePatientBedOrderModalComponent, {
        minWidth: "30%",
        data: {
          ...visit,
          provider,
          patient: currentPatient?.patient,
          lastBedOrder,
        },
      })
      .afterClosed()
      .subscribe(() => {
        window.location.reload();
      });
  }

  getBackToPatientsList(event: Event): void {
    event.stopPropagation();
    this.store.dispatch(go({ path: ["/inpatient"] }));
  }
}
