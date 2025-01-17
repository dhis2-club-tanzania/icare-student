import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { Observable, of, zip } from "rxjs";
import { map } from "rxjs/operators";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { ConceptGet, ConceptGetFull } from "src/app/shared/resources/openmrs";
import { SampleAllocationObject } from "src/app/shared/resources/sample-allocations/models/allocation.model";
import { SampleAllocationService } from "src/app/shared/resources/sample-allocations/services/sample-allocation.service";

import { omit, groupBy, flatten, orderBy, isEqual, keyBy } from "lodash";
import { HttpClient } from "@angular/common/http";
import { OrdersService } from "src/app/shared/resources/order/services/orders.service";
import { VisitsService } from "src/app/shared/resources/visits/services";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/reducers";
import { getProviderDetails } from "src/app/store/selectors/current-user.selectors";
import { MatRadioChange } from "@angular/material/radio";
import { SamplesService } from "src/app/modules/laboratory/resources/services/samples.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { SharedConfirmationComponent } from "src/app/shared/components/shared-confirmation/shared-confirmation.component";
import { TestParameterEntryComponent } from "../test-parameter-entry/test-parameter-entry.component";
import { calculateFieldValueFromCalculationExpression } from "src/app/core/helpers/autocalculation.helper";
import { getDataValuesEntities } from "src/app/store/selectors";
import { upsertEnteredDataValues } from "src/app/store/actions";
import { ResultsSyncService } from "src/app/shared/services/results-sync.service";

@Component({
  selector: "app-shared-results-entry-and-view-modal",
  templateUrl: "./shared-results-entry-and-view-modal.component.html",
  styleUrls: ["./shared-results-entry-and-view-modal.component.scss"],
})
export class SharedResultsEntryAndViewModalComponent implements OnInit {
  sampleAllocations$: Observable<any[]>;
  multipleResultsAttributeType$: Observable<any>;
  calculatedValueExpressionAttributeType$: Observable<any>;
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
  multipleResults: any = [];
  selectedTestedByDetails: any = {};
  parametersSearchingText: any = {};
  attributes: any;
  attributeTypeUuid: any;
  calculatedParameters: any = {};
  dataValuesEntities$: Observable<any>;

