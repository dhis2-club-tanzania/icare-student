import { Component, Input, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { getVitalsFromVisitDetails } from "src/app/core";
import { AppState } from "src/app/store/reducers";
import {
  getGroupedObservationByConcept,
  getVitalSignObservations,
} from "src/app/store/selectors/observation.selectors";
import { getVisitLoadingState } from "src/app/store/selectors/visit.selectors";

@Component({
  selector: "app-patient-vitals-summary",
  templateUrl: "./patient-vitals-summary.component.html",
  styleUrls: ["./patient-vitals-summary.component.scss"],
})
export class PatientVitalsSummaryComponent implements OnInit {
  @Input() patientVisit: any;
  @Input() vitalsForm: any;
  observationsGroupedByConcept$: Observable<any>;
  loadingVisit$: Observable<boolean>;
  vitalSignObservations$: Observable<any>;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    const observations = !this.patientVisit
      ? null
      : this.patientVisit?.observations;
    const vitalsData = !this.patientVisit
      ? null
      : getVitalsFromVisitDetails(this.vitalsForm, observations);

    this.vitalSignObservations$ = !this.patientVisit
      ? this.store.select(getVitalSignObservations)
      : of(vitalsData);
    this.observationsGroupedByConcept$ = this.store.select(
      getGroupedObservationByConcept
    );

    this.loadingVisit$ = this.store.pipe(select(getVisitLoadingState));
  }
}
