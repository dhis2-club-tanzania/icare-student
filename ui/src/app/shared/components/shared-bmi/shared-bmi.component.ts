import { Component, EventEmitter, OnInit, Output, Input } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, zip } from "rxjs";
import { map } from "rxjs/operators";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { AppState } from "src/app/store/reducers";
import { getCurrentUserDetails } from "src/app/store/selectors/current-user.selectors";
import { getGroupedObservationByConcept } from "src/app/store/selectors/observation.selectors";

@Component({
  selector: "app-shared-bmi",
  templateUrl: "./shared-bmi.component.html",
  styleUrls: ["./shared-bmi.component.scss"],
})
export class SharedBmiComponent implements OnInit {
  observations$: Observable<any>;
  weightConcept$: Observable<any>;
  heightConcept$: Observable<any>;
  bmi$: Observable<any>;

  /**
   * This component needs to get two observations meaning Weight and Height values so that BMI can be calculated.
   * Hence call selector to get all obervations that are keyed by uuids of vitals concepts
   */

  constructor(
    private store: Store<AppState>,
    private systemSettingsService: SystemSettingsService
  ) {
    this.observations$ = this.store.select(getGroupedObservationByConcept);
    this.heightConcept$ = this.systemSettingsService.getSystemSettingsByKey(
      "iCare.vitals.height"
    );
    this.weightConcept$ = this.systemSettingsService.getSystemSettingsByKey(
      "iCare.vitals.weight"
    );

    this.bmi$ = zip(
      this.observations$,
      this.heightConcept$,
      this.weightConcept$
    ).pipe(
      map((res) => {
        let observations = res[0];
        let heightUuid = res[1];
        let weightUuid = res[2];
        return (
          Math.round(
            (observations[weightUuid]?.latest?.value /
              (observations[heightUuid]?.latest?.value *
                0.01 *
                observations[heightUuid]?.latest?.value *
                0.01)) *
              10
          ) / 10
        );
      })
    );
  }

  ngOnInit() {}
}
