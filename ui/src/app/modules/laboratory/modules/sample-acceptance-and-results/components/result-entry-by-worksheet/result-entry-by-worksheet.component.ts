import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { WorkSheetsService } from "src/app/modules/laboratory/resources/services/worksheets.service";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { groupBy, flatten, omit, orderBy } from "lodash";
import { SampleAllocationService } from "src/app/shared/resources/sample-allocations/services/sample-allocation.service";
import { SamplesService } from "src/app/shared/services/samples.service";
import { MatRadioChange } from "@angular/material/radio";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatDialog } from "@angular/material/dialog";
import { AdditionalFieldsModalComponent } from "src/app/modules/laboratory/modals/additional-fields-modal/additional-fields-modal.component";

@Component({
  selector: "app-result-entry-by-worksheet",
  templateUrl: "./result-entry-by-worksheet.component.html",
  styleUrls: ["./result-entry-by-worksheet.component.scss"],
})
export class ResultEntryByWorksheetComponent implements OnInit {
  @Input() worksheetDefinitions: any[];
  @Input() samples: any[];
  @Input() forSamples: boolean;
  @Input() isLIS: boolean;
  @Input() conceptNameType: string;
  @Input() multipleResultsAttributeType: string;
  @Input() viewType: string;
  worksheetDefinitionField: any;
  currentWorksheetDefinition$: Observable<any>;
  currentWorksheetDefinitionUuid: string;
  results: any = {};
  selectedInstrument: string;
  remarksData: any = {};
  savingData: boolean = false;
  files: any[];
  isFormValid: boolean = false;
  testAllocationDetails: any = {};
  showRemarks: boolean = false;
  remarksShowStatus: string = "hide";
  searchingText: string = "";
  allocationStatuses: any[] = [];
  userUuid: string;
  selectedSamples: any[] = [];
  allSelectedItems: any = {};
  associatedFieldsResults: any = {};
  associatedFieldsHasResults: boolean = false;
  fedResultsKeyedByAllocation: any = {};

  constructor(
    private worksheetsService: WorkSheetsService,
    private sampleService: SamplesService,
    private sampleAllocationService: SampleAllocationService,
    private dialog: MatDialog
  ) {
    this.userUuid = localStorage.getItem("userUuid");
  }

  ngOnInit(): void {
    this.createWorksheetDefnitionField();
  }

  getSelection(event: MatRadioChange): void {
    this.conceptNameType = null;
    setTimeout(() => {
      this.conceptNameType = event.value;
    }, 50);
  }

  createWorksheetDefnitionField(): void {
    this.worksheetDefinitionField = new Dropdown({
      id: "worksheetDefinition",
      key: "worksheetDefinition",
      label: "Defined Worksheet",
      options: this.worksheetDefinitions?.map((worksheetDefinition) => {
        return {
          id: worksheetDefinition?.uuid,
          key: worksheetDefinition?.uuid,
          value: worksheetDefinition?.uuid,
          label: worksheetDefinition?.code,
        };
      }),
    });
  }

  onFormUpdate(formValue: FormValue): void {
    const values = formValue?.getValues();
    this.currentWorksheetDefinitionUuid = values?.worksheetDefinition?.value;
    if (this.currentWorksheetDefinitionUuid) {
      this.getWorksheetDefinitionByUuid(this.currentWorksheetDefinitionUuid);
    }
  }

  getRemarksShowStatus(event: MatRadioChange): void {
    this.remarksShowStatus = event?.value;
    this.showRemarks = this.remarksShowStatus === "hide" ? false : true;
  }

  getWorksheetDefinitionByUuid(uuid: string): void {
    this.selectedSamples = [];
    this.currentWorksheetDefinition$ =
      this.worksheetsService.getWorksheetDefinitionsByUuid(uuid);
  }

  getFedResult(
    response: any,
    sample: any,
    allocation: any,
    currentWorksheetDefinition: any
  ): void {
    this.selectedInstrument =
      currentWorksheetDefinition?.worksheet?.instrument?.uuid;
    const resKey = response?.parameter?.uuid + ":" + allocation?.uuid;
    if (allocation?.finalResult?.value !== response?.value) {
      this.results[resKey] = {
        result: { ...response, allocation },
        sample,
      };
      this.isFormValid =
        (
          Object?.keys(this.results)?.filter(
            (key) => this.results[key]?.result?.value
          ) || []
        )?.length > 0;
    } else {
      this.results = omit(this.results, resKey);
      this.isFormValid =
        (
          Object?.keys(this.results)?.filter(
            (key) => this.results[key]?.result?.value
          ) || []
        )?.length > 0;
    }
  }

