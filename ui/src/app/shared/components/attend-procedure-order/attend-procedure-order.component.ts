import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { loadOrderTypes } from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import { getAllOrderTypes } from "src/app/store/selectors";
import {
  getActiveVisitPendingVisitServiceBillStatus,
  getAllBills,
  getLoadingBillStatus,
} from "src/app/store/selectors/bill.selectors";
import { getCurrentPatient } from "src/app/store/selectors/current-patient.selectors";
import { getProviderDetails } from "src/app/store/selectors/current-user.selectors";
import {
  getGroupedObservationByConcept,
  getSavingObservationStatus,
} from "src/app/store/selectors/observation.selectors";
import { getActiveVisit } from "src/app/store/selectors/visit.selectors";
import { ProviderGet } from "../../resources/openmrs";

@Component({
  selector: "app-attend-procedure-order",
  templateUrl: "./attend-procedure-order.component.html",
  styleUrls: ["./attend-procedure-order.component.scss"],
})
export class AttendProcedureOrderComponent implements OnInit {
  dialogData: any;
  observations$: Observable<any>;
  savingObservations$: Observable<boolean>;
  billLoadingState$: Observable<boolean>;
  currentBills$: Observable<any>;
  doesPatientHasPendingPaymentForTheCurrentVisitType$: Observable<boolean>;
  provider$: Observable<ProviderGet>;
  visit$: Observable<any>;
  patient$: Observable<any>;
  orderTypes$: Observable<any>;
  constructor(
    private store: Store<AppState>,
    private dialogRef: MatDialogRef<AttendProcedureOrderComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.dialogData = data;
  }

  ngOnInit(): void {
    this.store.dispatch(loadOrderTypes());
    this.orderTypes$ = this.store.select(getAllOrderTypes);
    this.observations$ = this.store.select(getGroupedObservationByConcept);
    this.savingObservations$ = this.store.pipe(
      select(getSavingObservationStatus)
    );

    this.billLoadingState$ = this.store.pipe(select(getLoadingBillStatus));
    this.currentBills$ = this.store.select(getAllBills);
    this.doesPatientHasPendingPaymentForTheCurrentVisitType$ = this.store.pipe(
      select(getActiveVisitPendingVisitServiceBillStatus)
    );

    this.provider$ = this.store.select(getProviderDetails);

    this.patient$ = this.store.pipe(select(getCurrentPatient));
    this.visit$ = this.store.select(getActiveVisit);
  }

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }

  onDone(event): void {
    this.dialogRef.close(event);
  }
}
