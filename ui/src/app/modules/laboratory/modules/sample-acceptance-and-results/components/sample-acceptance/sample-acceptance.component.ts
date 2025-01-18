import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatRadioChange } from "@angular/material/radio";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { SamplesService } from "src/app/modules/laboratory/resources/services/samples.service";
import { SharedConfirmationComponent } from "src/app/shared/components/shared-confirmation/shared-confirmation.component";
import {
  setSampleStatus,
  loadLabSamplesByCollectionDates,
  acceptSample,
  setSampleStatuses,
  clearLoadedLabSamples,
  updateSample,
  loadSampleByUuid,
  go,
} from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import {
  getAcceptedFormattedLabSamples,
  getCompletedLabSamples,
  getFormattedAcceptedLabSamples,
  getFormattedLabSamplesForTracking,
  getFormattedLabSamplesLoadedState,
  getFormattedLabSamplesToAccept,
  getFormattedLabSamplesToFeedResults,
  getFormattedRejectedLabSamples,
  getLabDepartments,
  getLabSamplesWithResults,
  getPatientsWithCompletedLabSamples,
  getPatientWithResults,
  getSettingLabSampleStatusState,
  getWorkList,
} from "src/app/store/selectors";
import { getProviderDetails } from "src/app/store/selectors/current-user.selectors";

import { PrintResultsModalComponent } from "../print-results-modal/print-results-modal.component";
import { RejectionReasonComponent } from "../rejection-reason/rejection-reason.component";
import { SharedResultsEntryAndViewModalComponent } from "../shared-results-entry-and-view-modal/shared-results-entry-and-view-modal.component";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { groupBy } from "lodash";
import { LabSample } from "src/app/modules/laboratory/resources/models";
import { MatTabChangeEvent } from "@angular/material/tabs";

@Component({
  selector: "app-sample-acceptance",
  templateUrl: "./sample-acceptance.component.html",
  styleUrls: ["./sample-acceptance.component.scss"],
})
export class SampleAcceptanceComponent implements OnInit {
  @Input() codedSampleRejectionReasons: any;
  @Input() labConfigs: any;
  @Input() datesParameters: any;
  @Input() patients: any[];
  @Input() sampleTypes: any;
  @Input() labSamplesDepartments: any;
  @Input() labSamplesContainers: any;
  @Input() currentUser: any;
  @Input() LISConfigurations: any;
  samplesAccepted$: Observable<any[]>;
  samplesToAccept$: Observable<any[]>;
  allSamples$: Observable<any[]>;
  worklist$: Observable<any[]>;
  samplesToFeedResults$: Observable<any[]>;
  completedSamples$: Observable<any[]>;
  patientsWithCompletedSamples$: Observable<any[]>;
  rejectedSamples$: Observable<any[]>;
  providerDetails$: Observable<any>;
  savingMessage: any = {};
  settingLabSampleStatus$: Observable<any>;
  userUuid: string;
  searchingText: string = "";
  labDepartments$: Observable<any>;
  selectedDepartment: string = "";
  acceptedSamples$: Observable<any[]>;
  samplesWithResults$: Observable<any[]>;
  patientsWithResults$: Observable<any>;
  showTabSampleTrackingForLis = false;
  saving: boolean = false;
  samplesToViewMoreDetails: any = {};
  @Input() page: number;
  @Input() pageCount: number;
  samplesLoadedState$: Observable<boolean>;

