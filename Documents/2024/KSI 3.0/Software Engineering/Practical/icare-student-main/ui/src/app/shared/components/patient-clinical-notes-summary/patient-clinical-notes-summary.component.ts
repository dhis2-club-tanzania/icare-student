import { Component, Input, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { AppState } from "src/app/store/reducers";
import { getGroupedObservationByConcept } from "src/app/store/selectors/observation.selectors";
import { groupObservationByConcept } from "../../helpers/observations.helpers";
import { VisitObject } from "../../resources/visits/models/visit-object.model";
import { Visit } from "../../resources/visits/models/visit.model";

@Component({
  selector: "app-patient-clinical-notes-summary",
  templateUrl: "./patient-clinical-notes-summary.component.html",
  styleUrls: ["./patient-clinical-notes-summary.component.scss"],
})
export class PatientClinicalNotesSummaryComponent implements OnInit {
  @Input() patientVisit: VisitObject;
  @Input() forms: any[];
  @Input() forHistory: boolean;
  observations$: Observable<any>;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.observations$ = !this.forHistory
      ? this.store.pipe(select(getGroupedObservationByConcept))
      : of(groupObservationByConcept(this.patientVisit?.observations));
  }
}
