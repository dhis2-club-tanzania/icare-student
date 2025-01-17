import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { PaymentTypeInterface } from "src/app/shared/models/payment-type.model";
import { initiatePaymentTypes } from "src/app/store/actions/payment-type.actions";
import { AppState } from "src/app/store/reducers";
import { getAllPaymentTypes } from "src/app/store/selectors/payment-type.selectors";

@Component({
  selector: "app-price-list-container",
  templateUrl: "./price-list-container.component.html",
  styleUrls: ["./price-list-container.component.scss"],
})
export class PriceListContainerComponent implements OnInit, OnChanges {
  @Input() paymentCategories: any[];
  @Input() departmentId: string;
  currentDepartmentId: string;
  paymentTypes$: Observable<PaymentTypeInterface[]>;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.currentDepartmentId = this.departmentId;
    this.store.dispatch(
      initiatePaymentTypes({ paymentCategories: this.paymentCategories })
    );

    this.paymentTypes$ = this.store.pipe(select(getAllPaymentTypes));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes?.departmentId?.firstChange) {
      this.store.dispatch(
        initiatePaymentTypes({ paymentCategories: this.paymentCategories })
      );
      this.currentDepartmentId = changes?.departmentId?.currentValue
      this.paymentTypes$ = this.store.pipe(select(getAllPaymentTypes));
    }
  }
}
