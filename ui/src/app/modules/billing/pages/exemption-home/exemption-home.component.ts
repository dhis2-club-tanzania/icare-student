import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Observable, of, Subject } from "rxjs";
import { catchError, takeUntil, tap } from "rxjs/operators";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { TableColumn } from "src/app/shared/models/table-column.model";
import { TableConfig } from "src/app/shared/models/table-config.model";
import { Api } from "src/app/shared/resources/openmrs";
import { Visit, VisitExt } from "src/app/shared/resources/visits/models/visit.model";
import { VisitsService } from "../../../../shared/resources/visits/services";
import { AppState } from "src/app/store/reducers";
import { getCurrentLocation } from "src/app/store/selectors";
import { clearCurrentPatient, go } from "src/app/store/actions";
import { clearActiveVisit } from "src/app/store/actions/visit.actions";

@Component({
  selector: "app-exemption-home",
  templateUrl: "./exemption-home.component.html",
  styleUrls: ["./exemption-home.component.scss"],
})
export class ExemptionHomeComponent implements OnInit, OnDestroy {
  visitsWithBilling$: Observable<MatTableDataSource<Visit>>;
  visits$: Observable<MatTableDataSource<VisitExt>>;
  billingColumns: TableColumn[];
  tableConfig: TableConfig;
  orderType$: Observable<any>;
  currentLocation$: Observable<any>;

  orderType: any;
  orderByDirection: string = "ASC";
  orderBy: string = "ENCOUNTER";
  filterBy: string = "";
  currentLocation: any;
  visitsLength: number = 0;

  loading: boolean = false;
  loadingVisits: boolean = false;
  loadingVisitsError: string;

  private exemptionTypes = ["Full", "Partial"];
  private additionalCriteria = ["Student", "Loan", "Other"];
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private api: Api,
    private router: Router,
    private visitService: VisitsService,
    private systemSettingsService: SystemSettingsService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.initializeTableConfig();
    this.setupSubscriptions();
    this.getExemptionVisits();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private getItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }


  private addMockDataToVisit(visit: any): any {
    return {
      ...visit,
      exemptionType: this.getItem(this.exemptionTypes),
      exemptionCriteria: this.determineExemptionCriteria(visit.patientAge),
    };
  }

  private initializeTableConfig(): void {
    this.billingColumns = [
      { id: "index", label: "#" },
      { id: "patientName", label: "Name" },
      { id: "patientGender", label: "Gender" },
      { id: "locationName", label: "Location" },
      { id: "patientAge", label: "Age" },
      { id: "exemptionType", label: "Exemption Type" },
      { id: "exemptionCriteria", label: "Exemption Criteria" },
    ];

    this.tableConfig = new TableConfig({
      noDataLabel: "No bills at the moment",
     
    });
  }

  private setupSubscriptions(): void {
    this.currentLocation$ = this.store.pipe(select(getCurrentLocation(false)));
    this.currentLocation$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (location) => (this.currentLocation = location),
        error: (error) => console.error("Error getting current location:", error),
      });

    this.visitsWithBilling$ = Visit.getVisitWithBillingOrders(this.api).pipe(
      tap(() => (this.loadingVisits = false)),
      catchError((error) => {
        this.loadingVisits = false;
        this.loadingVisitsError = error;
        return of(new MatTableDataSource([]));
      })
    );
  }

  private determineExemptionCriteria(age: number): string {
    if (age < 5) {
      return "Under 5"; // Children under 5
    } else if (age >= 60) {
      return "Elderly"; // Seniors aged 60 and above
    } else if (age >= 18 && age <= 25) {
      return "Student"; // Students (assumed age range: 18-25)
    } else {
      return this.getItem(this.additionalCriteria); // Default additional criteria
    }
  }
  
  private transformVisitData(visit: any, index: number): any {
    const patientAge = visit.patient?.age || visit.patientAge || 0; // Ensure age is a number
  
    return {
      ...visit,
      index: index + 1,
      exemptionType: visit.exemptionType || this.getItem(this.exemptionTypes),
      exemptionCriteria: visit.exemptionCriteria || this.determineExemptionCriteria(patientAge), // Use refined criteria
      patientName: visit.patient?.name || visit.patientName || "Unknown",
      patientGender: visit.patient?.gender || visit.patientGender || "Unknown",
      patientAge: patientAge, // Explicitly use extracted age
      locationName: visit.location?.name || visit.locationName || "Unknown",
    };
  }
  

  getExemptionVisits(): void {
    this.loading = true;
    this.orderType$ = this.systemSettingsService
      .getSystemSettingsMatchingAKey("icare.billing.exemption.orderType")
      .pipe(
        catchError((error) => {
          console.error("Error getting orderType:", error);
          return of([]);
        })
      );

    this.orderType$.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (orderType) => {
        this.orderType = orderType[0];
        this.visitService
          .getAllVisits(
            null,
            false,
            false,
            null,
            0,
            10,
            this.orderType?.value,
            null,
            null,
            this.orderBy,
            this.orderByDirection,
            this.filterBy
          )
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: (visits) => {
              const transformedVisits = visits.map((visit, index) =>
                this.transformVisitData(visit, index)
              );
              this.visits$ = of(new MatTableDataSource(transformedVisits));
              this.visitsLength = transformedVisits.length;
              this.loading = false;
            },
            error: (error) => {
              console.error("Error fetching visits:", error);
              this.visits$ = of(new MatTableDataSource([]));
              this.visitsLength = 0;
              this.loading = false;
            },
          });
      },
      error: (error) => {
        console.error("Error in orderType subscription:", error);
        this.loading = false;
      },
    });
  }

  onSelectVisit(visit: any): void {
    this.store.dispatch(clearCurrentPatient());
    this.store.dispatch(clearActiveVisit());
    this.loading = true;
    this.store.dispatch(go({ path: [`/billing/${visit?.patientUuid}/exempt`] }));
  }
}
