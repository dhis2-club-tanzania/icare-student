import { Component, Input, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { initiatePaymentTypes } from "src/app/store/actions/payment-type.actions";
import { AppState } from "src/app/store/reducers";
import { getAllPaymentTypes } from "src/app/store/selectors/payment-type.selectors";

@Component({
  selector: "app-lb-price-list-container",
  templateUrl: "./lb-price-list-container.component.html",
  styleUrls: ["./lb-price-list-container.component.scss"],
})
export class LbPriceListContainerComponent implements OnInit {
  @Input() paymentCategories: any[];
  paymentTypes$: Observable<any>;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(
      initiatePaymentTypes({ paymentCategories: this.paymentCategories })
    );
    this.paymentTypes$ = this.store.pipe(select(getAllPaymentTypes));
  }
}
