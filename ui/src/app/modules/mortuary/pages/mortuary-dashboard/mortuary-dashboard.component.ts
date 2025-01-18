import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import {
  go,
  loadCurrentPatient,
  loadCustomOpenMRSForms,
  loadLocationsByTagName,
} from "src/app/store/actions";
import { loadPatientBills } from "src/app/store/actions/bill.actions";
import { loadActiveVisit } from "src/app/store/actions/visit.actions";
import { AppState } from "src/app/store/reducers";
import { getCurrentLocation, getLocationById } from "src/app/store/selectors";
import { getCurrentPatient } from "src/app/store/selectors/current-patient.selectors";
import {
  getActiveVisit,
  getVisitLoadedState,
  getVisitLoadingState,
} from "src/app/store/selectors/visit.selectors";
import { AssignCabinetModalComponent } from "../../modals/assign-cabinet-modal/assign-cabinet-modal.component";
import { getProviderDetails } from "src/app/store/selectors/current-user.selectors";
import { LocationService } from "src/app/core/services";
import { formatLocationsPayLoad } from "src/app/core";
import { getCustomOpenMRSFormsByIds } from "src/app/store/selectors/form.selectors";
import { ICARE_CONFIG } from "src/app/shared/resources/config";
import { EncountersService } from "src/app/shared/services/encounters.service";
import { DischargePatientModalComponent } from "src/app/shared/components/discharge-patient-modal/discharge-patient-modal.component";
import { DischargeDeceasedPatientModalComponent } from "src/app/shared/components/discharge-deceased-patient-modal/discharge-deceased-patient-modal.component";

@Component({
  selector: "app-mortuary-dashboard",
  templateUrl: "./mortuary-dashboard.component.html",
  styleUrls: ["./mortuary-dashboard.component.scss"],
})
export class MortuaryDashboardComponent implements OnInit {
  patientId: string;
  visitId: string;
  visitLoadedState$: Observable<boolean>;
  loadingVisit$: Observable<any>;
  patient$: Observable<any>;
  visit$: Observable<any>;
  forms$: Observable<any>;
  showHistoryDetails: boolean = false;
  currentLocation$: Observable<any>;
  provider$: Observable<any>;
  useSideBar: boolean = true;
  selectedForm: any;
  showMortuaryNotesArea: boolean = false;
  formDataDetails: any;
  saving: boolean = false;
  showNextOfKins: boolean = true;
  nextOfKinsData: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>,
    private dialog: MatDialog,
    private locationService: LocationService,
    private encounterService: EncountersService
  ) {}

  ngOnInit(): void {
    this.patientId = this.activatedRoute.snapshot.params["patient"];
    this.visitId = this.activatedRoute.snapshot.params["visit"];

    this.store.dispatch(loadActiveVisit({ patientId: this.patientId }));
    this.store.dispatch(loadCurrentPatient({ uuid: this.patientId }));
    this.store.dispatch(loadPatientBills({ patientUuid: this.patientId }));
    this.visitLoadedState$ = this.store.select(getVisitLoadedState);
    this.loadingVisit$ = this.store.select(getVisitLoadingState);
    this.patient$ = this.store.select(getCurrentPatient);
    this.visit$ = this.store.select(getActiveVisit);
    this.store.dispatch(
      loadLocationsByTagName({ tagName: "Mortuary+Location" })
    );
    this.currentLocation$ = this.store.select(getCurrentLocation());
    this.provider$ = this.store.select(getProviderDetails);
    this.visit$.subscribe((visitDetails: any) => {
      if (visitDetails) {
        this.locationService
          .getLocationById(visitDetails?.location?.uuid)
          .subscribe((response: any) => {
            if (response) {
              const formattedVisitLocation: any = formatLocationsPayLoad([
                response,
              ])[0];
              if (formattedVisitLocation?.forms) {
                this.store.dispatch(
                  loadCustomOpenMRSForms({
                    formUuids: formattedVisitLocation?.forms,
                  })
                );
                this.forms$ = this.store.select(
                  getCustomOpenMRSFormsByIds(formattedVisitLocation?.forms)
                );
              }
            }
          });
      }
    });
  }

  onBackToList(event: Event): void {
    event.stopPropagation();
    this.store.dispatch(go({ path: ["/mortuary"] }));
  }

  getSelectedForm(event: Event, form: any): void {
    event.stopPropagation();
    this.selectedForm = form;
    this.showMortuaryNotesArea = false;
    this.showNextOfKins = false;
    this.showHistoryDetails = false;
    setTimeout(() => {
      this.showMortuaryNotesArea = true;
    }, 20);
  }

  onAssignCabinet(
    event: Event,
    patient: any,
    visit: any,
    currentLocation: any,
    provider
  ): void {
    event.stopPropagation();
    this.dialog.open(AssignCabinetModalComponent, {
      minWidth: "70%",
      data: {
        patient,
        visit,
        currentLocation,
        provider,
      },
    });
  }

  onTransferCabinet(
    event: Event,
    patient: any,
    visit: any,
    currentLocation: any,
    provider
  ): void {
    event.stopPropagation();
    this.dialog.open(AssignCabinetModalComponent, {
      minWidth: "70%",
      data: {
        patient,
        visit,
        currentLocation,
        provider,
      },
    });
  }

  onDischarge(event: Event, visit, patient, provider): void {
    event.stopPropagation();
    this.dialog.open(DischargeDeceasedPatientModalComponent, {
      minWidth: "30%",
      data: {
        visit,
        provider,
        patient,
      },
    });
  }

  onToggleVisibityIcons(event: Event): void {
    event.stopPropagation();
    this.showHistoryDetails = !this.showHistoryDetails;
  }

  toggleSideBarMenu(event: Event): void {
    event.stopPropagation();
    this.useSideBar = !this.useSideBar;
  }

  onGetFormDataDetails(formDataDetails: any): void {
    this.formDataDetails = formDataDetails;
  }

  onSave(event: Event, patient: any, visit: any, provider: any): void {
    event.stopPropagation();
    this.saving = true;
    const encounter = {
      patient: patient?.patient?.uuid,
      encounterType: this.formDataDetails?.encounterType?.uuid,
      location: visit?.location?.uuid,
      encounterProviders: [
        {
          provider: provider?.uuid,
          encounterRole: ICARE_CONFIG.encounterRole?.uuid,
        },
      ],
      visit: visit?.uuid,
      obs: Object.keys(this.formDataDetails?.data)?.map((key: string) => {
        return {
          obsDatetime: new Date(),
          concept: key,
          value: this.formDataDetails?.data[key]?.value,
          person: patient?.patient?.person?.uuid,
        };
      }),
    };
    this.encounterService
      .createEncounter(encounter)
      .subscribe((response: any) => {
        if (response) {
          this.saving = false;
        }
      });
  }

  onOpenNextOfKinsForm(event: Event): void {
    event.stopPropagation();
    this.showNextOfKins = true;
    this.showHistoryDetails = false;
    this.showMortuaryNotesArea = false;
  }

  onSaveNextOfKinDetails(event: Event, patient: any): void {
    event.stopPropagation();
    // console.log(patient);
  }

  onGetNextOfKinsData(nextOfKinsData: any): void {
    // console.log("next of kins details", nextOfKinsData);
    this.nextOfKinsData = nextOfKinsData;
  }
}
