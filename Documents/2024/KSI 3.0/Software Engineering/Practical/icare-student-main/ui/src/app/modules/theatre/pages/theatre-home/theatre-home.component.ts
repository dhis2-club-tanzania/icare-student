import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { go } from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import { getVisitLoadingState } from "src/app/store/selectors/visit.selectors";

@Component({
  selector: "app-theatre-home",
  templateUrl: "./theatre-home.component.html",
  styleUrls: ["./theatre-home.component.scss"],
})
export class TheatreHomeComponent implements OnInit {
  loadingVisit$: Observable<boolean>;
  isPatientListTabular: boolean = true;
  constructor(private store: Store<AppState>, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.isPatientListTabular = this.route.snapshot.queryParams["list"]
      ? true
      : false;
    this.loadingVisit$ = this.store.pipe(select(getVisitLoadingState));
  }

  onSelectPatient(patient): any {
    this.store.dispatch(
      go({ path: ["/theatre/patient-theatre/" + patient?.patient?.uuid] })
    );
  }
}