  @ViewChild(TestParameterEntryComponent)
  testParameterEntryComponent!: TestParameterEntryComponent;
  constructor(
    private dialogRef: MatDialogRef<SharedResultsEntryAndViewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sampleAllocationService: SampleAllocationService,
    private systemSettingsService: SystemSettingsService,
    private httpClient: HttpClient,
    private ordersService: OrdersService,
    private visitService: VisitsService,
    private store: Store<AppState>,
    private sampleService: SamplesService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private resultsSyncService: ResultsSyncService
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

    this.calculatedValueExpressionAttributeType$ = this.systemSettingsService
      .getSystemSettingsByKey(
        `iCare.laboratory.settings.testParameters.calculateValueExpressionAttributeTypeUuid`
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

    this.dataValuesEntities$ = this.store.select(getDataValuesEntities);
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
    window.location.reload();
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
            testedDate:
              this.selectedTestedByDetails[order?.concept?.uuid] &&
              this.selectedTestedByDetails[order?.concept?.uuid].date
                ? this.selectedTestedByDetails[order?.concept?.uuid].date
                : null,
            testedBy:
              this.selectedTestedByDetails[order?.concept?.uuid] &&
              this.selectedTestedByDetails[order?.concept?.uuid]?.testedBy
                ? this.selectedTestedByDetails[order?.concept?.uuid].testedBy
                : null,
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
            testedDate:
              this.selectedTestedByDetails[order?.concept?.uuid] &&
              this.selectedTestedByDetails[order?.concept?.uuid].date
                ? this.selectedTestedByDetails[order?.concept?.uuid].date
                : null,
            testedBy:
              this.selectedTestedByDetails[order?.concept?.uuid] &&
              this.selectedTestedByDetails[order?.concept?.uuid]?.testedBy
                ? this.selectedTestedByDetails[order?.concept?.uuid].testedBy
                : null,
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
                              testedDate:
                                this.selectedTestedByDetails[
                                  order?.concept?.uuid
                                ] &&
                                this.selectedTestedByDetails[
                                  order?.concept?.uuid
                                ].date
                                  ? this.selectedTestedByDetails[
                                      order?.concept?.uuid
                                    ].date
                                  : null,
                              testedBy:
                                this.selectedTestedByDetails[
                                  order?.concept?.uuid
                                ] &&
                                this.selectedTestedByDetails[
                                  order?.concept?.uuid
                                ]?.testedBy
                                  ? this.selectedTestedByDetails[
                                      order?.concept?.uuid
                                    ].testedBy
                                  : null,
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
                            this.saving = false;
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
    if (Object.keys(this.calculatedParameters).length > 0) {
      data = [
        ...data,
        ...Object.keys(this.calculatedParameters).map((key: string) => {
          return {
            concept: {
              uuid: key,
            },
            testAllocation: {
              uuid: data[0]?.testAllocation?.uuid,
            },
            valueNumeric: this.calculatedParameters[key]?.parameter?.isNumeric
              ? this.calculatedParameters[key]?.calculatedValue
              : null,
            valueText: this.calculatedParameters[key]?.parameter?.isText
              ? this.calculatedParameters[key]?.calculatedValue
              : null,

            valueCoded: this.calculatedParameters[key]?.parameter?.isCoded
              ? {
                  uuid: this.calculatedParameters[key]?.calculatedValue,
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
            testedDate:
              this.selectedTestedByDetails[order?.concept?.uuid] &&
              this.selectedTestedByDetails[order?.concept?.uuid].date
                ? this.selectedTestedByDetails[order?.concept?.uuid].date
                : null,
            testedBy:
              this.selectedTestedByDetails[order?.concept?.uuid] &&
              this.selectedTestedByDetails[order?.concept?.uuid]?.testedBy
                ? this.selectedTestedByDetails[order?.concept?.uuid].testedBy
                : null,
          };
        }),
      ];
    }
    if (data?.length > 0) {
      this.sampleAllocationService
        .saveResultsViaAllocations(data)
        .subscribe((response) => {
          if (response) {
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
                  testedDate:
                    this.selectedTestedByDetails[order?.concept?.uuid] &&
                    this.selectedTestedByDetails[order?.concept?.uuid].date
                      ? this.selectedTestedByDetails[order?.concept?.uuid].date
                      : null,
                  testedBy:
                    this.selectedTestedByDetails[order?.concept?.uuid] &&
                    this.selectedTestedByDetails[order?.concept?.uuid]?.testedBy
                      ? this.selectedTestedByDetails[order?.concept?.uuid]
                          .testedBy
                      : null,
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
            ).subscribe((response) => {});

            this.snackBar.open(`Results saved successfully`, "OK", {
              horizontalPosition: "center",
              verticalPosition: "bottom",
              duration: 3500,
              panelClass: ["snack-color"],
            });
            setTimeout(() => {
              this.saving = false;
              this.getAllocations();
            }, 200);
       this.sampleAllocationService.saveResultsViaAllocations(data).subscribe((response) => {
    if (response) {
      this.resultsSyncService.emitResultsUpdate(response);
    }
  });
}       
          }
        });
    }
  }

