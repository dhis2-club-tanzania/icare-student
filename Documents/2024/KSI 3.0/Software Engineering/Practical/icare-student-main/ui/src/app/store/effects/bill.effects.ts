import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { find } from "lodash";
import { of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { addCurrentPatient } from "src/app/store/actions";
import { PaymentReceiptComponent } from "../../modules/billing/components/payment-reciept/payment-reciept.component";
import { BillItemObject } from "../../modules/billing/models/bill-item-object.model";
import { BillItem } from "../../modules/billing/models/bill-item.model";
import { BillObject } from "../../modules/billing/models/bill-object.model";
import { Bill } from "../../modules/billing/models/bill.model";
import { Discount } from "../../modules/billing/models/discount.model";
import { Payment } from "../../modules/billing/models/payment.model";
import { BillingService } from "../../modules/billing/services/billing.service";
import { upsertPatientBillItems } from "../actions/bill-item.actions";
import {
  confirmPatientBill,
  confirmPatientBillFail,
  confirmPatientBillSuccess,
  discountBill,
  discountBillFail,
  discountPatientBillSuccess,
  loadPatientBillFail,
  loadPatientBills,
  showPaymentReceipt,
  upsertPatientBills,
  upsertPatientPendingBill,
} from "../actions/bill.actions";
import { upsertPatientPayments } from "../actions/payment.actions";

@Injectable()
export class BillEffects {
  addCurrentPatient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addCurrentPatient),
      map(({ patient, isRegistrationPage }) =>
        loadPatientBills({ patientUuid: patient.id, isRegistrationPage })
      )
    )
  );

  loadPatientBills$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPatientBills),
      switchMap(({ patientUuid, isRegistrationPage }) => {
        return this.billingService
          .getPatientBills(patientUuid, isRegistrationPage)
          .pipe(
            switchMap((billResults: Bill[]) => {
              let bills: BillObject[] = [];
              let billItems: BillItemObject[] = [];
              (billResults || []).forEach((bill) => {
                bills = [...bills, bill?.toJson()];

                billItems = [
                  ...billItems,
                  ...(bill.items || []).map((billItem) => billItem.toJson()),
                ];
              });

              return [
                upsertPatientBills({ bills }),
                upsertPatientBillItems({ billItems }),
              ];
            }),
            catchError((error) => of(loadPatientBillFail({ error })))
          );
      })
    )
  );

  confirmBill$ = createEffect(() =>
    this.actions$.pipe(
      ofType(confirmPatientBill),
      switchMap(({ bill, paymentInput }) =>
        this.billingService.payBill(bill, paymentInput).pipe(
          switchMap((billPaymentResult: Payment) => {
            const billItems = (paymentInput?.items || []).map((item) => {
              const itemObject = item.toJson();

              return new BillItem(
                {
                  ...itemObject,
                  confirmed: (paymentInput.confirmedItems || []).some(
                    (confirmedItem) => confirmedItem?.id === itemObject?.id
                  ),
                },
                bill.id
              );
            });

            if (billPaymentResult.status === "PENDING") {
              const newPendingBill = new Bill({
                ...bill,
                items: paymentInput.confirmedItems,
              });
              return [
                upsertPatientPendingBill({ bill: newPendingBill }),
                showPaymentReceipt({
                  receiptData: paymentInput.confirmedItems,
                  paymentType: billPaymentResult?.paymentType,
                }),
                confirmPatientBillSuccess({
                  bill: { ...bill, items: billItems },
                  status: billPaymentResult.status,
                }),
              ];
            }
            return [
              showPaymentReceipt({
                receiptData: bill.items,
                paymentType: billPaymentResult?.paymentType,
              }),
              confirmPatientBillSuccess({
                bill,
                status: billPaymentResult.status,
              }),
              upsertPatientPayments({ payments: [billPaymentResult.toJson()] }),
            ];
          }),
          catchError(({ error }) => of(confirmPatientBillFail({ bill, error })))
        )
      )
    )
  );

  showPaymentReceipt$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(showPaymentReceipt),
        tap(({ receiptData }) => {
          this.dialog.open(PaymentReceiptComponent, {
            data: { receiptData },
            width: "40%",
            panelClass: "custom-dialog-container",
          });
        })
      ),
    { dispatch: false }
  );

  discountBill$ = createEffect(() =>
    this.actions$.pipe(
      ofType(discountBill),
      switchMap(({ discountDetails, bill }) => {
        return this.billingService.discountBill(discountDetails).pipe(
          map((discount: Discount) => {
            const newBill = new Bill({
              ...bill,
              items: bill.items.map((item) => {
                const discountedItem = find(discount?.items, ["id", item.id]);
                return new BillItem(
                  {
                    ...item.toJson(),
                    discount: discountedItem?.discount || item.discount,
                  },
                  bill.id
                );
              }),
            });

            return discountPatientBillSuccess({ bill });
          }),
          catchError((error) => of(discountBillFail({ error, bill })))
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private billingService: BillingService,
    private dialog: MatDialog
  ) {}
}
