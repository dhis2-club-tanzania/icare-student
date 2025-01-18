import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Observable, of, zip } from "rxjs";
import { catchError, map, take } from "rxjs/operators";
import { BillingService } from "src/app/modules/billing/services/billing.service";
import { PaymentService } from "src/app/modules/billing/services/payment.service";
import { ObservationObject } from "src/app/shared/resources/observation/models/obsevation-object.model";
import { Patient } from "src/app/shared/resources/patient/models/patient.model";
import { Visit } from "src/app/shared/resources/visits/models/visit.model";
import { VisitsService } from "src/app/shared/resources/visits/services";
import {
  go,
  loadCurrentPatient,
  loadLocationById,
  loadLocationsByTagName,
  loadOrderTypes,
  loadRolesDetails,
} from "src/app/store/actions";
import {
  clearBills,
  loadPatientBills,
} from "src/app/store/actions/bill.actions";
import { loadFormPrivilegesConfigs } from "src/app/store/actions/form-privileges-configs.actions";
import { loadActiveVisit } from "src/app/store/actions/visit.actions";
import { AppState } from "src/app/store/reducers";
import {
  getAllBedsUnderCurrentWard,
  getCurrentLocation,
} from "src/app/store/selectors";
import { getCurrentPatient } from "src/app/store/selectors/current-patient.selectors";
import {
  getCurrentUserDetails,
  getCurrentUserPrivileges,
  getProviderDetails,
} from "src/app/store/selectors/current-user.selectors";
import { getFormPrivilegesConfigs } from "src/app/store/selectors/form-privileges-configs.selectors";
import { getVitalSignObservations } from "src/app/store/selectors/observation.selectors";
import {
  getActiveVisit,
  getVisitLoadingState,
} from "src/app/store/selectors/visit.selectors";
import { AssignBedToPatientComponent } from "../../components/assign-bed-to-patient/assign-bed-to-patient.component";

@Component({
  selector: "app-inpatient-dashboard",
  templateUrl: "./inpatient-dashboard.component.html",
  styleUrls: ["./inpatient-dashboard.component.scss"],
})
export class InpatientDashboardComponent implements OnInit {
  visitLoadedState$: Observable<boolean>;
  loadingVisit$: Observable<boolean>;
  bedsUnderCurrentWard$: Observable<any>;
  currentLocation$: Observable<Location>;
  patient$: Observable<Patient>;
  provider$: Observable<any>;
  activeVisit$: Observable<Visit>;
  patientBillingDetails$: Observable<any>;
  loading: boolean = false;
  loadingError: string;
  userPrivileges$: Observable<any>;
  formPrivilegesConfigs$: Observable<any[]>;
  currentUser$: Observable<any>;

  vitalSignObservations$: Observable<any>;
  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private visitService: VisitsService,
    private billingService: BillingService,
    private paymentService: PaymentService
  ) {
    this.store.dispatch(loadFormPrivilegesConfigs());
    this.store.dispatch(loadRolesDetails());
    this.store.dispatch(loadOrderTypes());
  }

  ngOnInit(): void {
    const patientId = this.route.snapshot.queryParams["patient"];
    this.store.dispatch(loadActiveVisit({ patientId }));
    this.store.dispatch(loadCurrentPatient({ uuid: patientId }));
    this.store.dispatch(loadPatientBills({ patientUuid: patientId }));
    this.visitLoadedState$ = this.store.select(getVisitLoadingState);
    this.loadingVisit$ = this.store.select(getVisitLoadingState);
    this.patient$ = this.store.select(getCurrentPatient);
    this.vitalSignObservations$ = this.store.pipe(
      select(getVitalSignObservations)
    );
    this.currentUser$ = this.store.select(getCurrentUserDetails);

    this.userPrivileges$ = this.store.select(getCurrentUserPrivileges);

    this.provider$ = this.store.select(getProviderDetails);

    this.activeVisit$ = this.store.select(getActiveVisit);

    this.currentLocation$ = this.store.select(getCurrentLocation);
    this.patientBillingDetails$ = zip(
      this.visitService.getActiveVisit(patientId, false),
      this.billingService.getPatientBills(patientId),
      this.paymentService.getPatientPayments(patientId)
    ).pipe(
      map((res) => {
        this.loading = false;
        const visit = res[0];
        const bills = res[1];
        const payments = res[2];

        return {
          visit,
          bills: bills.filter((bill) => !bill.isInsurance),
          payments,
          paymentItemCount: payments
            .map((payment) => payment?.items?.length || 0)
            .reduce((sum, count) => sum + count, 0),
          pendingPayments: bills.filter((bill) => bill.isInsurance),
        };
      }),
      catchError((error) => {
        this.loadingError = error;
        this.loading = false;
        return of(null);
      })
    );
    this.currentLocation$.pipe(take(1)).subscribe((location: any) => {
      this.bedsUnderCurrentWard$ = this.store.select(
        getAllBedsUnderCurrentWard,
        {
          id: location?.uuid,
          tagName: "Bed Location",
        }
      );
    });
  }
}
