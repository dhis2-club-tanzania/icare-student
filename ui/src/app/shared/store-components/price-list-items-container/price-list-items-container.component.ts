import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs";
import { initiatePaymentTypes } from "src/app/store/actions/payment-type.actions";
import { AppState } from "src/app/store/reducers";
import { getAllPaymentTypes } from "src/app/store/selectors/payment-type.selectors";

@Component({
  selector: "app-price-list-items-container",
  templateUrl: "./price-list-items-container.component.html",
  styleUrls: ["./price-list-items-container.component.scss"],
})
export class PriceListItemsContainerComponent implements OnInit {
  @Input() paymentCategories: any[];
  @Input() departmentId: string;
  @Input() hideDepartmentsSelection: boolean;
  currentDepartmentId: string;
  paymentTypes$: Observable<any[]>;
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
      this.currentDepartmentId = changes?.departmentId?.currentValue;
      this.paymentTypes$ = this.store.pipe(select(getAllPaymentTypes));
    }
  }
}
