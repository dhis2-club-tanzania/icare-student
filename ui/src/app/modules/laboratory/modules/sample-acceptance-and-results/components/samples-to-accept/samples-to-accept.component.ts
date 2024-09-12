import { Component, OnInit, Input } from "@angular/core";
import * as _ from "lodash";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/reducers";
import { Observable, of, zip } from "rxjs";
import { SamplesService } from "src/app/shared/services/samples.service";
import { getProviderDetails } from "src/app/store/selectors/current-user.selectors";
import { SharedConfirmationComponent } from "src/app/shared/components/shared-confirmation/shared-confirmation.component";
import { RejectionReasonComponent } from "../rejection-reason/rejection-reason.component";
import { map, take } from "rxjs/operators";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
@Component({
  selector: "app-samples-to-accept",
  templateUrl: "./samples-to-accept.component.html",
  styleUrls: ["./samples-to-accept.component.scss"],
})
export class SamplesToAcceptComponent implements OnInit {
  @Input() codedSampleRejectionReasons: any;
  @Input() labConfigs: any;
  @Input() datesParameters: any;
  @Input() patients: any[];
  @Input() sampleTypes: any;
  @Input() labSamplesDepartments: any;
  @Input() labSamplesContainers: any;
  @Input() currentUser: any;
  @Input() LISConfigurations: any;
  @Input() userUuid: string;

  samplesToAccept$: Observable<any[]>;
  selectedDepartment: string;
  searchingText: string;
  excludeAllocations: boolean = true;

  page: number = 1;
  pageCount: number = 100;

  savingMessage: any = {};
  providerDetails$: Observable<any>;

  samplesToViewMoreDetails: any = {};
  saving: boolean = false;

  selectedSamplesForAction: any[];
  constructor(
    private dialog: MatDialog,
    private store: Store<AppState>,
    private sampleService: SamplesService,
    private conceptService: ConceptsService
  ) {}

  ngOnInit(): void {
    this.providerDetails$ = this.store.select(getProviderDetails);
  }

  onToggleViewSampleDetails(event: Event, sample: any): void {
    event.stopPropagation();
  }

  onGetSelectedSampleDetails(sampleDetails: any, providerDetails: any): void {
    if (sampleDetails?.actionType === "accept") {
      this.accept(sampleDetails?.data, providerDetails);
    } else {
      this.reject(sampleDetails?.data, providerDetails);
    }
  }

  accept(samples: any[], providerDetails?: any): void {
    let confirmDialog;
    if (this.LISConfigurations?.isLIS) {
      confirmDialog = this.dialog.open(SharedConfirmationComponent, {
        minWidth: "25%",
        data: {
          modalTitle: `Accept Sample`,
          modalMessage: `Please, provide results compromization remarks if any upon accepting sample. Click confirm to accept the sample!`,
          showRemarksInput: true,
        },
        disableClose: false,
        panelClass: "custom-dialog-container",
      });
    }

    (this.LISConfigurations?.isLIS
      ? confirmDialog.afterClosed()
      : of({ confirmed: true })
    ).subscribe((confirmationObject) => {
      if (confirmationObject?.confirmed) {
        this.saving = true;
        if (
          confirmationObject?.remarks &&
          confirmationObject?.remarks.length > 0
        ) {
          const confirmationRemarks = samples?.map((sample) => {
            return {
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
          });
          this.sampleService
            .saveSampleStatuses(confirmationRemarks)
            .subscribe((response) => {
              console.log(
                response?.error ? "Error Occured" : `Success: ${response}`
              );
            });
        }

        this.savingMessage[samples[0]?.id + "-accept"] = true;
        for (const sample of samples) {
          zip(
            ...sample?.orders.map((sampleOrder) => {
              return this.conceptService
                .getConceptDetailsByUuid(
                  sampleOrder?.order?.concept?.uuid,
                  "custom:(uuid,display,setMembers:(uuid,display))"
                )
                .pipe(
                  map((response) => {
                    return response?.setMembers?.length == 0
                      ? [
                          {
                            order: {
                              uuid: sampleOrder?.order?.uuid,
                            },
                            container: {
                              uuid: this.labConfigs["otherContainer"]?.uuid,
                            },
                            sample: {
                              uuid: sample?.uuid,
                            },
                            concept: {
                              uuid: sampleOrder?.order?.concept?.uuid,
                            },
                            label: sampleOrder?.order?.orderNumber,
                          },
                        ]
                      : response?.setMembers?.map((setMember) => {
                          return {
                            order: {
                              uuid: sampleOrder?.order?.uuid,
                            },
                            container: {
                              uuid: this.labConfigs["otherContainer"]?.uuid,
                            },
                            sample: {
                              uuid: sample?.uuid,
                            },
                            concept: {
                              uuid: setMember?.uuid,
                            },
                            label: sampleOrder?.order?.orderNumber,
                          };
                        });
                  })
                );
            })
          )
            .pipe(
              map((allocationsData) => {
                let sampleAcceptStatusWithAllocations = {
                  status: {
                    sample: {
                      uuid: sample?.uuid,
                    },
                    user: {
                      uuid: this.userUuid,
                    },
                    remarks: "accepted",
                    status: "ACCEPTED",
                    category: "ACCEPTED",
                  },
                  allocations: _.flatten(allocationsData),
                };
                return sampleAcceptStatusWithAllocations;
              })
            )
            .subscribe((sampleAcceptStatusWithAllocations) => {
              this.sampleService
                .acceptSampleAndCreateAllocations(
                  sampleAcceptStatusWithAllocations
                )
                .subscribe((response) => {
                  if (response && !response?.error) {
                    this.saving = false;
                  } else {
                    // TODO: Handle errors
                    this.saving = false;
                  }
                });
            });
        }
      }
    });
  }

  reject(samples: any[], providerDetails?: any) {
    this.dialog
      .open(RejectionReasonComponent, {
        width: "40%",
        disableClose: false,
        data: {
          sample: samples[0],
          samples: samples,
          codedSampleRejectionReasons: this.codedSampleRejectionReasons,
        },
        panelClass: "custom-dialog-container",
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((response) => {
        if (response && response?.reasons) {
          this.saving = true;
          this.savingMessage[samples[0]?.id + "-reject"] = true;

          const statuses = _.flatten(
            response?.reasons?.map((reason) => {
              return samples?.map((sample) => {
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
            })
          );
          this.sampleService
            .saveSampleStatuses(statuses)
            .subscribe((response) => {
              if (response && !response?.error) {
                this.saving = false;
              }
            });
        }
      });
  }

  onGetSelectedSamplesForAction(samples: any[]): void {
    this.selectedSamplesForAction = samples;
  }

  onAcceptAll(event: Event): void {
    event.stopPropagation();
    this.accept(this.selectedSamplesForAction, null);
  }

  onRejectAll(event: Event): void {
    event.stopPropagation();
    this.reject(this.selectedSamplesForAction, null);
  }
}
