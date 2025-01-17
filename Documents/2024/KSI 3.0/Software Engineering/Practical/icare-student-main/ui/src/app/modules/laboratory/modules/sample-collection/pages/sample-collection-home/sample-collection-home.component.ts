import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { addCurrentPatient, go } from "src/app/store/actions";
import { loadPatientPayments } from "src/app/store/actions/payment.actions";
import { AppState } from "src/app/store/reducers";
import { getCurrentUserPrivileges } from "src/app/store/selectors/current-user.selectors";
import { getVisitLoadingState } from "src/app/store/selectors/visit.selectors";

@Component({
  selector: "app-sample-collection-home",
  templateUrl: "./sample-collection-home.component.html",
  styleUrls: ["./sample-collection-home.component.scss"],
})
export class SampleCollectionHomeComponent implements OnInit {
  loadingVisit$: Observable<boolean>;
  privileges$: Observable<any>;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.loadingVisit$ = this.store.pipe(select(getVisitLoadingState));

    this.privileges$ = this.store.select(getCurrentUserPrivileges);
    this.privileges$.subscribe((privileges) => {
      if (privileges) {
        if (
          !privileges["Sample Collection"] &&
          !privileges["Sample Tracking"] &&
          !privileges["Laboratory Reports"] &&
          !privileges["Sample Acceptance and Results"] &&
          !privileges["Tests Settings"] &&
          !privileges["Laboratory Orders"]
        ) {
          window.location.replace("../../../#/laboratory/no-lab-access");
        } else if (
          !privileges["Sample Collection"] &&
          privileges["Sample Tracking"] &&
          !privileges["Laboratory Reports"] &&
          !privileges["Sample Acceptance and Results"] &&
          !privileges["Tests Settings"] &&
          !privileges["Laboratory Orders"]
        ) {
          window.location.replace("../../../#/laboratory/sample-tracking");
        } else if (
          !privileges["Sample Collection"] &&
          !privileges["Sample Tracking"] &&
          privileges["Laboratory Reports"] &&
          !privileges["Sample Acceptance and Results"] &&
          !privileges["Tests Settings"] &&
          !privileges["Laboratory Orders"]
        ) {
          window.location.replace("../../../#/laboratory/reports/dashboard");
        } else if (
          !privileges["Sample Collection"] &&
          !privileges["Sample Tracking"] &&
          !privileges["Laboratory Reports"] &&
          privileges["Sample Acceptance and Results"] &&
          !privileges["Tests Settings"] &&
          !privileges["Laboratory Orders"]
        ) {
          window.location.replace(
            "../../../#/laboratory/sample-acceptance-and-results"
          );
        } else if (
          !privileges["Sample Collection"] &&
          !privileges["Sample Tracking"] &&
          !privileges["Laboratory Reports"] &&
          !privileges["Sample Acceptance and Results"] &&
          privileges["Tests Settings"] &&
          !privileges["Laboratory Orders"]
        ) {
          window.location.replace(
            "../../../#/laboratory/settings/tests-control"
          );
        } else if (
          !privileges["Sample Collection"] &&
          !privileges["Sample Tracking"] &&
          !privileges["Laboratory Reports"] &&
          !privileges["Sample Acceptance and Results"] &&
          !privileges["Tests Settings"] &&
          privileges["Laboratory Orders"]
        ) {
          window.location.replace(
            "../../../#/laboratory/lab-investigation-home"
          );
        }
      }
    }); // laboratory/settings/tests-control
  }

  onSelectPatient(patient) {
    this.store.dispatch(addCurrentPatient({ patient }));
    this.store.dispatch(
      go({
        path: [
          `/laboratory/sample-collection/${patient["patient"]["uuid"]}/${patient?.visitUuid}`,
        ],
      })
    );
  }
}
