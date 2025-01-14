import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { getBillingConceptUuid } from "src/app/core";
import { Location } from "src/app/core/models";
import { VisitObject } from "src/app/shared/resources/visits/models/visit-object.model";
import { VisitsService } from "src/app/shared/resources/visits/services";
import { AppState } from "src/app/store/reducers";
import { getBedsGroupedByTheCurrentLocationChildren } from "src/app/store/selectors";
import { getPatientVisitsForAdmissionAddedState } from "src/app/store/selectors/visit.selectors";

import { keyBy } from "lodash";

@Component({
  selector: "app-wards-list",
  templateUrl: "./wards-list.component.html",
  styleUrls: ["./wards-list.component.scss"],
})
export class WardsListComponent implements OnInit {
  @Input() currentLocation: Location;
  @Output() bedStatus = new EventEmitter<any>();
  @Input() locationBedsDetails: any;
  @Input() bedOrdersWithBillStatus: any[];
  @Input() locationsIds: string[];
  @Input() encounterType: string;
  wardsInfo$: Observable<Location[]>;
  admissionVisitsAdded$: Observable<boolean>;
  admittedPatientsVisits$: Observable<VisitObject[]>;

  constructor(
    private store: Store<AppState>,
    private visitService: VisitsService
  ) {}

  ngOnInit(): void {
    this.wardsInfo$ = this.store.select(
      getBedsGroupedByTheCurrentLocationChildren,
      {
        id: this.locationBedsDetails?.id,
      }
    );

    this.admittedPatientsVisits$ = this.visitService
      .getPatientsVisitsByEncounterType(this.encounterType)
      .pipe(
        map((response: any) => {
          return keyBy(response, "locationUuid");
        })
      );

    this.admissionVisitsAdded$ = this.store.select(
      getPatientVisitsForAdmissionAddedState
    );
  }

  onGetStatus(e, bed, visitData, bedOrdersWithBillStatus): void {
    e.stopPropagation();
    const billingConcept = getBillingConceptUuid(bed?.attributes);
    this.bedStatus.emit({
      ...{
        ...bed,
        billingConcept: billingConcept,
      },
      occupied: visitData ? true : false,
      visit: visitData,
      bedOrdersWithBillStatus,
    });
  }
}