  onDeleteResults(event: Event, order: any): void {
    event.stopPropagation();
    // console.log(order);
    this.dialog
      .open(SharedConfirmationComponent, {
        minWidth: "20%",
        data: {
          modalTitle: "Delete results",
          modalMessage: `Are you sure you want to delete results?`,
          showRemarksInput: true,
          confirmationButtonText: "Delete",
          type: "warn",
          remarksFieldLabel: "Reason",
        },
      })
      .afterClosed()
      .subscribe((confirmed: any) => {
        if (confirmed) {
          const voidObject: any = {
            results: flatten(
              order?.finalResults?.map((result: any) => {
                if (result?.uuid) {
                  return {
                    uuid: result?.uuid,
                  };
                } else {
                  return flatten(
                    result?.groups?.map((group: any) => {
                      return flatten(
                        group?.results?.map((result: any) => {
                          return {
                            uuid: result?.uuid,
                          };
                        })
                      );
                    })
                  );
                }
              })
            ),
            sample: this.data?.sample?.uuid,
            voided: true,
            voidReason: confirmed?.remarks,
          };
          this.sampleAllocationService
            .voidResults(voidObject)
            .subscribe((response: any) => {
              if (response) {
                this.getAllocations();
              }
            });
        }
      });
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
              } else if (allocationData?.finalResult?.value) {
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
              this.saving = false;
              this.snackBar.open(`Authorized successfully`, "OK", {
                horizontalPosition: "center",
                verticalPosition: "bottom",
                duration: 3500,
                panelClass: ["snack-color"],
              });
              this.getAllocations();
            }, 100);
          } else {
            this.saving = false;
            this.snackBar.open(
              `There is an issue with authorization`,
              "ERROR",
              {
                horizontalPosition: "center",
                verticalPosition: "bottom",
                duration: 3500,
                panelClass: ["snack-color"],
              }
            );
            this.errors = [this.errors, response];
          }
        });
    } else {
      this.shouldConfirm = true;
      // if (!this.data?.LISConfigurations?.isLIS) {
      //   this.shouldConfirm = true;
      // } else {
      //   this.shouldConfirm = true;
      // }

      // console.log(this.data?.LISConfigurations?.isLIS);
      // console.log(order);
      // console.log(this.data?.currentUser);
      //finalResultsFedBy
    }
  }

  onCancelAuthorize(event: Event): void {
    event.stopPropagation();
    this.shouldConfirm = false;
  }

  onGetFieldData(
    dataObject: any,
    parameter: ConceptGetFull,
    allocation: SampleAllocationObject,
    calculatedValueExpressionAttributeType?: string,
    dataValuesEntities?: any
  ): void {
    this.dataValuesEntities$ = this.store.select(getDataValuesEntities);
    let newDataValuesEntitiesData = Object.keys(dataValuesEntities).map(
      (key: string) => {
        if (key !== parameter?.uuid) {
          return dataValuesEntities[key];
        } else {
          return {
            id: key,
            value: dataObject?.value,
          };
        }
      }
    );
    this.store.dispatch(
      upsertEnteredDataValues({
        dataValues: [
          {
            id: parameter?.uuid,
            value: dataObject?.value,
          },
        ],
      })
    );
    const formattedParameter = dataObject?.parameter;
    const expressionAttribute = (formattedParameter?.attributes?.filter(
      (attribute: any) =>
        !attribute?.voided &&
        attribute?.attributeType?.uuid ===
          calculatedValueExpressionAttributeType
    ) || [])[0];
    if (expressionAttribute) {
      this.calculatedParameters[formattedParameter?.uuid] = {
        parameter: formattedParameter,
        expressionAttribute,
      };
    }
    this.calculateValue(keyBy(newDataValuesEntitiesData, "id"));

    if (dataObject?.value?.length === 0) {
      this.dataValues = omit(this.dataValues, parameter?.uuid);
    } else if (dataObject?.multipleResults) {
      // console.log("JJDJDJDJD");
      const prevValues =
        orderBy(
          dataObject?.previousValue?.map((prevValue: any) => {
            return {
              value: prevValue,
            };
          }),
          ["value"],
          ["asc"]
        ) || [];
      const valuesData = orderBy(dataObject?.value, ["value"], ["asc"]);
      const keyedPrevValue: any = keyBy(prevValues, "value");
      if (
        prevValues?.length !== valuesData?.length ||
        ((
          valuesData?.filter(
            (valueData: any) => keyedPrevValue[valueData?.value]
          ) || []
        )?.length !== prevValues?.length &&
          valuesData?.length > 0)
      ) {
        this.dataValues[parameter?.uuid] = {
          ...dataObject,
          allocation: allocation,
          parent: allocation?.order?.concept,
          sample: allocation?.sample,
          order: allocation?.order,
        };
      } else {
        this.dataValues = omit(this.dataValues, parameter?.uuid);
      }
    } else if (
      !dataObject?.multipleResults &&
      ((dataObject?.value &&
        (!dataObject?.previousValue ||
          dataObject?.previousValue?.length === 0)) ||
        (dataObject?.value &&
          dataObject?.value?.length > 0 &&
          dataObject?.previousValue &&
          dataObject?.value != dataObject?.previousValue))
    ) {
      this.dataValues[parameter?.uuid] = {
        ...dataObject,
        allocation: allocation,
        parent: allocation?.order?.concept,
        sample: allocation?.sample,
        order: allocation?.order,
      };
    } else if (
      !dataObject?.multipleResults &&
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
    Object.keys(results)?.forEach((key) => {
      if (
        results[key]?.multipleResults &&
        !isEqual(
          orderBy(results[key]?.value, ["value"], ["asc"])?.map(
            (dataValue) => dataValue?.value
          ) || [],
          orderBy(
            results[key]?.previousValue?.map((val) => {
              return {
                val,
              };
            }),
            ["val"],
            ["asc"]
          )?.map((dataValue) => dataValue?.val) || []
        )
      ) {
        this.multipleResults = [
          ...(this.multipleResults?.filter(
            (result) => result?.allocation?.id !== results[key]?.allocation?.id
          ) || []),
          results[key],
        ];
      } else if (!results[key]?.multipleResults) {
        const changed: boolean =
          results[key]?.value &&
          results[key]?.previousValue?.length > 0 &&
          (
            results[key]?.previousValue?.filter(
              (prevValue: any) => prevValue === results[key]?.value
            ) || []
          )?.length > 0
            ? false
            : results[key]?.previousValue?.length === 0 && !results[key]?.value
            ? false
            : true;

        if (changed) {
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
              resultGroup: results[key]?.relatedResult
                ? {
                    uuid: results[key]?.relatedResult?.uuid,
                  }
                : null,
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
              testedDate:
                this.selectedTestedByDetails[order?.concept?.uuid] &&
                this.selectedTestedByDetails[order?.concept?.uuid].date
                  ? this.selectedTestedByDetails[order?.concept?.uuid].date
                  : null,
              testedBy:
                this.selectedTestedByDetails[order?.concept?.uuid] &&
                this.selectedTestedByDetails[order?.concept?.uuid]?.testedBy
                  ? this.selectedTestedByDetails[order?.concept?.uuid].testedBy
                  : null,
            },
          ];
        }
      }
    });
  }

  onSaveRelatedResults(event: Event, order: any): void {
    this.saving = true;
    event.stopPropagation();
    if (this.multipleResults?.length > 0) {
      this.multipleResults.map((multipleResult) => {
        const allocation = multipleResult?.allocation;
        const parentAllocation = {
          concept: {
            uuid: allocation?.order?.concept?.uuid,
          },
          order: {
            uuid: allocation?.order?.uuid,
          },
          container: {
            uuid: "eb21ff23-a627-4a62-8bd0-efdc1db2ebb5", // Remove this hardcoded uuid
          },
          sample: {
            uuid: allocation?.sample?.uuid,
          },
          label: allocation?.order?.orderNumber,
        };
        this.sampleAllocationService
          .createTestAllocation(parentAllocation)
          .subscribe((response) => {
            if (response && !response?.error) {
              const results = [
                {
                  concept: {
                    uuid: allocation?.order?.concept?.uuid,
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
                      multipleResult?.value?.map((dataValue) => {
                        return {
                          concept: {
                            uuid: multipleResult?.allocation?.parameter?.uuid,
                          },
                          testAllocation: {
                            uuid: multipleResult?.allocation?.uuid,
                          },
                          valueNumeric: null,
                          valueText: null,

                          valueCoded: {
                            uuid: dataValue?.value,
                          },
                          resultGroup: {
                            uuid: resultsResponse[0]?.uuid,
                          },
                          instrument:
                            order &&
                            this.selectedInstruments[order?.concept?.uuid]
                              ? {
                                  uuid: this.selectedInstruments[
                                    order?.concept?.uuid
                                  ],
                                }
                              : null,
                          abnormal: false,
                          testedDate:
                            this.selectedTestedByDetails[
                              order?.concept?.uuid
                            ] &&
                            this.selectedTestedByDetails[order?.concept?.uuid]
                              .date
                              ? this.selectedTestedByDetails[
                                  order?.concept?.uuid
                                ].date
                              : null,
                          testedBy:
                            this.selectedTestedByDetails[
                              order?.concept?.uuid
                            ] &&
                            this.selectedTestedByDetails[order?.concept?.uuid]
                              ?.testedBy
                              ? this.selectedTestedByDetails[
                                  order?.concept?.uuid
                                ].testedBy
                              : null,
                          status: this.remarksData[
                            multipleResult?.allocation?.parameter?.uuid
                          ]
                            ? {
                                category: "RESULT_REMARKS",
                                status: "REMARKS",
                                remarks:
                                  this.remarksData[
                                    multipleResult?.allocation?.parameter?.uuid
                                  ],
                              }
                            : null,
                        };
                      })
                    );
                    zip(
                      this.sampleAllocationService.saveResultsViaAllocations(
                        results
                      ),
                      this.sampleAllocationService.saveResultsViaAllocations(
                        this.relatedResults
                      )
                    ).subscribe((response) => {
                      if (response) {
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
                            .subscribe((response) => {
                              setTimeout(() => {
                                this.snackBar.open(
                                  `Results saved successfully`,
                                  "OK",
                                  {
                                    horizontalPosition: "center",
                                    verticalPosition: "bottom",
                                    duration: 3500,
                                    panelClass: ["snack-color"],
                                  }
                                );
                                this.saving = false;
                                this.getAllocations();
                              }, 100);
                            });
                        } else {
                          setTimeout(() => {
                            this.snackBar.open(
                              `Results saved successfully`,
                              "OK",
                              {
                                horizontalPosition: "center",
                                verticalPosition: "bottom",
                                duration: 3500,
                                panelClass: ["snack-color"],
                              }
                            );
                            this.saving = false;
                            this.getAllocations();
                          }, 100);
                        }
                      }
                    });
                  }
                });
            }
          });
      });
    } else {
      this.sampleAllocationService
        .saveResultsViaAllocations(this.relatedResults)
        .subscribe((response) => {
          if (response) {
            setTimeout(() => {
              this.saving = false;
              this.snackBar.open(`Results saved successfully`, "OK", {
                horizontalPosition: "center",
                verticalPosition: "bottom",
                duration: 3500,
                panelClass: ["snack-color"],
              });
              this.getAllocations();
            }, 100);
          }
        });
    }
  }

  onGetSelectedInstrument(instrument: any, order: any): void {
    this.selectedInstruments[order?.concept?.uuid] = instrument;
  }

  onGetSelectedTestedBy(testedByDetails: any, order: any): void {
    if (testedByDetails?.date || testedByDetails?.testedBy) {
      this.selectedTestedByDetails[order?.concept?.uuid] = testedByDetails;
    }
  }

  calculateValue(dataObject: any): void {
    let fieldValues = [];
    Object.keys(this.calculatedParameters).forEach((parameterUuid: string) => {
      const expressionAttribute =
        this.calculatedParameters[parameterUuid]?.expressionAttribute;

      const value = calculateFieldValueFromCalculationExpression(
        dataObject,
        expressionAttribute
      );
      fieldValues = [
        ...fieldValues,
        {
          id: parameterUuid,
          value,
        },
      ];
      this.calculatedParameters[parameterUuid] = {
        ...this.calculatedParameters[parameterUuid],
        calculatedValue: value,
      };
      this.testParameterEntryComponent.setFieldValue(fieldValues);
    });
  }
}
