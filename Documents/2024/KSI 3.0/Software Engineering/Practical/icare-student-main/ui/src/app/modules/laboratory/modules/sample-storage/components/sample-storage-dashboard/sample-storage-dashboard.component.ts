import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { orderBy } from "lodash";
import { Observable, zip } from "rxjs";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { LISConfigurationsModel } from "src/app/modules/laboratory/resources/models/lis-configurations.model";
import { OtherClientLevelSystemsService } from "src/app/modules/laboratory/resources/services/other-client-level-systems.service";
import { SharedConfirmationComponent } from "src/app/shared/components/shared-confirmation/shared-confirmation.component";
import { SharedSamplesVerificationIntegratedComponent } from "src/app/shared/dialogs/shared-samples-verification-integrated/shared-samples-verification-integrated.component";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import { SamplesService } from "src/app/shared/services/samples.service";
import {
  addLabDepartments,
  loadLabSamplesByCollectionDates,
} from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import {
  getFormattedLabSamplesForTracking,
  getLabSamplesWithResults,
} from "src/app/store/selectors";

@Component({
  selector: "app-sample-storage-dashboard",
  templateUrl: "./sample-storage-dashboard.component.html",
  styleUrls: ["./sample-storage-dashboard.component.scss"],
})
export class SampleStorageDashboardComponent implements OnInit {
  @Input() datesParameters: any;
  @Input() patients: any;
  @Input() sampleTypes: any;
  @Input() labSamplesDepartments: any;
  @Input() labSamplesContainers: any;
  @Input() configs: any;
  @Input() codedSampleRejectionReasons: any;
  @Input() LISConfigurations: LISConfigurationsModel;
  @Input() currentUser: any;
  @Input() privileges: any;
  @Input() providerDetails: any;

  labConfigs$: Observable<any>;
  privileges$: Observable<any>;
  codedSampleRejectionReasons$: Observable<any[]>;
  samplesLoadedState$: Observable<any>;
  searchingText: string = "";
  allSamples$: Observable<any[]>;
  selectedDepartment: string = "";
  status: boolean;
  userUuid: any;
  completedSamples$: Observable<any>;
  samplesWithResults$: Observable<any[]>;
  sampleDetailsToggleControl: any = {};
  samplesToViewMoreDetails: any = {};
  saving: boolean = false;
  shouldConfirm: boolean = false;

  externalSystemPayload: any;
  message: any = {};
  testResultsMapping$: Observable<any>;
  externalSystemsReferenceConceptUuid$: Observable<string>;
  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private samplesService: SamplesService,
    private otherSystemsService: OtherClientLevelSystemsService,
    private conceptService: ConceptsService,
    private systemSettingsService: SystemSettingsService
  ) {}

  ngOnInit(): void {
    this.userUuid = this.currentUser?.uuid;
    this.getCompletedSamples();
    this.testResultsMapping$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "iCare.laboratory.settings.externalSystems.pimaCOVID.testResults.mappingSourceUuid"
      );

    this.externalSystemsReferenceConceptUuid$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "icare.lis.externalSystems.dhis2Based.conceptUuid"
      );
  }

  getCompletedSamples() {
    this.store.dispatch(
      addLabDepartments({ labDepartments: this.labSamplesDepartments })
    );
    this.store.dispatch(
      loadLabSamplesByCollectionDates({
        datesParameters: this.datesParameters,
        patients: this.patients,
        sampleTypes: this.sampleTypes,
        departments: this.labSamplesDepartments,
        containers: this.labSamplesContainers,
        configs: this.configs,
        codedSampleRejectionReasons: this.codedSampleRejectionReasons,
      })
    );

    const moreInfo = {
      patients: this.patients,
      sampleTypes: this.sampleTypes,
      departments: this.labSamplesDepartments,
      containers: this.labSamplesContainers,
      configs: this.configs,
      codedSampleRejectionReasons: this.codedSampleRejectionReasons,
    };

    this.allSamples$ = this.samplesService.getSampleByStatusCategory(
      null,
      null,
      this.datesParameters?.startDate,
      this.datesParameters?.endDate,
      moreInfo
    );
  }

  setDepartment(department) {
    this.selectedDepartment = department;
    this.allSamples$ = this.store.select(getFormattedLabSamplesForTracking, {
      department: this.selectedDepartment,
      searchingText: this.searchingText,
    });
  }

  onSearch(e) {
    this.searchingText = e;
    this.allSamples$ = this.store.select(getFormattedLabSamplesForTracking, {
      department: this.selectedDepartment,
      searchingText: this.searchingText,
    });
  }

  toggleSampleDetails(event: Event, sample: any): void {
    event.stopPropagation();
    this.sampleDetailsToggleControl[sample?.id] = !this
      .sampleDetailsToggleControl[sample?.id]
      ? true
      : false;
  }

  onDispose(sample: any): void {
    event.stopPropagation();
    const confirmDialog = this.dialog.open(SharedConfirmationComponent, {
      width: "25%",
      data: {
        modalTitle: `Dispose sample`,
        modalMessage: `Are you sure to dispose results of ${sample?.label}?`,
        showRemarksInput: true,
      },
      disableClose: false,
      panelClass: "custom-dialog-container",
    });

    confirmDialog.afterClosed().subscribe((res) => {
      if (res.confirmed) {
        const sampleStatus = {
          sample: {
            uuid: sample?.uuid,
          },
          user: {
            uuid: this.userUuid,
          },
          remarks: res?.remarks,
          status: "DISPOSED",
          category: "DISPOSED",
        };

        this.samplesService
          .setSampleStatus(sampleStatus)
          .subscribe((response) => {
            if (response.error) {
              // console.log("Error: " + response.error);
            }
            if (!response.error) {
              // console.log("Response: " + response);
            }
          });
      }
      this.getCompletedSamples();
    });
  }

  onToggleViewSampleDetails(event: Event, sample: any): void {
    event.stopPropagation();
    this.samplesToViewMoreDetails[sample?.id] = !this.samplesToViewMoreDetails[
      sample?.id
    ]
      ? sample
      : null;
  }

  onGetVisitDetails(visitDetails): void {
    const matchedAttribute = (visitDetails?.attributes?.filter(
      (attribute) =>
        attribute?.attributeType?.uuid ===
        "0acd3180-710d-4417-8768-97bc45a02395"
    ) || [])[0];
    this.externalSystemPayload = matchedAttribute
      ? JSON.parse(matchedAttribute?.value)
      : null;
  }

  onGetSelectedSampleDetails(sample: any): void {
    console.log(sample);
  }
}
