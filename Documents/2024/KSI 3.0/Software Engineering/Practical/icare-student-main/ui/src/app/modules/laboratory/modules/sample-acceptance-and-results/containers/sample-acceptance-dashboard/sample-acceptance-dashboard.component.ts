import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/reducers";
import {
  addLabDepartments,
  loadLabSamplesByCollectionDates,
} from "src/app/store/actions";
import {
  getCodedSampleRejectionReassons,
  getFormattedLabSamplesLoadedState,
  getLabConfigurations,
} from "src/app/store/selectors";
import {
  getCurrentUserDetails,
  getCurrentUserPrivileges,
} from "src/app/store/selectors/current-user.selectors";
@Component({
  selector: "app-sample-acceptance-dashboard",
  templateUrl: "./sample-acceptance-dashboard.component.html",
  styleUrls: ["./sample-acceptance-dashboard.component.scss"],
})
export class SampleAcceptanceDashboardComponent implements OnInit {
  @Input() datesParameters: any;
  @Input() patients: any;
  @Input() sampleTypes: any;
  @Input() labSamplesDepartments: any;
  @Input() labSamplesContainers: any;
  @Input() configs: any;
  @Input() codedSampleRejectionReasons: any;
  @Input() LISConfigurations: any;
  labConfigs$: Observable<any>;
  privileges$: Observable<any>;
  codedSampleRejectionReasons$: Observable<any[]>;
  samplesLoadedState$: Observable<any>;
  currentUser$: Observable<any>;

  page: number = 1;
  pageCount: number = 100;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.currentUser$ = this.store.select(getCurrentUserDetails);
    // console.log("Acceptance", this.datesParameters, this.labSamplesDepartments);
    this.store.dispatch(
      addLabDepartments({ labDepartments: this.labSamplesDepartments })
    );

    this.codedSampleRejectionReasons$ = this.store.select(
      getCodedSampleRejectionReassons
    );

    this.labConfigs$ = this.store.select(getLabConfigurations);

    this.privileges$ = this.store.select(getCurrentUserPrivileges);

    this.samplesLoadedState$ = this.store.select(
      getFormattedLabSamplesLoadedState
    );
  }
}
