import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Store } from "@ngrx/store";
import { sortBy } from "lodash";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { saveObservations } from "src/app/store/actions/observation.actions";
import { AppState } from "src/app/store/reducers";
import { getCustomOpenMRSFormsByIds } from "src/app/store/selectors/form.selectors";
import { getGroupedObservationByDateAndTimeOfIPDRounds } from "src/app/store/selectors/observation.selectors";
import { FormService } from "../../modules/form/services/form.service";
import { Visit } from "../../resources/visits/models/visit.model";

@Component({
  selector: "app-shared-ipd-round-container",
  templateUrl: "./shared-ipd-round-container.component.html",
  styleUrls: ["./shared-ipd-round-container.component.scss"],
})
export class SharedIPDRoundContainerComponent implements OnInit {
  @Input() conceptUuid: string;
  @Input() activeVisit: Visit;
  @Input() location: any;
  @Input() observations: any[];
  observationsGroupedByIPDRounds$: Observable<any>;
  form$: Observable<any>;
  customForms$: Observable<any[]>;
  errors: any[] = [];
  latestRound$: Observable<any>;
  constructor(
    private store: Store<AppState>,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    // TODO: Visit Notes form to be softcoded
    this.customForms$ = this.store.select(
      getCustomOpenMRSFormsByIds(this.location?.forms || [])
    );
    // First create round zero provided when no any round has been made
    if (!this.observations[this.conceptUuid]) {
      const obs = [
        {
          concept: this.conceptUuid,
          value: 0,
          obsDatetime: new Date(),
          person: this.activeVisit?.patientUuid,
          location: this.location?.uuid,
          status: "PRELIMINARY",
        },
      ];
      this.store.dispatch(
        saveObservations({
          observations: obs,
          patientId: this.activeVisit?.patientUuid,
        })
      );
    }
    this.observationsGroupedByIPDRounds$ = this.store.select(
      getGroupedObservationByDateAndTimeOfIPDRounds(this.conceptUuid)
    );
  }
}
