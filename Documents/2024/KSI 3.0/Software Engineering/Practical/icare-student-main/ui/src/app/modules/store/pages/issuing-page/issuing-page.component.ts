import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import {
  loadRequisitions,
} from "src/app/store/actions/requisition.actions";
import { AppState } from "src/app/store/reducers";
import {
  getCurrentLocation,
} from "src/app/store/selectors";

@Component({
  selector: "app-issuing-page",
  templateUrl: "./issuing-page.component.html",
  styleUrls: ["./issuing-page.component.scss"],
})
export class IssuingPageComponent implements OnInit {
  currentStore$: Observable<any>;
  constructor(
    private store: Store<AppState>,
  ){}

  ngOnInit() {
    this.currentStore$ = this.store.pipe(select(getCurrentLocation));
  }
}
