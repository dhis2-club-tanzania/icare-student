import { Component, Input, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { saveObservations } from "src/app/store/actions/observation.actions";
import { AppState } from "src/app/store/reducers";
import { getCustomOpenMRSFormsByIds } from "src/app/store/selectors/form.selectors";
import { getGroupedObservationByDateAndTimeOfIPDRounds } from "src/app/store/selectors/observation.selectors";
import { FormService } from "../../modules/form/services/form.service";
import { Visit } from "../../resources/visits/models/visit.model";
import { VisitsService } from "../../resources/visits/services";

@Component({
  selector: "app-shared-visit-history-summary",
  templateUrl: "./shared-visit-history-summary.component.html",
  styleUrls: ["./shared-visit-history-summary.component.scss"],
})
export class SharedVisitHistorySummaryComponent implements OnInit {
  @Input() activeVisit: Visit;
  @Input() location: any;
  observations$: Observable<any>;
  customForms$: Observable<any[]>;
  observationChartForm$: Observable<any>;
  errors: any[] = [];
  constructor(
    private store: Store<AppState>,
    private visitService: VisitsService,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    // TODO: Visit Notes form to be softcoded
    this.customForms$ = this.store.select(
      getCustomOpenMRSFormsByIds(this.location?.forms || [])
    );

    // TODO: Find a way to softcode this
    this.observationChartForm$ = this.formService.getCustomeOpenMRSForm(
      "2a7d282f-a97a-4618-9515-9c0028d575d8"
    );
    // First create round zero provided when no any round has been made

    this.observations$ = this.visitService.getVisitObservationsByVisitUuid({
      uuid: this.activeVisit?.uuid,
      query: {
        v: "custom:(encounters:(uuid,obs,encounterProviders))",
      },
    });
  }
}
