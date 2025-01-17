import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Store } from "@ngrx/store";
import { keyBy } from "lodash";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Location } from "src/app/core/models";
import { VisitObject } from "src/app/shared/resources/visits/models/visit-object.model";
import { VisitsService } from "src/app/shared/resources/visits/services";
import { AppState } from "src/app/store/reducers";
import { getCabinetsGroupedByTheCurrentLocationChildren } from "src/app/store/selectors";

@Component({
  selector: "app-cabinets-list",
  templateUrl: "./cabinets-list.component.html",
  styleUrls: ["./cabinets-list.component.scss"],
})
export class CabinetsListComponent implements OnInit {
  @Input() currentLocation: Location;
  @Output() cabinetStatus = new EventEmitter<any>();
  @Input() cabinets: any;
  @Input() locationsIds: string[];
  @Input() encounterType: string;
  cabinetsInfo$: Observable<Location[]>;
  diedPatientsVisits$: Observable<VisitObject[]>;

  constructor(
    private store: Store<AppState>,
    private visitService: VisitsService
  ) {}

  ngOnInit(): void {
    this.cabinetsInfo$ = this.store.select(
      getCabinetsGroupedByTheCurrentLocationChildren,
      {
        id: this.currentLocation?.id,
      }
    );

    this.diedPatientsVisits$ = this.visitService
      .getPatientsVisitsByEncounterType(this.encounterType)
      .pipe(
        map((response: any) => {
          return keyBy(response, "locationUuid");
        })
      );
  }

  onGetStatus(e: Event, cabinet: Location, visit: any): void {
    e.stopPropagation();
    this.cabinetStatus.emit({
      ...cabinet,
      visit,
    });
  }
}