  entryCategory: string = "INDIVIDUAL";
  selectedIndex: number = 0;
  showPrintingPage: boolean = false;
  dataToPrint$: Observable<any>;
  testRelationshipConceptSourceUuid$: Observable<string>;
  savingPrintInformation: boolean = false;
  formUuidsReferencesForSampleReportDisplay$: Observable<any[]>;
  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private sampleService: SamplesService,
    private systemSettingsService: SystemSettingsService
  ) {}

  ngOnInit(): void {
    try {
      this.selectedIndex =
        localStorage.getItem("resultsAndTestingTab") &&
        Number(JSON.parse(localStorage.getItem("resultsAndTestingTab"))?.index)
          ? Number(
              JSON.parse(localStorage.getItem("resultsAndTestingTab"))?.index
            )
          : this.selectedIndex;
      const label: string =
        localStorage.getItem("resultsAndTestingTab") &&
        JSON.parse(localStorage.getItem("resultsAndTestingTab"))?.label
          ? JSON.parse(localStorage.getItem("resultsAndTestingTab"))?.label
          : "";
      this.store.dispatch(
        go({
          path: ["/laboratory/sample-acceptance-and-results"],
          query: { queryParams: { tab: label } },
        })
      );
    } catch (error) {
      console.log(error);
    }
    this.userUuid = this.currentUser?.uuid;
    this.samplesLoadedState$ = this.store.select(
      getFormattedLabSamplesLoadedState
    );
    this.labDepartments$ = this.store.select(getLabDepartments);
    this.providerDetails$ = this.store.select(getProviderDetails);

    this.settingLabSampleStatus$ = this.store.select(
      getSettingLabSampleStatusState
    );
    this.testRelationshipConceptSourceUuid$ =
      this.systemSettingsService.getSystemSettingsByKey(
        `iCare.lis.testParameterRelationship.conceptSourceUuid`
      );

    this.formUuidsReferencesForSampleReportDisplay$ =
      this.systemSettingsService.getSystemSettingsByKey(
        `iCare.lis.forms.formsToDisplayOnLabSampleReport.uuids`
      );
  }

  onGetDataToPrint(samplesDetails: any): void {
    const statuses = [samplesDetails]?.map((sample) => {
      return {
        sample: {
          uuid: sample?.uuid,
        },
        user: {
          uuid: this.userUuid,
        },
        remarks: "Printed Results",
        category: "PRINT",
        status: "PRINTED",
      };
    });
    this.sampleService
      .setMultipleSamplesStatuses(statuses)
      .subscribe((response) => {
        if (response) {
          this.showPrintingPage = true;
          this.dataToPrint$ = this.sampleService
            .getFormattedSampleByUuid(
              samplesDetails?.uuid,
              this.labSamplesDepartments,
              this.sampleTypes,
              this.codedSampleRejectionReasons
            )
            .pipe(
              map((response) => {
                const filteredCompletedSamples = [
                  {
                    ...response,
                    mrn: response?.mrn,
                    departmentName: response?.department?.name,
                  },
                ];
                const groupedByMRN = groupBy(filteredCompletedSamples, "mrn");
                return Object.keys(groupedByMRN).map((key) => {
                  const samplesKeyedByDepartments = groupBy(
                    groupedByMRN[key],
                    "departmentName"
                  );
                  return {
                    patientDetailsAndSamples: {
                      mrn: key,
                      patient: groupedByMRN[key][0]?.sample?.patient,
                      departments: Object.keys(samplesKeyedByDepartments).map(
                        (depName) => {
                          return {
                            departmentName: depName,
                            samples: samplesKeyedByDepartments[depName].map(
                              (sampleObject) => {
                                const sample = new LabSample(
                                  sampleObject,
                                  this.labSamplesDepartments,
                                  this.sampleTypes,
                                  this.codedSampleRejectionReasons
                                ).toJSon();
                                return sample;
                              }
                            ),
                          };
                        }
                      ),
                    },
                    labConfigs: this.labConfigs,
                    LISConfigurations: this.LISConfigurations,
                    user: samplesDetails?.providerDetails,
                    authorized: true,
                  };
                });
              })
            );
        }
      });
  }

  togglePrintAndList(event: Event): void {
    event.stopPropagation();
    this.showPrintingPage = !this.showPrintingPage;
  }

  onToggleViewSampleDetails(event: Event, sample: any): void {
    event.stopPropagation();
    this.samplesToViewMoreDetails[sample?.id] = !this.samplesToViewMoreDetails[
      sample?.id
    ]
      ? sample
      : null;
  }

  accept(e, sample, providerDetails) {
    e.stopPropagation();
    const confirmDialog = this.dialog.open(SharedConfirmationComponent, {
      minWidth: "25%",
      data: {
        modalTitle: `Accept Sample`,
        modalMessage: `Please, provide results compromization remarks if any upon accepting this sample. Click confirm to accept the sample!`,
        showRemarksInput: true,
      },
      disableClose: false,
      panelClass: "custom-dialog-container",
    });

    confirmDialog.afterClosed().subscribe((confirmationObject) => {
      if (confirmationObject?.confirmed) {
        if (confirmationObject?.remarks.length > 0) {
          const confirmationRemarks = {
            sample: {
              uuid: sample?.uuid,
            },
            user: {
              uuid: this.userUuid,
            },
            remarks: confirmationObject?.remarks,
            status: "ACCEPTANCE_REMARKS",
            category: "ACCEPTANCE_REMARKS",
          };
          this.sampleService
            .saveSampleStatus(confirmationRemarks)
            .subscribe((response) => {
              console.log(
                response?.error ? "Error Occured" : `Success: ${response}`
              );
            });
        }

        this.savingMessage[sample?.id + "-accept"] = true;

        const data = {
          sample: {
            uuid: sample?.uuid,
          },
          user: {
            uuid: this.userUuid,
          },
          remarks: "accepted",
          status: "ACCEPTED",
          category: "ACCEPTED",
        };

        this.store.dispatch(
          acceptSample({
            status: data,
            details: {
              ...sample,
              acceptedBy: {
                uuid: providerDetails?.uuid,
                name: providerDetails?.display,
                display: providerDetails?.display,
              },
            },
          })
        );

        this.settingLabSampleStatus$ = this.store.select(
          getSettingLabSampleStatusState
        );
        setTimeout(() => {
          this.store.dispatch(clearLoadedLabSamples());
          this.getSamplesData();
          this.saving = false;
        }, 1000);
      }
    });
  }

  reject(e, sample, providerDetails) {
    e.stopPropagation();
    this.dialog
      .open(RejectionReasonComponent, {
        width: "40%",
        disableClose: false,
        data: {
          sample: sample,
          codedSampleRejectionReasons: this.codedSampleRejectionReasons,
        },
        panelClass: "custom-dialog-container",
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((response) => {
        if (response && response?.reasons) {
          this.saving = true;
          this.savingMessage[sample?.id + "-reject"] = true;

          const data = response?.reasons?.map((reason) => {
            return {
              sample: {
                uuid: sample?.uuid,
              },
              user: {
                uuid: this.userUuid,
              },
              remarks: response?.rejectionRemarks
                ? response?.rejectionRemarks
                : "None",
              category: "REJECTED_LABORATORY",
              status: reason?.uuid,
            };
          });
          this.store.dispatch(
            setSampleStatuses({
              statuses: data,
              details: {
                ...sample,
                rejectionReason: response?.rejectionRemarks,
                rejectedBy: {
                  uuid: providerDetails?.uuid,
                  name: providerDetails?.display,
                  display: providerDetails?.display,
                },
              },
            })
          );
          // TODO: Remove this bad coding after improve of APIs
          setTimeout(() => {
            this.store.dispatch(clearLoadedLabSamples());
            this.getSamplesData();
            this.saving = false;
          }, 1000);
        }
      });
  }

  setDepartment(department) {
    this.selectedDepartment = department;
    this.getSamples();
  }

  onSearch(e) {
    if (e) {
      e.stopPropagation();
      this.getSamples();
    }
  }

  getSamples() {
    this.allSamples$ = this.store
      .select(getFormattedLabSamplesForTracking, {
        department: this.selectedDepartment,
        searchingText: this.searchingText,
      })
      .pipe(
        map((samples) => {
          return samples.filter((s) => !s.disposed);
        })
      );

    this.samplesToFeedResults$ = this.store
      .select(getFormattedLabSamplesToFeedResults, {
        department: this.selectedDepartment,
        searchingText: this.searchingText,
      })
      .pipe(
        map((samples) => {
          return samples.filter((s) => !s.disposed);
        })
      );

    this.samplesAccepted$ = this.store
      .select(getAcceptedFormattedLabSamples, {
        department: this.selectedDepartment,
        searchingText: this.searchingText,
      })
      .pipe(
        map((samples) => {
          return samples.filter((s) => !s.disposed);
        })
      );
    this.samplesToAccept$ = this.store
      .select(getFormattedLabSamplesToAccept, {
        department: this.selectedDepartment,
        searchingText: this.searchingText,
      })
      .pipe(
        map((samples) => {
          return samples.filter((s) => !s.disposed);
        })
      );

    this.worklist$ = this.store
      .select(getWorkList, {
        userUuid: this.LISConfigurations?.isLis ? undefined : this.userUuid,
        department: this.selectedDepartment,
        searchingText: this.searchingText,
      })
      .pipe(
        map((samples) => {
          return samples.filter((s) => !s.disposed);
        })
      );

    this.completedSamples$ = this.store
      .select(getCompletedLabSamples, {
        department: this.selectedDepartment || "",
        searchingText: this.searchingText,
      })
      .pipe(
        map((samples) => {
          return samples.filter((s) => !s.disposed);
        })
      );
    this.patientsWithCompletedSamples$ = this.store.select(
      getPatientsWithCompletedLabSamples,
      {
        department: this.selectedDepartment,
        searchingText: this.searchingText,
        isLIS: this.LISConfigurations?.isLIS,
      }
    );
    this.rejectedSamples$ = this.store
      .select(getFormattedRejectedLabSamples, {
        department: this.selectedDepartment,
        searchingText: this.searchingText,
      })
      .pipe(
        map((samples) => {
          return samples.filter((s) => !s.disposed);
        })
      );
    this.acceptedSamples$ = this.store
      .select(
        getFormattedAcceptedLabSamples(
          this.selectedDepartment,
          this.searchingText
        )
      )
      .pipe(
        map((samples) => {
          return samples.filter((s) => !s.disposed);
        })
      );

    this.samplesWithResults$ = this.store
      .select(
        getLabSamplesWithResults(this.selectedDepartment, this.searchingText)
      )
      .pipe(
        map((samples) => {
          return samples.filter((s) => !s.disposed);
        })
      );

    this.patientsWithResults$ = this.store.select(
      getPatientWithResults(this.selectedDepartment, this.searchingText)
    );
  }

  getSamplesData(): void {
    this.store.dispatch(
      loadLabSamplesByCollectionDates({
        datesParameters: this.datesParameters,
        patients: this.patients,
        sampleTypes: this.sampleTypes,
        departments: this.labSamplesDepartments,
        containers: this.labSamplesContainers,
        configs: this.labConfigs,
        category: "ACCEPTED",
        codedSampleRejectionReasons: this.codedSampleRejectionReasons,
      })
    );
  }

  getEntryType(event: MatRadioChange): void {
    this.entryCategory = event?.value;
  }

  onOpenNewTab(event: MatTabChangeEvent): void {
    const tabsDetails: any = {
      index: event?.index,
      label: event?.tab?.textLabel?.split(" ").join("-"),
    };
    localStorage.setItem("resultsAndTestingTab", JSON.stringify(tabsDetails));
    this.searchingText = "";
    this.selectedDepartment = "";
    this.store.dispatch(
      go({
        path: ["/laboratory/sample-acceptance-and-results"],
        query: { queryParams: { tab: tabsDetails?.label } },
      })
    );
  }

  onResultsReview(event: Event, sample, providerDetails): void {
    event.stopPropagation();
    this.dialog
      .open(SharedResultsEntryAndViewModalComponent, {
        data: {
          sample: sample,
          currentUser: this.currentUser,
          labConfigs: this.labConfigs,
          LISConfigurations: this.LISConfigurations,
          actionType: "review",
        },
        width: "100%",
        maxHeight: "90vh",
        disableClose: false,
        panelClass: "custom-dialog-container",
      })
      .afterClosed()
      .subscribe(() => {
        this.store.dispatch(loadSampleByUuid({ uuid: sample?.uuid }));
      });
  }

  onResultsEntryAndReview(
    e,
    sample,
    providerDetails,
    actionType: string
  ): void {
    e.stopPropagation();
    this.dialog
      .open(SharedResultsEntryAndViewModalComponent, {
        data: {
          sample: sample,
          currentUser: this.currentUser,
          labConfigs: this.labConfigs,
          LISConfigurations: this.LISConfigurations,
          actionType,
        },
        width: "100%",
        maxHeight: "90vh",
        disableClose: false,
        panelClass: "custom-dialog-container",
      })
      .afterClosed()
      .subscribe(() => {
        this.store.dispatch(loadSampleByUuid({ uuid: sample?.uuid }));
      });
  }

  onResultsToPrint(e, patientDetailsAndSamples, providerDetails, authorized) {
    e.stopPropagation();
    this.dialog.open(PrintResultsModalComponent, {
      data: {
        patientDetailsAndSamples: patientDetailsAndSamples,
        labConfigs: this.labConfigs,
        LISConfigurations: this.LISConfigurations,
        user: providerDetails,
        authorized: authorized,
      },
      width: "60%",
      height: "100%",
      disableClose: false,
    });
  }

  onMarkRecollection(e, sample, providerDetails) {
    e.stopPropagation();

    this.savingMessage[sample?.id + "-re-collect"] = true;

    const data = {
      sample: {
        uuid: sample?.uuid,
      },
      user: {
        uuid: this.userUuid,
      },
      remarks: "re-collect",
      status: "RECOLLECT",
    };

    this.store.dispatch(
      setSampleStatus({
        status: data,
        details: {
          ...sample,
          acceptedBy: {
            uuid: providerDetails?.uuid,
            name: providerDetails?.display,
          },
        },
      })
    );

    this.settingLabSampleStatus$ = this.store.select(
      getSettingLabSampleStatusState
    );
  }

  onReviewResults(event: Event, patient: any, sample: any): void {
    event.stopPropagation();
    this.dialog.open(SharedResultsEntryAndViewModalComponent, {
      data: {
        sample: sample,
        currentUser: this.currentUser,
        labConfigs: this.labConfigs,
        LISConfigurations: this.LISConfigurations,
        actionType: "review",
      },
      width: "100%",
      maxHeight: "90vh",
      disableClose: false,
      panelClass: "custom-dialog-container",
    });
  }

  onCancelFromResultsPage(shouldGoBack: boolean): void {
    if (shouldGoBack) {
      this.showPrintingPage = !this.showPrintingPage;
    }
  }
}
