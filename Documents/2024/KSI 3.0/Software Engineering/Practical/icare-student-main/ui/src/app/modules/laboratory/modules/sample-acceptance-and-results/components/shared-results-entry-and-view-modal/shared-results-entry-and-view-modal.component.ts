import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Observable, of, zip } from "rxjs";
import { map } from "rxjs/operators";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { ConceptGet } from "src/app/shared/resources/openmrs";
import { SampleAllocationObject } from "src/app/shared/resources/sample-allocations/models/allocation.model";
import { SampleAllocationService } from "src/app/shared/resources/sample-allocations/services/sample-allocation.service";

import { omit, groupBy, flatten, orderBy } from "lodash";
import { HttpClient } from "@angular/common/http";
import { OrdersService } from "src/app/shared/resources/order/services/orders.service";
import { VisitsService } from "src/app/shared/resources/visits/services";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/reducers";
import { getProviderDetails } from "src/app/store/selectors/current-user.selectors";
import { MatRadioChange } from "@angular/material/radio";
import { SamplesService } from "src/app/modules/laboratory/resources/services/samples.service";

@Component({
  selector: "app-shared-results-entry-and-view-modal",
  templateUrl: "./shared-results-entry-and-view-modal.component.html",
  styleUrls: ["./shared-results-entry-and-view-modal.component.scss"],
})
export class SharedResultsEntryAndViewModalComponent implements OnInit {
  sampleAllocations$: Observable<any[]>;
  multipleResultsAttributeType$: Observable<any>;
  errors: any[] = [];
  dataValues: any = {};
  saving: boolean = false;
  isFormValid: boolean = false;
  shouldConfirm: boolean = false;
  allocationStatuses: any[] = [];
  userUuid: string;
  obsKeyedByConcepts: any = {};
  files: any[] = [];
  remarksData: any = {};
  showSideNavigation: boolean = false;
  selectedAllocation: any;
  visitDetails$: Observable<any>;
  providerDetails$: Observable<any>;
  preferredName: string;
  parametersRelationshipConceptSourceUuid$: Observable<string>;
  relatedResults: any[] = [];
  selectedParametersWithDefinedRelationship: any[];
  selectedInstruments: any = {};
  constructor(
    private dialogRef: MatDialogRef<SharedResultsEntryAndViewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sampleAllocationService: SampleAllocationService,
    private systemSettingsService: SystemSettingsService,
    private httpClient: HttpClient,
    private ordersService: OrdersService,
    private visitService: VisitsService,
    private store: Store<AppState>,
    private sampleService: SamplesService
  ) {}

  ngOnInit(): void {
    this.preferredName = this.data?.LISConfigurations?.isLIS
      ? "SHORT"
      : "FULLY_SPECIFIED";
    this.providerDetails$ = this.store.select(getProviderDetails);
    this.userUuid = localStorage.getItem("userUuid");
    this.multipleResultsAttributeType$ = this.systemSettingsService
      .getSystemSettingsByKey(
        `iCare.laboratory.settings.testParameters.attributes.multipleResultsAttributeTypeUuid`
      )
      .pipe(
        map((response) => {
          if (response && !response?.error) {
            return response;
          } else {
            this.errors = [...this.errors, response];
            return response;
          }
        })
      );
    this.getAllocations();
    this.visitDetails$ = this.visitService
      .getVisitDetailsByVisitUuid(this.data?.sample?.visit?.uuid, {
        v: "custom:(encounters:(uuid,display,obs,orders,encounterDatetime,encounterType,location))",
      })
      .pipe(
        map((response) => {
          if (response) {
            return {
              ...response,
              encounters: response?.encounters?.map((encounter) => {
                return {
                  ...encounter,
                  orders: encounter?.orders?.map((order) => {
                    return {
                      ...order,
                      concept: {
                        ...order?.concept,
                        display:
                          order?.concept?.display?.indexOf(":") > -1
                            ? order?.concept?.display?.split(":")[1]
                            : order?.concept?.display,
                      },
                    };
                  }),
                };
              }),
            };
          }
        })
      );
  }

  toggleSideNavigation(event: Event, allocation?: any): void {
    this.selectedParametersWithDefinedRelationship = null;
    event.stopPropagation();
    this.selectedAllocation = allocation ? allocation : this.selectedAllocation;
    this.showSideNavigation = !this.showSideNavigation;
  }

