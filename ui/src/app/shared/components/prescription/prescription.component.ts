import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { AppState } from "src/app/store/reducers";
import {
  removeDrugOrder,
  saveDrugOrder,
  updateDrugOrder,
} from "src/app/store/actions";
import { Observable, of } from "rxjs";
import {
  getAllDrugOrders,
  getConsultationEncounterUuid,
  getCurrentLocation,
  getOrderTypesByName,
} from "src/app/store/selectors";
import { Patient } from "src/app/shared/resources/patient/models/patient.model";
import { getCurrentPatient } from "src/app/store/selectors/current-patient.selectors";
import { getProviderDetails } from "src/app/store/selectors/current-user.selectors";
import { ProviderGet } from "src/app/shared/resources/openmrs";
import { DrugOrder } from "src/app/shared/resources/order/models/drug-order.model";
import { ActivatedRoute } from "@angular/router";
import { Visit } from "src/app/shared/resources/visits/models/visit.model";
import { VisitsService } from "src/app/shared/resources/visits/services";
import { catchError, tap } from "rxjs/operators";
import { getVisitLoadedState } from "src/app/store/selectors/visit.selectors";

@Component({
  selector: "app-prescription",
  templateUrl: "./prescription.component.html",
  styleUrls: ["./prescription.component.scss"],
})
export class PrescriptionComponent implements OnInit {
  expandedRow: number;
  currentDrugOrder: any;
  countOfDrugsOrdered: number = 0;
  drugsOrdered$: Observable<any>;
  consultationEncounterUuid$: Observable<string>;
  patient$: Observable<Patient>;
  provider$: Observable<ProviderGet>;
  orderType$: Observable<any>;
  currentLocation$: Observable<any>;
  patientVisit$: Observable<Visit>;
  patientID: string;
  loading: boolean;
  loadingError: string;
  patientVisitLoadedState$: Observable<boolean>;
  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private visitService: VisitsService
  ) {}

  ngOnInit() {
    this.patientID = this.route.snapshot.params.patientID;
    this.patientVisitLoadedState$ = this.store.select(getVisitLoadedState);
    this._getPatientVisit();
    this.consultationEncounterUuid$ = this.store.pipe(
      select(getConsultationEncounterUuid)
    );
    this.patient$ = this.store.pipe(select(getCurrentPatient));
    this.provider$ = this.store.pipe(select(getProviderDetails));
    // TODO: Find best way to find order by type instead of name
    this.orderType$ = this.store.pipe(
      select(getOrderTypesByName, { name: "Drug Order" })
    );
    this.drugsOrdered$ = this.store.select(getAllDrugOrders);

    this.currentLocation$ = this.store.pipe(select(getCurrentLocation(false)));
  }

  private _getPatientVisit() {
    this.loading = true;
    this.patientVisit$ = this.visitService
      .getActiveVisit(this.patientID, false)
      .pipe(
        tap(() => {
          this.loading = false;
        }),
        catchError((error) => {
          this.loading = false;
          this.loadingError = error;
          return of(null);
        })
      );
  }

  onToggleExpand(rowNumber) {
    if (this.expandedRow === rowNumber) {
      this.expandedRow = undefined;
    } else {
      this.expandedRow = rowNumber;
    }
  }

  onOrderingDrug(drugOrder) {
    this.currentDrugOrder = drugOrder;
    this.countOfDrugsOrdered++;
    if (!drugOrder.uuid) {
      this.store.dispatch(
        saveDrugOrder({ drugOrder: DrugOrder.getOrderForSaving(drugOrder) })
      );
    } else {
      this.store.dispatch(
        updateDrugOrder({
          drugOrder: DrugOrder.getOrderForSaving(drugOrder),
        })
      );
    }
  }

  removeDrugFromList(drugOrder) {
    this.store.dispatch(removeDrugOrder({ orderId: drugOrder.id }));
    this.currentDrugOrder = null;
  }
  onOrderSelection(data): void {
    // console.log(data);
  }
}
