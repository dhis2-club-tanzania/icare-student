import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { TableColumn } from "src/app/shared/models/table-column.model";
import { TableConfig } from "src/app/shared/models/table-config.model";
import { Api } from "src/app/shared/resources/openmrs";
import {
  Visit,
  VisitExt,
} from "src/app/shared/resources/visits/models/visit.model";

import { VisitsService } from "../../../../shared/resources/visits/services";
import { AppState } from "src/app/store/reducers";
import { getCurrentLocation } from "src/app/store/selectors";
import {
  clearCurrentPatient,
  go,
  loadCurrentPatient,
} from "src/app/store/actions";
import { clearActiveVisit } from "src/app/store/actions/visit.actions";

@Component({
  selector: "app-exemption-home",
  templateUrl: "./exemption-home.component.html",
  styleUrls: ["./exemption-home.component.scss"],
})
export class ExemptionHomeComponent implements OnInit {
  visitsWithBiling$: Observable<MatTableDataSource<Visit>>;
  billingColumns: TableColumn[];
  loadingVisits: boolean;
  loadingVisitsError: string;
  tableConfig: TableConfig;
  orderType$: Observable<any>;
  currentLocation$: Observable<any>;
  orderType: any;
  orderByDirection: any;
  orderBy: any;
  filterBy: any;
  currentLocation: any;
  loadingPatients: boolean;
  visits$: any;
  visitsLength: number;
  loading: boolean;

  constructor(
    private api: Api,
    private router: Router,
    private visitService: VisitsService,
    private systemSettingsService: SystemSettingsService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.billingColumns = [
      {
        id: "index",
        label: "#",
      },
      {
        id: "patientName",
        label: "Name",
      },
      {
        id: "patientGender",
        label: "Gender",
      },
      {
        id: "locationName",
        label: "Location",
      },
      {
        id: "patientAge",
        label: "Age",
      },
    ];
    this.tableConfig = new TableConfig({
      noDataLabel: "No bills at the moment",
    });
    this.loadingVisits = true;
    this.visitsWithBiling$ = Visit.getVisitWithBillingOrders(this.api).pipe(
      tap(() => {
        this.loadingVisits = false;
      }),
      catchError((error) => {
        this.loadingVisits = false;
        this.loadingVisitsError = error;
        return of(new MatTableDataSource([]));
      })
    );

    this.currentLocation$ = this.store.pipe(select(getCurrentLocation(false)));

    //Get current location
    this.currentLocation$.subscribe({
      next: (currentLocation) => {
        this.currentLocation = currentLocation;
      },
      error: (error) => {
        console.log(
          "Error occured while trying to get current location: ",
          error
        );
      },
    });

    this.getExemptionVisits();
  }

  getVisits(orderType) {
    return this.visitService
      .getAllVisits(
        null,
        false,
        false,
        null,
        0,
        10,
        orderType?.value,
        null,
        null,
        this.orderBy ? this.orderBy : "ENCOUNTER",
        this.orderByDirection ? this.orderByDirection : "ASC",
        this.filterBy ? this.filterBy : ""
      )
      .pipe(
        tap(() => {
          this.loadingVisits = false;
        })
      );
  }

  getExemptionVisits() {
    //Get order type
    this.orderType$ = this.systemSettingsService
      .getSystemSettingsMatchingAKey("icare.billing.exemption.orderType")
      .pipe(
        tap((orderType) => {
          return orderType[0];
        }),
        catchError((error) => {
          console.log("Error occured while trying to get orderType: ", error);
          return of(new MatTableDataSource([]));
        })
      );

    this.orderType$.subscribe({
      next: (orderType) => {
        this.orderType = orderType[0];

        this.getVisits(this.orderType).subscribe({
          next: (visits) => {
            this.visits$ = of(
              new MatTableDataSource(visits.map((visit) => new VisitExt(visit)))
            );
            this.visitsLength = visits.length;
          },
        });
      },
    });
  }

  onSelectVisit(visit: any): void {
    this.store.dispatch(clearCurrentPatient());
    this.store.dispatch(clearActiveVisit());
    this.loading = true;
    this.store.dispatch(
      go({ path: [`/billing/${visit?.patientUuid}/exempt`] })
    );
  }
}
