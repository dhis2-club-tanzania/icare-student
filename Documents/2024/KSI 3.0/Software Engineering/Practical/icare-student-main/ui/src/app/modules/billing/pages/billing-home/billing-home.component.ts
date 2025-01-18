import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  PaymentType,
  PaymentTypeInterface,
} from 'src/app/shared/models/payment-type.model';
import { Patient } from 'src/app/shared/resources/patient/models/patient.model';
import { confirmPatientBill } from 'src/app/store/actions/bill.actions';
import { AppState } from 'src/app/store/reducers';
import {
  getLoadingBillStatus,
  getPatientBills,
} from 'src/app/store/selectors/bill.selectors';
import { getCurrentPatient } from 'src/app/store/selectors/current-patient.selectors';
import { getCurrentUserDetails } from 'src/app/store/selectors/current-user.selectors';
import { getAllPaymentTypes } from 'src/app/store/selectors/payment-type.selectors';
import {
  getAllPayments,
  getLoadingPaymentStatus,
} from 'src/app/store/selectors/payment.selector';
import { getAllPendingBills } from 'src/app/store/selectors/pending-bill.selectors';
import { upsertPatientBillItems } from '../../../../store/actions/bill-item.actions';
import { BillItemObject } from '../../models/bill-item-object.model';
import { BillObject } from '../../models/bill-object.model';
import { PaymentInput } from '../../models/payment-input.model';
import { PaymentObject } from '../../models/payment-object.model';

@Component({
  selector: 'app-billing-home',
  templateUrl: './billing-home.component.html',
  styleUrls: ['./billing-home.component.scss'],
})
export class BillingHomeComponent implements OnInit {
  currentPatient$: Observable<Patient>;
  patientDetails: any;
  quoteToShow: boolean;
  bills$: Observable<BillObject[]>;
  pendingBills$: Observable<BillObject[]>;
  loadingBills$: Observable<boolean>;
  loadingPayments$: Observable<boolean>;

  payments$: Observable<PaymentObject[]>;
  paymentTypes$: Observable<PaymentTypeInterface[]>;

  currentUser$: Observable<any>;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.currentPatient$ = this.store.pipe(select(getCurrentPatient));

    this.bills$ = this.store.pipe(select(getPatientBills));
    this.pendingBills$ = this.store.pipe(select(getAllPendingBills));
    this.loadingBills$ = this.store.pipe(select(getLoadingBillStatus));

    this.payments$ = this.store.pipe(select(getAllPayments));
    this.loadingPayments$ = this.store.pipe(select(getLoadingPaymentStatus));

    this.paymentTypes$ = this.store.pipe(select(getAllPaymentTypes));

    this.currentUser$ = this.store.pipe(select(getCurrentUserDetails));
  }

  onUpdateBillItems(billItems: BillItemObject[]): void {
    this.store.dispatch(upsertPatientBillItems({ billItems }));
  }

  onSelectPatient(e) {}

  onConfirmBillPayment(results: {
    bill: BillObject;
    paymentInput: PaymentInput;
  }): void {
    if (results) {
      const { bill, paymentInput } = results;
      this.store.dispatch(confirmPatientBill({ bill, paymentInput }));
    }
  }
}