  toggleSideNavigationGrouped(
    event: Event,
    parametersWithDefinedRelationship: any[]
  ): void {
    event.stopPropagation();
    this.selectedParametersWithDefinedRelationship =
      parametersWithDefinedRelationship;
    this.showSideNavigation = !this.showSideNavigation;
  }

  getSelection(event: MatRadioChange): void {
    this.preferredName = null;
    setTimeout(() => {
      this.preferredName = event?.value;
    }, 100);
  }

  getAllocations(): void {
    this.sampleAllocations$ =
      this.sampleAllocationService.getAllocationsBySampleUuid(
        this.data?.sample?.uuid
      );
  }

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close(true);
  }

  onSave(event: Event, order: any, alreadyApproved?: boolean): void {
    event.stopPropagation();
    let data = [];
    let dataWithResultsGroup = [];
    Object.keys(this.dataValues).forEach((key) => {
      const dataValue = this.dataValues[key];
      if (
        dataValue?.parameter?.isFile ||
        dataValue?.parameter?.datatype?.display === "Complex"
      ) {
        let existingFile = this.files.find(
          (file) => file.parameterUuid === dataValue?.parameter?.uuid
        );
        this.files = [
          ...this.files.filter(
            (file) => file?.parameterUuid !== dataValue?.parameter?.uuid
          ),
          existingFile
            ? {
                ...existingFile,
                valueFile: dataValue?.value,
              }
            : {
                parameterUuid: dataValue?.parameter?.uuid,
                valueFile: dataValue?.value,
                currentSample: this.data?.sample,
                allocation: dataValue?.allocation,
              },
        ];
      }
      if (dataValue?.multipleResults) {
        /**
         * 1. Create allocation
         * 2. Formulate parent payload
         * 3. Save the parent results
         * 4. Update the data value accordingly
         */

        dataWithResultsGroup = [
          ...dataWithResultsGroup,
          {
            concept: {
              uuid: key,
            },
            testAllocation: {
              uuid: dataValue?.allocation?.uuid,
            },
            abnormal: false,
            value: dataValue?.value,
            order: dataValue?.order,
            parameter: dataValue?.parameter,
            parent: dataValue?.parent,
            parentUuid: dataValue?.parent?.uuid,
            sample: dataValue?.sample,
            instrument:
              order && this.selectedInstruments[order?.concept?.uuid]
                ? {
                    uuid: this.selectedInstruments[order?.concept?.uuid],
                  }
                : null,
            status: {
              category: "RESULT_REMARKS",
              status: "REMARKS",
              remarks: this.remarksData[order?.concept?.uuid],
            },
          },
        ];
      } else {
        data = [
          ...data,
          {
            concept: {
              uuid: key,
            },
            testAllocation: {
              uuid: dataValue?.allocation?.uuid,
            },
            valueNumeric: dataValue?.parameter?.isNumeric
              ? dataValue?.value
              : null,
            valueText: dataValue?.parameter?.isText ? dataValue?.value : null,

            valueCoded: dataValue?.parameter?.isCoded
              ? {
                  uuid: dataValue?.value,
                }
              : null,
            abnormal: false,
            instrument:
              order && this.selectedInstruments[order?.concept?.uuid]
                ? {
                    uuid: this.selectedInstruments[order?.concept?.uuid],
                  }
                : null,
            status: {
              category: "RESULT_REMARKS",
              status: "REMARKS",
              remarks: this.remarksData[order?.concept?.uuid],
            },
          },
        ];
      }
    });
    this.saving = true;
    if (dataWithResultsGroup?.length > 0) {
      const groupedByParent = groupBy(dataWithResultsGroup, "parentUuid");
      Object.keys(groupedByParent).map((key) => {
        const dataValue = dataWithResultsGroup[0];
        const parentAllocation = {
          concept: {
            uuid: dataValue?.parent?.uuid,
          },
          order: {
            uuid: dataValue?.order?.uuid,
          },
          container: {
            uuid: "eb21ff23-a627-4a62-8bd0-efdc1db2ebb5", // Remove this hardcoded uuid
          },
          sample: {
            uuid: dataValue?.sample?.uuid,
          },
          label: dataValue?.order?.orderNumber,
        };
        this.sampleAllocationService
          .createTestAllocation(parentAllocation)
          .subscribe((response) => {
            if (response && !response?.error) {
              const results = [
                {
                  concept: {
                    uuid: dataValue?.parent?.uuid,
                  },
                  testAllocation: {
                    uuid: response?.uuid,
                  },
                  valueNumeric: null,
                  valueText: null,

                  valueCoded: null,
                  abnormal: false,
                },
              ];
              this.sampleAllocationService
                .saveResultsViaAllocations(results)
                .subscribe((resultsResponse) => {
                  if (resultsResponse) {
                    const results = flatten(
                      groupedByParent[key]?.map((testAllocation) => {
                        return testAllocation?.value?.map((val) => {
                          return omit(
                            {
                              ...testAllocation,
                              valueNumeric: testAllocation?.parameter?.isNumeric
                                ? val?.value
                                : null,
                              valueText: testAllocation?.parameter?.isText
                                ? val?.value
                                : null,

                              valueCoded: testAllocation?.parameter?.isCoded
                                ? {
                                    uuid: val?.value,
                                  }
                                : null,
                              resultGroup: {
                                uuid: resultsResponse[0]?.uuid,
                              },
                            },
                            [
                              "parent",
                              "parentUuid",
                              "value",
                              "order",
                              "sample",
                              "parameter",
                            ]
                          );
                        });
                      })
                    );
                    this.sampleAllocationService
                      .saveResultsViaAllocations(results)
                      .subscribe((response) => {
                        if (response) {
                          this.saving = false;
                          if (
                            (
                              this.data?.sample?.statuses?.filter(
                                (status) => status?.category === "HAS_RESULTS"
                              ) || []
                            )?.length === 0
                          ) {
                            const status = {
                              sample: {
                                uuid: this.data?.sample?.uuid,
                              },
                              user: {
                                uuid: localStorage.getItem("userUuid"),
                              },
                              remarks: "",
                              status: "HAS RESULTS",
                              category: "HAS_RESULTS",
                            };
                            this.sampleService
                              .saveSampleStatus(status)
                              .subscribe((response) => {});
                          }
                          setTimeout(() => {
                            this.getAllocations();
                          }, 100);
                        }
                      });
                  }
                });
            }
          });
      });
    }
    this.saveFilesAsObservations(this.files, order);
    if (data?.length > 0) {
      this.sampleAllocationService
        .saveResultsViaAllocations(data)
        .subscribe((response) => {
          if (response) {
            this.saving = false;
            let allocationAmendmentStatuses = [];
            if (alreadyApproved) {
              allocationAmendmentStatuses = response?.map((result) => {
                return {
                  status: "AMENDED",
                  remarks: "AMENDED",
                  category: "RESULT_AMENDMENT",
                  user: {
                    uuid: this.userUuid,
                  },
                  testAllocation: {
                    uuid: result?.testAllocation?.uuid,
                  },
                  testResult: {
                    uuid: result?.uuid,
                  },
                };
              });
            }

            const status = {
              sample: {
                uuid: this.data?.sample?.uuid,
              },
              user: {
                uuid: localStorage.getItem("userUuid"),
              },
              remarks: "",
              status: "HAS RESULTS",
              category: "HAS_RESULTS",
            };
            zip(
              allocationAmendmentStatuses?.length > 0
                ? this.sampleAllocationService.saveAllocationStatuses(
                    allocationAmendmentStatuses
                  )
                : of(null),
              (
                this.data?.sample?.statuses?.filter(
                  (status) => status?.category === "HAS_RESULTS"
                ) || []
              )?.length === 0
                ? this.sampleService.saveSampleStatus(status)
                : of(null)
            ).subscribe((response) => {
              setTimeout(() => {
                this.getAllocations();
              }, 100);
            });
          }
        });
    }
  }

  onAuthorize(
    event: Event,
    order: any,
    confirmed?: boolean,
    approvalStatusType?: string,
    related?: boolean
  ): void {
    event.stopPropagation();
    if (confirmed) {
      const allocationsData = order?.allocations;
      this.allocationStatuses = flatten(
        allocationsData
          ?.map((allocationData) => {
            if (
              allocationData?.finalResult &&
              allocationData?.parameter?.datatype?.display != "Complex"
            ) {
              // TODO: Find a better way to handle second complex (file) data types
              const results = !allocationData?.finalResult?.groups
                ? [allocationData?.finalResult]
                : !related
                ? allocationData?.finalResult?.groups[
                    allocationData?.finalResult?.groups?.length - 1
                  ]?.results
                : allocationData?.finalResult?.groups?.map((group) => {
                    return orderBy(
                      group?.results,
                      ["dateCreated"],
                      ["desc"]
                    )[0];
                  });
              let approvalStatuses = [];
              if (allocationData?.finalResult?.groups) {
                approvalStatuses = results?.map((result) => {
                  return {
                    status:
                      order?.authorizationStatuses?.length === 0 &&
                      !this.data?.LISConfigurations?.isLIS
                        ? "APPROVED"
                        : "AUTHORIZED",
                    remarks: "APPROVED",
                    category: "RESULT_AUTHORIZATION",
                    user: {
                      uuid: this.userUuid,
                    },
                    testAllocation: {
                      uuid: allocationData?.uuid,
                    },
                    testResult: {
                      uuid: result?.uuid,
                    },
                  };
                });
              } else {
                approvalStatuses = [
                  {
                    status:
                      order?.authorizationStatuses?.length === 0 &&
                      !this.data?.LISConfigurations?.isLIS
                        ? "APPROVED"
                        : "AUTHORIZED",
                    remarks: "APPROVED",
                    category: "RESULT_AUTHORIZATION",
                    user: {
                      uuid: this.userUuid,
                    },
                    testAllocation: {
                      uuid: allocationData?.uuid,
                    },
                    testResult: {
                      uuid: orderBy(results, ["dateCreated"], ["desc"])[0]
                        ?.uuid,
                    },
                  },
                ];
              }
              return approvalStatuses;
            }
          })
          ?.filter((allStatus) => allStatus)
      );
      this.saving = true;
      this.shouldConfirm = false;
      this.sampleAllocationService
        .saveAllocationStatuses(this.allocationStatuses)
        .subscribe((response) => {
          if (response && !response?.error) {
            this.saving = false;
            if (
              (
                this.allocationStatuses?.filter(
                  (status) => status?.status === "AUTHORIZED"
                ) || []
              )?.length > 0
            ) {
              // Save sample full authorized
              const status = {
                sample: {
                  uuid: this.data?.sample?.uuid,
                },
                user: {
                  uuid: localStorage.getItem("userUuid"),
                },
                remarks: "AUTHORIZED",
                status: "AUTHORIZED",
                category: "RESULT_AUTHORIZATION",
              };
              this.sampleService
                .saveSampleStatus(status)
                .subscribe((response) => {});
            } else if (
              (
                response?.sample?.statuses?.filter(
                  (status) => status?.status === "APPROVED"
                ) || []
              )?.length === 0
            ) {
              const status = {
                sample: {
                  uuid: this.data?.sample?.uuid,
                },
                user: {
                  uuid: localStorage.getItem("userUuid"),
                },
                remarks: "APPROVED",
                status: "APPROVED",
                category: "RESULT_AUTHORIZATION",
              };
              this.sampleService
                .saveSampleStatus(status)
                .subscribe((response) => {});
            }
            setTimeout(() => {
              this.getAllocations();
            }, 100);
          } else {
            this.saving = false;
            this.errors = [this.errors, response];
          }
        });
    } else {
      this.shouldConfirm = true;
    }
  }

  onCancelAuthorize(event: Event): void {
    event.stopPropagation();
    this.shouldConfirm = false;
  }

  onGetFieldData(
    dataObject: any,
    parameter: ConceptGet,
    allocation: SampleAllocationObject
  ): void {
    // console.log(dataObject);
    if (
      (dataObject?.value && !dataObject?.previousValue) ||
      (dataObject?.value &&
        dataObject?.previousValue &&
        dataObject?.value != dataObject?.previousValue)
    ) {
      this.dataValues[parameter?.uuid] = {
        ...dataObject,
        allocation: allocation,
        parent: allocation?.order?.concept,
        sample: allocation?.sample,
        order: allocation?.order,
      };
    } else if (
      dataObject?.value &&
      dataObject?.previousValue &&
      dataObject?.value == dataObject?.previousValue
    ) {
      this.dataValues = omit(this.dataValues, parameter?.uuid);
    }
    this.isFormValid = Object.keys(this.dataValues)?.length > 0;
  }

  saveFilesAsObservations(fileObjects: any[], order: any): any {
    // TODO: COnsider returning encounter on test allocation api
    this.ordersService
      .getOrderByUuid(order?.uuid)
      .subscribe((response: any) => {
        if (response && !response?.error) {
          fileObjects.forEach((file) => {
            let data = new FormData();
            const jsonData = {
              concept: file?.parameterUuid,
              person: this.data?.sample?.patient?.uuid,
              encounter: response?.encounter?.uuid,
              obsDatetime: new Date(),
              voided: false,
              status: "PRELIMINARY",
            };
            data.append("file", file?.valueFile);
            data.append("json", JSON.stringify(jsonData));

            // void first the existing observation
            if (
              this.obsKeyedByConcepts[file?.parameterUuid] &&
              this.obsKeyedByConcepts[file?.parameterUuid]?.value
            ) {
              const existingObs = {
                concept: file?.parameterUuid,
                person: this.data?.sample?.patient?.uuid,
                obsDatetime:
                  this.obsKeyedByConcepts[file?.parameterUuid]?.encounter
                    ?.obsDatetime,
                encounter:
                  this.obsKeyedByConcepts[file?.parameterUuid]?.encounter?.uuid,
                status: "PRELIMINARY",
                comment:
                  this.obsKeyedByConcepts[file?.parameterUuid]?.encounter
                    ?.comment,
              };
              this.httpClient
                .post(
                  `../../../openmrs/ws/rest/v1/obs/${
                    this.obsKeyedByConcepts[file?.parameterUuid]?.uuid
                  }`,
                  {
                    ...existingObs,
                    voided: true,
                  }
                )
                .subscribe((response) => {
                  if (response) {
                  }
                });
            } else {
              console.warn("None to void");
            }
            this.httpClient
              .post(`../../../openmrs/ws/rest/v1/obs`, data)
              .subscribe((response: any) => {
                if (response) {
                  this.obsKeyedByConcepts[file?.parameterUuid] = {
                    ...response,
                    uri: response?.value?.links
                      ? response?.value?.links?.uri?.replace("http", "https")
                      : null,
                  };
                }
              });
          });
        }
      });
  }

  onGetRemarks(remarks: string, order: any): void {
    this.remarksData[order?.concept?.uuid] = remarks;
  }

  getFedResults(results: any, order: any): void {
    this.relatedResults = [];
    // console.log("results", results);
    Object.keys(results)?.forEach((key) => {
      if (
        results[key]?.value &&
        results[key]?.value != results[key]?.previousValue[0]
      ) {
        this.relatedResults = [
          ...this.relatedResults,
          {
            concept: {
              uuid: results[key]?.parameter?.uuid,
            },
            testAllocation: {
              uuid: results[key]?.allocation?.uuid,
            },
            valueNumeric: results[key]?.parameter?.isNumeric
              ? results[key]?.value
              : null,
            valueText: results[key]?.parameter?.isText
              ? results[key]?.value
              : null,

            valueCoded: results[key]?.parameter?.isCoded
              ? {
                  uuid: results[key]?.value,
                }
              : null,
            resultGroup: {
              uuid: results[key]?.relatedResult?.uuid,
            },
            instrument:
              order && this.selectedInstruments[order?.concept?.uuid]
                ? {
                    uuid: this.selectedInstruments[order?.concept?.uuid],
                  }
                : null,
            abnormal: false,
            status: this.remarksData[results[key]?.parameter?.uuid]
              ? {
                  category: "RESULT_REMARKS",
                  status: "REMARKS",
                  remarks: this.remarksData[results[key]?.parameter?.uuid],
                }
              : null,
          },
        ];
      }
    });
  }

  onSaveRelatedResults(event: Event, order: any): void {
    event.stopPropagation();
    // console.log("relatedResults", this.relatedResults);
    this.sampleAllocationService
      .saveResultsViaAllocations(this.relatedResults)
      .subscribe((response) => {
        if (response) {
          this.saving = false;
          setTimeout(() => {
            this.getAllocations();
          }, 100);
        }
      });
  }

  onGetSelectedInstrument(instrument: any, order: any): void {
    this.selectedInstruments[order?.concept?.uuid] = instrument;
  }
}
