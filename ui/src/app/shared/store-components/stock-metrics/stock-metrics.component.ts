import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { loadStockMetrics } from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import { getMetrics } from "src/app/store/selectors";

@Component({
  selector: "app-stock-metrics",
  templateUrl: "./stock-metrics.component.html",
  styleUrls: ["./stock-metrics.component.scss"],
})
export class StockMetricsComponent implements OnInit {
  @Input() currentStore: any;
  @Input() currentStorePage: any;
  @Output() changeRoute: EventEmitter<any> = new EventEmitter();

  stockMetrics$: Observable<any>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(loadStockMetrics());
    this.stockMetrics$ = this.store.select(getMetrics);
  }

  onChangeRoute(e: Event, url: string, currentStorePage: any) {
    this.changeRoute.emit({
      e: e,
      url: url,
      currentStorePage: currentStorePage,
    });
  }
}