  onGetRemarks(remark: string, allocation) {
    this.remarksData[allocation?.order?.concept?.uuid] = remark;
  }

  onSave(event: Event): void {
    event.stopPropagation();
    let data = [];
    let dataWithResultsGroup = [];
    Object.keys(this.results).forEach((key) => {
      const dataValue = this.results[key]?.result;
      const order = dataValue?.allocation?.order;
      const sample = this.results[key]?.sample;
      this.testAllocationDetails[dataValue?.allocation?.uuid] = {
        ...dataValue?.allocation,
        sample,
      };
      if (dataValue?.multipleResults && dataValue?.value) {
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
              uuid: order?.concept?.uuid,
            },
            testAllocation: {
              uuid: dataValue?.allocation?.uuid,
            },
            abnormal: false,
            value: dataValue?.value,
            order: dataValue?.allocation?.order,
            parameter: dataValue?.parameter,
            parent: {
              uuid: order?.concept?.uuid,
            },
            parentUuid: order?.concept?.uuid,
            sample: sample,
            instrument: this.selectedInstrument
              ? {
                  uuid: this.selectedInstrument,
                }
              : null,
            status: this.remarksData[order?.concept?.uuid]
              ? {
                  category: "RESULT_REMARKS",
                  status: "REMARKS",
                  remarks: this.remarksData[order?.concept?.uuid],
                }
              : null,
          },
        ];
      } else if (dataValue?.value) {
        data = [
          ...data,
          {
            concept: {
              uuid: dataValue?.parameter?.uuid,
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
            instrument: this.selectedInstrument
              ? {
                  uuid: this.selectedInstrument,
                }
              : null,
            status: this.remarksData[order?.concept?.uuid]
              ? {
                  category: "RESULT_REMARKS",
                  status: "REMARKS",
                  remarks: this.remarksData[order?.concept?.uuid],
                }
              : null,
          },
        ];
      }
    });
    this.savingData = true;
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
                              concept: {
                                uuid: testAllocation?.parameter?.uuid,
                              },
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
                          this.savingData = false;
                          if (
                            (
                              dataValue?.sample?.statuses?.filter(
                                (status) => status?.category === "HAS_RESULTS"
                              ) || []
                            )?.length === 0
                          ) {
                            const status = {
                              sample: {
                                uuid: dataValue?.sample?.uuid,
                              },
                              user: {
                                uuid: localStorage.getItem("userUuid"),
                              },
                              remarks: "",
                              status: "HAS RESULTS",
                              category: "HAS_RESULTS",
                            };
                            this.sampleService
                              .saveSampleStatuses([status])
                              .subscribe((response) => {
                                // console.log("response", response);
                              });
                          }
                          setTimeout(() => {
                            // this.getAllocations();
                          }, 100);
                        }
                      });
                  }
                });
            }
          });
      });
    }
    // this.saveFilesAsObservations(this.files, order);
    if (data?.length > 0) {
      this.sampleAllocationService
        .saveResultsViaAllocations(data)
        .subscribe((responseInfo) => {
          if (responseInfo) {
            this.savingData = false;
            responseInfo?.map((response: any) => {
              if (
                (
                  this.testAllocationDetails[
                    response?.testAllocation?.uuid
                  ]?.sample?.statuses?.filter(
                    (status) => status?.category === "HAS_RESULTS"
                  ) || []
                )?.length === 0
              ) {
                const status = {
                  sample: {
                    uuid: this.testAllocationDetails[
                      response?.testAllocation?.uuid
                    ].sample?.uuid,
                  },
                  user: {
                    uuid: localStorage.getItem("userUuid"),
                  },
                  remarks: "",
                  status: "HAS RESULTS",
                  category: "HAS_RESULTS",
                };
                this.sampleService
                  .setSampleStatus(status)
                  .subscribe((response) => {});
              }
            });
            setTimeout(() => {}, 100);
          }
        });
    }
  }

  onAuthorize(event: Event, workSheetSample: any, related?: any): void {
    if (event) {
      event.stopPropagation();
    }
    const allocationsData = workSheetSample?.sample?.allocations;
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
                  return orderBy(group?.results, ["dateCreated"], ["desc"])[0];
                });
            let approvalStatuses = [];
            if (allocationData?.finalResult?.groups) {
              approvalStatuses = results?.map((result) => {
                return {
                  status:
                    workSheetSample?.sample?.authorizationStatuses?.length ===
                      0 && !this.isLIS
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
                    workSheetSample?.sample?.authorizationStatuses?.length ===
                      0 && !this.isLIS
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
                    uuid: orderBy(results, ["dateCreated"], ["desc"])[0]?.uuid,
                  },
                },
              ];
            }
            return approvalStatuses;
          }
        })
        ?.filter((allStatus) => allStatus)
    );
    this.savingData = true;
    this.sampleAllocationService
      .saveAllocationStatuses(this.allocationStatuses)
      .subscribe((response) => {
        if (response && !response?.error) {
          this.savingData = false;
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
                uuid: workSheetSample?.sample?.uuid,
              },
              user: {
                uuid: this.userUuid,
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
                uuid: workSheetSample?.sample?.uuid,
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
            this.getWorksheetDefinitionByUuid(
              this.currentWorksheetDefinitionUuid
            );
            this.savingData = false;
          }, 100);
        } else {
          this.savingData = false;
          this.getWorksheetDefinitionByUuid(
            this.currentWorksheetDefinitionUuid
          );
        }
      });
  }

  onAuthorizeAll(event: Event, related?: boolean): void {
    event.stopPropagation();
    this.allocationStatuses = [];
    let sampleAuthorizationStatuses = [];
    this.selectedSamples.forEach((worksheetSample: any) => {
      if (
        (
          worksheetSample?.sample?.statuses?.filter(
            (status) => status?.category === "RESULT_AUTHORIZATION"
          ) || []
        )?.length === 0
      ) {
        sampleAuthorizationStatuses = [
          ...sampleAuthorizationStatuses,
          {
            sample: {
              uuid: worksheetSample?.sample?.uuid,
            },
            user: {
              uuid: this.userUuid,
            },
            remarks: "AUTHORIZED",
            status: "AUTHORIZED",
            category: "RESULT_AUTHORIZATION",
          },
        ];
      }
      const allocationsData = worksheetSample?.sample?.allocations;
      this.allocationStatuses = [
        ...this.allocationStatuses,
        ...flatten(
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
                        worksheetSample?.sample?.authorizationStatuses
                          ?.length === 0 && !this.isLIS
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
                        worksheetSample?.sample?.authorizationStatuses
                          ?.length === 0 && !this.isLIS
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
        ),
      ];
    });
    this.savingData = true;
    this.sampleAllocationService
      .saveAllocationStatuses(this.allocationStatuses)
      .subscribe((response) => {
        if (response && !response?.error) {
          this.savingData = false;
          if (sampleAuthorizationStatuses?.length > 0) {
            this.sampleService
              .saveSampleStatuses(sampleAuthorizationStatuses)
              .subscribe((response) => {});
          }
          setTimeout(() => {
            this.getWorksheetDefinitionByUuid(
              this.currentWorksheetDefinitionUuid
            );
            this.savingData = false;
          }, 100);
        } else {
          this.savingData = false;
          this.getWorksheetDefinitionByUuid(
            this.currentWorksheetDefinitionUuid
          );
        }
      });
  }

  onSelectItem(event: MatCheckboxChange, worksheetSample: any): void {
    this.selectedSamples = event?.checked
      ? [...this.selectedSamples, worksheetSample]
      : this.selectedSamples?.filter(
          (selectedWSSample) => selectedWSSample?.uuid !== worksheetSample?.uuid
        ) || [];
  }

  onSelectAllItems(event: MatCheckboxChange, worksheetSamples: any[]): void {
    if (event.checked) {
      this.selectedSamples =
        worksheetSamples?.filter(
          (worksheetSample) =>
            (
              worksheetSample?.sample?.statuses?.filter(
                (status) => status.category === "RESULT_AUTHORIZATION"
              ) || []
            )?.length === 0 && worksheetSample?.type === "SAMPLE"
        ) || [];
      this.selectedSamples?.forEach((worksheetSample) => {
        this.allSelectedItems[worksheetSample?.uuid] = worksheetSample;
      });
    } else {
      this.selectedSamples = [];
      worksheetSamples?.forEach((worksheetSample) => {
        this.allSelectedItems[worksheetSample?.uuid] = null;
      });
    }
  }

  onAddNewFields(event: Event, currentWorksheetDefinition: any): void {
    event.stopPropagation();
    this.dialog.open(AdditionalFieldsModalComponent, {
      width: "50%",
      data: currentWorksheetDefinition,
    });
  }

  getAssociatedFieldsResults(
    data: any,
    testAllocationAssociatedField: any
  ): void {
    if (data) {
      this.associatedFieldsResults[testAllocationAssociatedField?.uuid] = {
        ...testAllocationAssociatedField,
        value: data,
      };
    } else {
      this.associatedFieldsResults[testAllocationAssociatedField?.uuid] = null;
    }
    this.associatedFieldsHasResults =
      (
        Object.keys(this.associatedFieldsResults).filter(
          (key) => this.associatedFieldsResults[key]
        ) || []
      )?.length > 0;
  }
}
