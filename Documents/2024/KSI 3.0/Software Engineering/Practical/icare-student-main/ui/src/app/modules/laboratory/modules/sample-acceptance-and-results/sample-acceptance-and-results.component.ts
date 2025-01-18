import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/reducers";
import { getVisitsParameters } from "src/app/store/selectors";

@Component({
  selector: "app-sample-acceptance-and-results",
  templateUrl: "./sample-acceptance-and-results.component.html",
  styleUrls: ["./sample-acceptance-and-results.component.scss"],
})
export class SampleAcceptanceAndResultsComponent implements OnInit {
  visitsParameters$: Observable<any>;
  constructor(private store: Store<AppState>) {
    this.visitsParameters$ = this.store.select(getVisitsParameters);
  }

  ngOnInit(): void {}
}
