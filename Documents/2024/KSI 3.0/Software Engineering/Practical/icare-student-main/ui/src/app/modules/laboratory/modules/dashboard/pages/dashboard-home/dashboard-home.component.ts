import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { AppState } from "src/app/store/reducers";
import { getVisitsParameters } from "src/app/store/selectors";

@Component({
  selector: "app-dashboard-home",
  templateUrl: "./dashboard-home.component.html",
  styleUrls: ["./dashboard-home.component.scss"],
})
export class DashboardHomeComponent implements OnInit {
  datesParameters$: Observable<any>;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.datesParameters$ = this.store.select(getVisitsParameters);
  }
}
