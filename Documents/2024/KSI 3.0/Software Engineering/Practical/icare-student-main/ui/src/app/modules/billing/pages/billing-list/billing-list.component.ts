import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { TableColumn } from "src/app/shared/models/table-column.model";
import { TableConfig } from "src/app/shared/models/table-config.model";
import { Api } from "src/app/shared/resources/openmrs";
import { Visit } from "src/app/shared/resources/visits/models/visit.model";
import {
  go,
  loadCurrentPatient,
  loadLoginLocations,
} from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import { getSettingCurrentLocationStatus } from "src/app/store/selectors";

@Component({
  selector: "app-billing-list",
  templateUrl: "./billing-list.component.html",
  styleUrls: ["./billing-list.component.scss"],
})
export class BillingListComponent implements OnInit {
  visitsWithBiling$: Observable<MatTableDataSource<Visit>>;
  billingColumns: TableColumn[];
  loadingVisits: boolean;
  loadingVisitsError: string;
  tableConfig: TableConfig;
  settingCurrentLocationStatus$: Observable<boolean>;

  constructor(
    private api: Api,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.settingCurrentLocationStatus$ = this.store.select(
      getSettingCurrentLocationStatus
    );
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
  }

  onSelectPatient(patient) {
    this.store.dispatch(
      loadCurrentPatient({
        uuid: patient?.patient?.uuid,
        isRegistrationPage: false,
      })
    );
    this.store.dispatch(
      go({ path: [`/billing/${patient?.patient?.uuid}/bills`] })
    );
  }
}
