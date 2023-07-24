import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { map, tap } from "rxjs/operators";
import { AppState } from "src/app/store/reducers";
import { Patient } from "../../resources/patient/models/patient.model";
import { Visit } from "../../resources/visits/models/visit.model";
import { Appointment } from "../../resources/appointment/models/appointment.model";
import { VisitsService } from "../../resources/visits/services";
import { AppointmentService } from "../../resources/appointment/services/appointment.service";

import { uniq } from "lodash";
import {
  clearActiveVisit,
  upsertAdmittedPatientLocation,
} from "src/app/store/actions/visit.actions";
import { ActivatedRoute, Router } from "@angular/router";
import { clearBills } from "src/app/store/actions/bill.actions";
import { clearBillItems } from "src/app/store/actions/bill-item.actions";
import { PatientListDialogComponent } from "../../dialogs";
import { MatDialog } from "@angular/material/dialog";
import { addCurrentPatient, go } from "src/app/store/actions";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { Api } from '../../resources/openmrs'
@Component({
  selector: 'app-appointments-list-table',
  templateUrl: './appointments-list-table.component.html',
  styleUrls: ['./appointments-list-table.component.scss']
})
export class AppointmentsListTableComponent implements OnInit {

  
 @Input() currentLocation: any;
  @Input() isTabularList: boolean;
  @Input() visits: Visit[];
  @Input() shouldShowParentLocation: boolean;
  @Input() service: string;
  @Input() itemsPerPage: number;
  @Input() isRegistrationPage: boolean;
  @Input() defaultFilter: string;
  @Input() orderType: string;
  @Input() orderStatus: string;
  @Input() orderStatusCode: string;
  @Input() filterCategory: string;
  @Input() orderBy: string;
  @Input() orderByDirection: string;
  @Input() doNotUseLocation: boolean;
  @Input() encounterType: string;

  page: number = 0;
  appointments$: Observable<Appointment[]>;
  filteredVisits$: Observable<Visit[]>;
  searchTerm: string;
  loadingPatients: boolean;
  locationsUuids: string[] = [];
  paymentTypeSelected: string;

  filters$: Observable<any[]>;

  @Output() selectAppointment = new EventEmitter<any>();
  visitAttributeType: any;
  paymentType: any;
  filterBy: any;
  startingIndex: number = 0;
  errors: any[] = [];
  constructor(
    private appointmentService: AppointmentService,
    private api: Api,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private systemSettingsService: SystemSettingsService
  ) {}

  ngOnChanges() {}

  ngOnInit() {
    this.filters$ = this.systemSettingsService
      .getSystemSettingsMatchingAKey(
        "iCare.filters." + (this.filterCategory ? this.filterCategory : "")
      )
      .pipe(
        tap((response: any) => {
          this.loadingPatients = false;
          if (response?.error) {
            this.errors = [...this.errors, response?.error];
          }
        })
      );
    if (this.defaultFilter) {
      this.paymentTypeSelected = this.defaultFilter;
    }
    this.itemsPerPage = this.itemsPerPage ? this.itemsPerPage : 10;
    this.getAppointments(this.visits);
  }

  private getAppointments(visits: Visit[]) {
    this.loadingPatients = true;
    this.appointments$ =  this.appointmentService
          .getAppointments(
            this.filterBy ? this.filterBy : "",
          )
          .pipe(
            tap((response: any) => {
              this.loadingPatients = false;
              if (response?.error) {
                this.errors = [...this.errors, response?.error];
              }
            })
    );
    
  }

  getAnotherList(event: Event, visit, type): void {
    const details = {
      ...visit,
      type,
    };
    // this.onLoadNewList(details);
  }

  async onLoadNewList(details) {
    this.loadingPatients = true;
    this.page =
      details?.type === "next" ? Number(this.page) + 1 : Number(this.page) - 1;

    this.startingIndex =
      details?.type === "next"
        ? this.startingIndex + Number(this.itemsPerPage)
        : this.startingIndex - Number(this.itemsPerPage);

    this.appointments$ = this.appointmentService
            .getAppointments(
              this.searchTerm,
            )
            .pipe(
              tap((response: any) => {
                this.loadingPatients = false;
                if (response?.error) {
                  this.errors = [...this.errors, response?.error];
                }
              })
    );
    
    const res = await this.api.appointmentscheduling.getAllAppointments({v:"full",limit:10, startIndex:this.startingIndex})

    console.log(res)
  }

  onSearchPatient(e) {
    e.stopPropagation();
    this.searchTerm = e?.target?.value;
    this.loadingPatients = true;
    this.appointments$ = this.appointmentService
      .searchAppointments(
        this.searchTerm,
      )
      .pipe(
        tap((response: any) => {
          this.loadingPatients = false;
          if (response?.error) {
            this.errors = [...this.errors, ...response?.error];
          }
        })
      );
  }

  getLocationUuids(location) {
    this.locationsUuids = [...this.locationsUuids, location?.uuid];
    if (location?.childMembers && location?.childMembers?.length > 0) {
      location?.childMembers?.forEach((member) => {
        this.getLocationUuids(member);
      });
    }
    return uniq(this.locationsUuids);
  }

  onSelectPatient(e, visit: Visit) {
    if (e) {
      e.stopPropagation();
    }
    this.selectAppointment.emit({ visit });
  }

  togglePatientTypeList(type) {
    const currentUrl = this.router.url.split("?")[0];
    const params = this.router.url.split("?")[1];
    this.isTabularList = type === "tabular" ? true : false;
    this.store.dispatch(
      go({ path: [currentUrl], query: { queryParams: { list: type } } })
    );
  }

  getPaymentTypeSelected(event: any) {
    // event.stopPropagation();
    this.paymentTypeSelected = "";
    setTimeout(() => {
      this.paymentTypeSelected =
        event && event.paymentType && event.paymentType.display
          ? event.paymentType.display
          : "";
    }, 100);
  }

  onSearchAllPatient(event: Event) {
    event.stopPropagation();

    this.store.dispatch(clearActiveVisit());
    const patientListDialog = this.dialog.open(PatientListDialogComponent, {
      width: "800px",
    });

    patientListDialog
      .afterClosed()
      .subscribe((response: { action: string; patient: Patient }) => {
        if (response?.action === "PATIENT_SELECT") {
          this.store.dispatch(clearBills());
          this.store.dispatch(clearBillItems());
          this.selectAppointment.emit(response?.patient);
          this.store.dispatch(
            addCurrentPatient({
              patient: response?.patient,
              isRegistrationPage: this.isRegistrationPage,
            })
          );
        }
      });
  }

  filterPatientList(event: any) {
    this.loadingPatients = true;

    this.filterBy = event && typeof event === "string" ? event : "";

    this.appointments$ = this.appointmentService
      .getAppointments(
        this.filterBy,
      )
      .pipe(
        tap((response: any) => {
          this.loadingPatients = false;
          if (response?.error) {
            this.errors = [...this.errors, response?.error];
          }
        })
      );
  }

}
