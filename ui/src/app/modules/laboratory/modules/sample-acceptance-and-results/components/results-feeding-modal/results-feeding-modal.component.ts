import { Component, Inject, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { forkJoin, Observable, of, zip } from "rxjs";
import * as _ from "lodash";
import { map, take } from "rxjs/operators";
import { RejectAnswerModalComponent } from "../reject-answer-modal/reject-answer-modal.component";
import { AppState } from "src/app/store/reducers";
import {
  getCurrentUserDetails,
  getProviderDetails,
} from "src/app/store/selectors/current-user.selectors";
import { SamplesService } from "src/app/shared/services/samples.service";
import {
  clearLabSample,
  loadPatientNotes,
  loadSampleByUuid,
  saveLabTestResults,
  saveLabTestResultsStatus,
} from "src/app/store/actions";
import {
  getFormattedLabSampleBySampleIdentifier,
  getFormattedLabSampleOrdersBySampleIdentifier,
  getLabSampleLoadingState,
  getSavingLabTestResultsState,
  getSavingLabTestResultsStatusState,
} from "src/app/store/selectors";
import { DataService } from "src/app/shared/services/data.service";
import { HttpClient } from "@angular/common/http";
import { VisitsService } from "src/app/shared/resources/visits/services";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { TextArea } from "src/app/shared/modules/form/models/text-area.model";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { iCareConnectConfigurationsModel } from "src/app/core/models/lis-configurations.model";

@Component({
  selector: "app-results-feeding-modal",
  templateUrl: "./results-feeding-modal.component.html",
  styleUrls: ["./results-feeding-modal.component.scss"],
})
export class ResultsFeedingModalComponent implements OnInit {
  testOrders$: Observable<any>;
  labConfigs: any;
  maxHeight: string;
  notInRangeIsSet = {};

  ordersTimeSettings: any;
  loadingOrdersTimeSettings: boolean;

  savingMessage = {};

  values: any = {};
  comments: any = {};
  itemsSetForComments = {};
  commentsAreaOpened = {};
  sample: any;

  showClinicalNotesSummary: boolean = false;
  currentSample$: Observable<any>;
  providerDetails$: Observable<any>;

  userUuid: string;

  savingLabResultsState$: Observable<boolean>;
  savingLabResultsStatusState$: Observable<boolean>;

  loadingTestTimeSettings: boolean;
  testTimeSettings: any;

  attach: any = {};
  LISConfigurations: iCareConnectConfigurationsModel;

  dialogData: any;

  temporaryValues: any = {};
  file: any;
  searchingText: string;
  ordersKeyedByConcepts: any = {};
  obsKeyedByConcepts: any = {};
  amendUuid: any;
  amendmentRemarksField: any;
  amendmentRemarks: any;
  saving: boolean = false;
  bulkResultsToSave: any = [];
  hasFedResults: boolean = false;
  saveAllMessage: string;
  labSampleLoadingState$: Observable<boolean>;
  visitDetails$: Observable<any>;
  currentUser$: Observable<any>;
  selectedIndex: number = 0;

  multipleResultsAttributeType$: Observable<any>;
  errors: any[] = [];
  files: any[] = [];
  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ResultsFeedingModalComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private store: Store<AppState>,
    private dataService: DataService,
    private sampleService: SamplesService,
    private httpClient: HttpClient,
    private visitService: VisitsService,
    private systemSettingsService: SystemSettingsService
  ) {
    this.dialogData = data;
    this.sample = data?.sample;
    this.labConfigs = data?.labConfigs;
    this.maxHeight = data?.maxHeight;
    this.userUuid = data?.currentUser?.uuid;
    this.LISConfigurations = data?.LISConfigurations;
    this.store.dispatch(
      loadPatientNotes({
        patientUuid: this.sample?.patient?.uuid,
        conceptUuid: this.labConfigs["patientHistoryConceptUuid"],
      })
    );
  }

  ngOnInit(): void {
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
    this.labSampleLoadingState$ = this.store.select(getLabSampleLoadingState);
    this.testOrders$ = this.store.select(
      getFormattedLabSampleOrdersBySampleIdentifier,
      {
        sampleIdentifier: this.sample?.id,
      }
    );

    this.loadSampleByUuid();

    this.loadingTestTimeSettings = true;

    this.visitDetails$ = this.visitService
      .getVisitDetailsByVisitUuid(this.sample?.visit?.uuid, {
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

    forkJoin(
      _.map(this.sample?.orders, (order) => {
        return this.sampleService.getTestTimeSettings(
          order?.order?.concept?.uuid
        );
      })
    ).subscribe(
      (response) => {
        this.testTimeSettings = response;
        this.loadingTestTimeSettings = false;
      },
      (error) => {
        this.loadingOrdersTimeSettings = false;
      }
    );

    this.testOrders$.pipe(take(1)).subscribe((testOrders) => {
      // console.log('test orders :: ', testOrders);

      //continue with existing implementation
      _.map(testOrders, (order) => {
        if (
          order?.order?.concept?.setMembers?.length == 0 &&
          order?.order?.concept?.answers?.length == 0
        ) {
          this.notInRangeIsSet[order?.order?.concept?.uuid] =
            order?.testAllocations?.length > 0 &&
            order?.testAllocations[0]?.results?.length > 0 &&
            order?.testAllocations[0]?.results[
              order?.testAllocations[0]?.results?.length - 1
            ]?.abnormal == true
              ? true
              : false;
        } else {
          _.each(order?.order?.concept?.setMembers, (parameter, index) => {
            if (parameter?.answers?.length == 0) {
              this.notInRangeIsSet[parameter?.uuid] =
                order?.testAllocations[index] &&
                order?.testAllocations?.length > 0 &&
                order?.testAllocations[index]?.results?.length > 0 &&
                order?.testAllocations[index]?.results[
                  order?.testAllocations[index]?.results?.length - 1
                ]?.abnormal == true
                  ? true
                  : false;
            }

            // if (parameter?.datatype?.display === "Complex") {

            // Find obs
            this.visitDetails$.subscribe((response) => {
              if (response && response?.encounters?.length > 0) {
                response?.encounters?.forEach((encounter, index) => {
                  encounter?.obs?.forEach((obs) => {
                    this.obsKeyedByConcepts[obs?.concept?.uuid] = {
                      ...obs,
                      uri:
                        obs?.value?.links && obs?.value?.links?.uri
                          ? obs?.value?.links?.uri?.replace("http", "https")
                          : null,
                    };
                  });

                  encounter?.orders?.forEach((order) => {
                    this.ordersKeyedByConcepts[order?.concept?.uuid] = order;
                  });
                });
              }
            });
            // }
          });
        }
      });
    });
    this.currentSample$ = this.store.select(
      getFormattedLabSampleBySampleIdentifier,
      {
        sampleIdentifier: this.sample?.id,
      }
    );
    this.providerDetails$ = this.store.select(getProviderDetails);

    this.savingLabResultsState$ = this.store.select(
      getSavingLabTestResultsState
    );
    this.savingLabResultsStatusState$ = this.store.select(
      getSavingLabTestResultsStatusState
    );

    this.currentUser$ = this.store.select(getCurrentUserDetails);

    this.amendmentRemarksField = new TextArea({
      id: "amendmentRemarks",
      key: "amendmentRemarks",
      label: "Amendment Remarks",
      type: "text",
      controlType: "textarea",
    });
  }

  onGetFormData(
    val: any,
    parameter: any,
    item?: any,
    currentSample?: any,
    allocation?: any
  ): void {
    //Work around of the below logic to overwrite a file
    // let newFiles = [];
    // const availableFile = newFiles.find(file => file.parameterUuid === parameter.uuid);
    // const index = newFiles.indexOf(availableFile);
    // newFiles = index < 0 ? [...newFiles, {}] : [...newFiles.slice(0, index), availableFile, newFiles.slice(index + 1)];
    let existingFile = this.files.find(
      (file) => file.parameterUuid === parameter?.uuid
    );
    if (parameter?.datatype?.display === "Complex") {
      this.files = [
        ...this.files.filter((file) => file.parameterUuid !== parameter?.uuid),
        existingFile
          ? {
              ...existingFile,
              valueFile: val,
            }
          : {
              parameterUuid: parameter?.uuid,
              valueFile: val,
              item: item,
              currentSample: currentSample,
              allocation: allocation,
            },
      ];
    }
    this.values[parameter?.uuid] = val;
  }

  loadSampleByUuid(): void {
    this.store.dispatch(loadSampleByUuid({ uuid: this.sample?.uuid }));
  }

  onClose(e) {
    e.stopPropagation();
    this.dialogRef.close();
  }

  setEnteredValue(item, val) {
    this.values[item?.order?.concept?.uuid] = val;
    this.temporaryValues[item?.order?.concept?.uuid] = val;
  }

  onSearch(event: KeyboardEvent): void {
    this.searchingText = (event.target as HTMLInputElement)?.value;
  }

  setEnteredParameterValue(item, val) {
    this.values[item?.uuid] = val;
  }

  onGoNext(event: Event, parameter): void {
    event.stopPropagation();
    (document.getElementById(parameter?.display) as any).value = "";
  }

  setValue(val, item) {
    this.values[item?.order?.concept?.uuid] = val;
  }

  setParameterValue(val: any, parameter: any): void {
    this.values[parameter?.uuid] = val;
  }

  setCommentValue(val, item) {
    this.values[item?.order?.concept?.uuid + "-comment"] = val;
    this.temporaryValues[item?.order?.concept?.uuid + "-comment"] = val;
  }

  setCommentValueForParameters(val, item) {
    this.values[item?.uuid + "-comment"] = val;
    this.temporaryValues[item?.uuid + "-comment"] = val;
  }

  showClinicalNotes(e) {
    e.stopPropagation();
    this.showClinicalNotesSummary = !this.showClinicalNotesSummary;
  }

  onSetAbnormal(e, id) {
    this.values[id] = e.checked;
  }

  onToggleAttachment(e, uuid) {
    e.stopPropagation();
    this.attach[uuid] = this.attach[uuid] ? !this.attach[uuid] : true;
  }

  onOpenAreaForComments(e, item, commentsAreaOpened) {
    e.stopPropagation();
    if (item?.remarks) {
      this.comments[item?.order?.concept?.uuid] = item?.remarks;
    }
    this.itemsSetForComments[item?.order?.concept?.uuid] = item;
    this.commentsAreaOpened[item?.order?.concept?.uuid] = commentsAreaOpened[
      item?.order?.concept?.uuid
    ]
      ? !commentsAreaOpened[item?.order?.concept?.uuid]
      : true;
  }

  onToggleFreeEntry(e, item) {
    e.stopPropagation();
    this.notInRangeIsSet[item?.order?.concept?.uuid] = this.notInRangeIsSet[
      item?.order?.concept?.uuid
    ]
      ? !this.notInRangeIsSet[item?.order?.concept?.uuid]
      : true;
    this.values[item?.order?.concept?.uuid + "-abnormal"] =
      this.notInRangeIsSet[item?.order?.concept?.uuid];
  }

  onToggleFreeEntryForParameter(e, item) {
    e.stopPropagation();
    this.notInRangeIsSet[item?.uuid] = this.notInRangeIsSet[item?.uuid]
      ? !this.notInRangeIsSet[item?.uuid]
      : true;
    this.values[item?.uuid + "-abnormal"] = this.notInRangeIsSet[item?.uuid];
  }

  getTimeConfigs(uuid) {
    let configs = _.filter(this.testTimeSettings, (setting) => {
      return setting.length > 0 && setting[0]["concept"]["uuid"] == uuid
        ? true
        : false;
    });

    // console.log('configs :: ', configs);

    return configs.length > 0 && configs[0]?.length > 0 ? configs[0][0] : null;
  }

  onFormUpdate(formValues: FormValue): void {
    this.amendmentRemarks = formValues.getValues()?.amendmentRemarks?.value;
  }

  onSave(e, item, testOrders, currentSample, allocation) {
    e.stopPropagation();
    this.saving = true;
    this.savingMessage[item?.order?.concept?.uuid] = true;
    const resultObject = {
      concept: {
        uuid: item?.order?.concept?.uuid,
      },
      testAllocation: {
        uuid: item?.testAllocations[0]?.allocationUuid,
      },
      valueNumeric: item?.order?.concept?.numeric
        ? this.values[item?.order?.concept?.uuid]
        : null,
      valueText:
        !item?.concept?.numeric && item?.order?.concept?.answers?.length == 0
          ? this.values[item?.order?.concept?.uuid]
          : null,

      valueCoded:
        item?.order?.concept.answers && item?.order?.concept.answers.length > 0
          ? {
              uuid: this.values[item?.order?.concept?.uuid],
            }
          : null,
      abnormal: this.values[item?.order?.concept?.uuid + "-abnormal"]
        ? this.values[item?.order?.concept?.uuid + "-abnormal"]
        : false,
      additionalReqTimeLimit: this.getTimeConfigs(item?.order?.concept?.uuid)
        ?.additionalReqTimeLimit,
      standardTAT: this.getTimeConfigs(item?.order?.concept?.uuid)?.standardTAT,
      urgentTAT: this.getTimeConfigs(item?.order?.concept?.uuid)?.urgentTAT,
    };

    // console.log(
    //   'fetched configs :: ',
    //   this.getTimeConfigs(item?.order?.concept?.uuid)
    // );

    const resultsComments = {
      status: this.values[item?.order?.concept?.uuid + "-comment"]
        ? "ANSWER DESCRIPTION"
        : "COMMENT",
      remarks: this.values[item?.order?.concept?.uuid + "-comment"]
        ? this.values[item?.order?.concept?.uuid + "-comment"]
        : "NO DESCRPTION",
      user: {
        uuid: this.userUuid,
      },
      testAllocation: {
        uuid: item?.testAllocations[0]?.allocationUuid,
      },
    };

    let formattedDataObject = {};
    _.map(this.getAllKeysWithData(resultObject), (key) => {
      formattedDataObject[key] = resultObject[key];
    });
    this.store.dispatch(
      saveLabTestResults({
        results: formattedDataObject,
        comments: resultsComments,
        sampleDetails: currentSample,
        concept: item?.order?.concept,
        allocation,
      })
    );

    this.savingLabResultsState$ = this.store.select(
      getSavingLabTestResultsState
    );

    this.savingLabResultsState$.pipe(take(1)).subscribe((state) => {
      if (state) {
        this.savingMessage[item?.order?.concept?.uuid] = null;
      }
    });
    this.testOrders$ = this.store.select(
      getFormattedLabSampleOrdersBySampleIdentifier,
      {
        sampleIdentifier: this.sample?.id,
      }
    );
    setTimeout(() => {
      this.saving = false;
      this.loadSampleByUuid();
    }, 1000);
  }

  onSaveParameterValue(
    e,
    item,
    parameter,
    currentSample,
    allocation,
    type?: string
  ) {
    e.stopPropagation();
    this.savingMessage[parameter?.uuid] = true;
    this.saving = true;
    if (!type || type !== "file") {
      const results = this.values[parameter?.uuid]
        ? (
            (!this.values[parameter?.uuid][0]?.value
              ? [{ value: this.values[parameter?.uuid] }]
              : this.values[parameter?.uuid]
            )?.map((valueOption) => {
              if (valueOption?.value) {
                return {
                  concept: {
                    uuid: parameter?.uuid,
                  },
                  testAllocation: {
                    uuid: allocation?.allocationUuid,
                  },
                  valueNumeric: parameter?.numeric ? valueOption?.value : null,
                  valueText:
                    !parameter?.numeric && parameter?.answers?.length == 0
                      ? valueOption?.value
                      : null,
                  valueCoded:
                    parameter.answers && parameter.answers.length > 0
                      ? {
                          uuid: valueOption?.value,
                        }
                      : null,
                  abnormal: this.values[parameter?.uuid + "-abnormal"]
                    ? this.values[parameter?.uuid + "-abnormal"]
                    : false,
                  additionalReqTimeLimit: this.getTimeConfigs(
                    item?.order?.concept?.uuid
                  )?.additionalReqTimeLimit,
                  standardTAT: this.getTimeConfigs(item?.order?.concept?.uuid)
                    ?.standardTAT,
                  urgentTAT: this.getTimeConfigs(item?.order?.concept?.uuid)
                    ?.urgentTAT,
                };
              }
            }) || []
          )?.filter((data) => data)
        : [];

      const resultsComments = {
        status: this.amendmentRemarks
          ? "AMENDED"
          : this.values[item?.uuid + "-comment"]
          ? "ANSWER DESCRIPTION"
          : "COMMENT",
        category: this.amendmentRemarks ? "AMENDED" : "COMMENT",
        remarks: this.amendmentRemarks
          ? this.amendmentRemarks
          : this.values[item?.uuid + "-comment"]
          ? this.values[item?.uuid + "-comment"]
          : "NO DESCRPTION FOR PARAMETER",
        user: {
          uuid: this.userUuid,
        },
        testAllocation: {
          uuid: allocation.allocationUuid,
        },
      };
      this.store.dispatch(
        saveLabTestResults({
          results: results,
          comments: resultsComments,
          sampleDetails: currentSample,
          concept: null,
          allocation: null,
          isResultAnArray: true,
        })
      );
      this.getLoadingAndTestOrdersData(parameter);
    } else {
      // Attachment
      this.savingLabResultsState$ = of(false);
      let data = new FormData();
      const jsonData = {
        concept: parameter?.uuid,
        person: this.sample?.patient?.uuid,
        encounter:
          this.ordersKeyedByConcepts[item?.order?.concept?.uuid]?.encounter
            ?.uuid,
        obsDatetime: new Date(),
        voided: false,
        status: "PRELIMINARY",
        comment: this.values[parameter?.uuid + "-comment"],
      };
      data.append(
        "file",
        this.file ||
          this.files.filter(
            (fileObject) => fileObject.parameterUuid === parameter?.uuid
          )[0]?.valueFile
      );
      data.append("json", JSON.stringify(jsonData));

      // void first the existing observation
      if (
        this.obsKeyedByConcepts[parameter?.uuid] &&
        this.obsKeyedByConcepts[parameter?.uuid]?.value
      ) {
        const existingObs = {
          concept: parameter?.uuid,
          person: this.sample?.patient?.uuid,
          obsDatetime:
            this.obsKeyedByConcepts[parameter?.uuid]?.encounter?.obsDatetime,
          encounter: this.obsKeyedByConcepts[parameter?.uuid]?.encounter?.uuid,
          status: "PRELIMINARY",
          comment: this.obsKeyedByConcepts[parameter?.uuid]?.encounter?.comment,
        };
        this.httpClient
          .post(
            `../../../openmrs/ws/rest/v1/obs/${
              this.obsKeyedByConcepts[parameter?.uuid]?.uuid
            }`,
            {
              ...existingObs,
              voided: true,
            }
          )
          .subscribe((response) => {
            if (response) {
              this.savingLabResultsState$ = of(false);
            }
          });
      }
      this.httpClient
        .post(`../../../openmrs/ws/rest/v1/obs`, data)
        .subscribe((response: any) => {
          if (response) {
            this.obsKeyedByConcepts[parameter?.uuid] = {
              ...response,
              uri: response?.value?.links
                ? response?.value?.links?.uri?.replace("http", "https")
                : null,
            };

            this.savingLabResultsState$ = of(false);
          }
        });
    }
  }

  getLoadingAndTestOrdersData(parameter?: any): void {
    setTimeout(() => {
      this.saving = false;
      this.loadSampleByUuid();
      this.savingLabResultsState$ = this.store.select(
        getSavingLabTestResultsState
      );

      this.savingLabResultsState$.pipe(take(1)).subscribe((state) => {
        if (state) {
          if (parameter) {
            this.savingMessage[parameter?.uuid] = null;
          }
        }
      });
      this.currentSample$ = this.store.select(
        getFormattedLabSampleBySampleIdentifier,
        {
          sampleIdentifier: this.sample?.id,
        }
      );

      this.testOrders$ = this.store.select(
        getFormattedLabSampleOrdersBySampleIdentifier,
        {
          sampleIdentifier: this.sample?.id,
        }
      );
    }, 1000);
  }

  onGetFileInfo(data, item, parameter, provider, attachmentConceptUuid) {
    const obs = {
      person: provider?.personUuid,
      concept: attachmentConceptUuid,
      obsDatetime: new Date().toISOString(),
      encounter: item?.order?.encounterUuid,
      value: data,
    };

    this.dataService.saveObs(obs).subscribe((response) => {
      // console.log('obs saved successfully', response);
    });
  }

  getAllKeysWithData(data) {
    return _.filter(Object.keys(data), (key) => {
      if (data[key]) {
        return key;
      }
    });
  }

  getUniqueOrders(orders) {
    let formattedOrders = _.map(orders, (order) => {
      return {
        ...order,
        conceptName: order?.concept?.name,
      };
    });
    return _.uniqBy(formattedOrders, "conceptName");
  }

  onSaveSignOff(e, item, signOff, currentSample, allocation) {
    e.stopPropagation();
    this.savingMessage[item?.concept?.uuid + "-first"] =
      signOff == "second" ? false : true;
    this.savingMessage[item?.order?.concept?.uuid + "-" + signOff] = true;

    const approvalStatus = {
      status: "APPROVED",
      remarks: signOff == "first" ? "APPROVED" : "SECOND_APPROVAL",
      user: {
        uuid: this.userUuid,
      },
      testAllocation: {
        uuid: allocation?.allocationUuid,
      },
    };
    this.store.dispatch(
      saveLabTestResultsStatus({
        resultsStatus: approvalStatus,
        sampleDetails: currentSample,
        concept: item?.order?.concept,
        allocation,
      })
    );

    this.savingLabResultsStatusState$ = this.store.select(
      getSavingLabTestResultsStatusState
    );

    this.savingLabResultsStatusState$.pipe(take(1)).subscribe((state) => {
      if (state) {
        this.savingMessage[item?.concept?.uuid + "-" + signOff] = null;
      }
    });

    this.getLoadingAndTestOrdersData();
  }

  onSaveSignOffForParameter(
    e,
    item,
    parameter,
    signOff,
    currentSample,
    allocation
  ) {
    e.stopPropagation();

    this.savingMessage[parameter?.uuid + "-first"] =
      signOff == "second" ? false : true;
    this.savingMessage[parameter?.uuid + "-" + signOff] = true;
    const approvalStatus = {
      status: "APPROVED",
      remarks: signOff == "first" ? "APPROVED" : "SECOND_APPROVAL",
      user: {
        uuid: this.userUuid,
      },
      testAllocation: {
        uuid: allocation?.allocationUuid,
      },
    };
    this.store.dispatch(
      saveLabTestResultsStatus({
        resultsStatus: approvalStatus,
        sampleDetails: currentSample,
        concept: item?.order?.concept,
        allocation,
      })
    );

    this.savingLabResultsStatusState$ = this.store.select(
      getSavingLabTestResultsStatusState
    );
    this.savingLabResultsStatusState$.pipe(take(1)).subscribe((state) => {
      if (state) {
        this.savingMessage[parameter?.uuid + "-" + signOff] = null;
      }
    });

    this.getLoadingAndTestOrdersData();
  }

  onSaveSignOffForParameters(e, item, signOff, currentSample, allocation) {
    e.stopPropagation();

    const approvalStatuses = item?.order?.concept?.setMembers
      ?.map((parameter: any) => {
        this.savingMessage[parameter?.uuid + "-first"] =
          signOff == "second" ? false : true;
        this.savingMessage[parameter?.uuid + "-" + signOff] = true;
        const approvalStatus = {
          status: "APPROVED",
          remarks: signOff == "first" ? "APPROVED" : "SECOND_APPROVAL",
          user: {
            uuid: this.userUuid,
          },
          testAllocation: {
            uuid: item?.allocationsPairedBySetMember[parameter?.uuid]
              ?.allocationUuid,
          },
        };
        if (
          item?.allocationsPairedBySetMember[parameter?.uuid]?.results?.length >
          0
        ) {
          return approvalStatus;
        }
      })
      ?.filter((approvalStatus) => approvalStatus);

    this.store.dispatch(
      saveLabTestResultsStatus({
        resultsStatus: approvalStatuses,
        sampleDetails: currentSample,
        concept: item?.order?.concept,
        allocation,
        isResultAnArray: true,
      })
    );

    this.savingLabResultsStatusState$ = this.store.select(
      getSavingLabTestResultsStatusState
    );

    this.getLoadingAndTestOrdersData();
  }

  rejectResults(e, item, currentSample, allocation) {
    e.stopPropagation();
    this.dialog
      .open(RejectAnswerModalComponent, {
        data: null,
        width: "50%",
        height: "auto",
        disableClose: false,
        panelClass: "custom-dialog-container",
      })
      .afterClosed()
      .subscribe((feedback) => {
        if (feedback && feedback.length > 1) {
          const rejectStatus = {
            status: "REJECTED",
            category: "REJECTED",
            remarks: feedback,
            user: {
              uuid: this.userUuid,
            },
            testAllocation: {
              uuid: allocation.allocationUuid,
            },
          };
          this.store.dispatch(
            saveLabTestResultsStatus({
              resultsStatus: rejectStatus,
              sampleDetails: currentSample,
              concept: item?.order?.concept,
              allocation,
            })
          );

          setTimeout(() => {
            this.loadSampleByUuid();
          }, 100);
        }
      });

    this.getLoadingAndTestOrdersData();
  }

  amendResults(e, itemUuid) {
    e?.stopPropagation();
    this.amendUuid = itemUuid;
  }

  rejectFirstApproval(e, item, currentSample, allocation) {
    this.dialog
      .open(RejectAnswerModalComponent, {
        data: null,
        width: "50%",
        height: "auto",
        disableClose: false,
        panelClass: "custom-dialog-container",
      })
      .afterClosed()
      .subscribe((feedback) => {
        if (feedback && feedback.length > 1) {
          const rejectStatus = {
            status: "REJECTED",
            catetory: "REJECTED",
            remarks: feedback,
            user: {
              uuid: this.userUuid,
            },
            testAllocation: {
              uuid: allocation?.allocationUuid,
            },
          };
          this.store.dispatch(
            saveLabTestResultsStatus({
              resultsStatus: rejectStatus,
              sampleDetails: currentSample,
              concept: item?.order?.concept,
              allocation,
            })
          );

          setTimeout(() => {
            this.loadSampleByUuid();
          }, 100);
        }
      });

    this.getLoadingAndTestOrdersData();
  }

  fileSelection(event, parameter): void {
    event.stopPropagation();
    // const fileInputElement: HTMLElement = document.getElementById(
    //   "file-selector-" + parameter?.uuid
    // );
    this.file = event.target.files[0];
    this.values[parameter?.uuid] = this.file;
    this.values[parameter?.uuid + "-comment"] = "Attachment";
  }

  onCheckToSetValue(event, sample, item, parameter, allocation): void {
    const resultObject = {
      concept: {
        uuid: parameter?.uuid,
      },
      testAllocation: {
        uuid: allocation?.allocationUuid,
      },
      valueNumeric: parameter?.numeric ? this.values[parameter?.uuid] : null,
      valueText:
        !parameter?.numeric && parameter?.answers?.length == 0
          ? this.values[parameter?.uuid]
          : null,

      valueCoded:
        parameter.answers && parameter.answers.length > 0
          ? {
              uuid: this.values[parameter?.uuid],
            }
          : null,
      abnormal: this.values[parameter?.uuid + "-abnormal"]
        ? this.values[parameter?.uuid + "-abnormal"]
        : false,
      additionalReqTimeLimit: this.getTimeConfigs(item?.order?.concept?.uuid)
        ?.additionalReqTimeLimit,
      standardTAT: this.getTimeConfigs(item?.order?.concept?.uuid)?.standardTAT,
      urgentTAT: this.getTimeConfigs(item?.order?.concept?.uuid)?.urgentTAT,
    };

    const resultsComments = {
      status: this.amendmentRemarks
        ? "AMENDED"
        : this.values[item?.uuid + "-comment"]
        ? "ANSWER DESCRIPTION"
        : "COMMENT",
      category: this.amendmentRemarks ? "AMENDED" : "COMMENT",
      remarks: this.amendmentRemarks
        ? this.amendmentRemarks
        : this.values[item?.uuid + "-comment"]
        ? this.values[item?.uuid + "-comment"]
        : "NO DESCRPTION FOR PARAMETER",
      user: {
        uuid: this.userUuid,
      },
      testAllocation: {
        uuid: allocation.allocationUuid,
      },
    };
    this.bulkResultsToSave = event?.checked
      ? [
          ...this.bulkResultsToSave,
          {
            sampleId: sample?.id,
            resultsData: resultObject,
            resultComments: resultsComments,
          },
        ]
      : this.bulkResultsToSave?.filter(
          (result) => result?.sampleId != sample?.id
        ) || [];
  }

  onSaveAll(event: Event, values: any, currentSample): void {
    event.stopPropagation();
    this.hasFedResults =
      (Object.keys(values)?.filter((key) => values[key]) || [])?.length > 0;
    if (this.hasFedResults) {
      this.saveAllMessage = null;

      //Save files first
      this.saveFilesAsObservations(this.files);

      const testAllocations = _.flatten(
        currentSample?.orders?.map((order) =>
          order?.testAllocations?.map((alloc) => {
            return {
              ...alloc,
              parameter: (order?.order?.concept?.setMembers?.filter(
                (setMember) => setMember?.uuid === alloc?.parameterUuid
              ) || [])[0],
            };
          })
        ) || []
      );
      const resultsToSave = _.flatten(
        testAllocations
          ?.map((testAllocation) => {
            if (
              this.values[testAllocation?.parameterUuid] &&
              !this.values[testAllocation?.parameterUuid][0]?.value
            ) {
              return {
                concept: {
                  uuid: testAllocation?.parameterUuid,
                },
                testAllocation: {
                  uuid: testAllocation?.allocationUuid,
                },
                valueNumeric: testAllocation?.parameter?.numeric
                  ? this.values[testAllocation?.parameterUuid]
                  : null,
                valueText:
                  !testAllocation?.parameter?.numeric &&
                  testAllocation?.parameter?.answers?.length == 0
                    ? this.values[testAllocation?.parameterUuid]
                    : null,

                valueCoded:
                  testAllocation?.parameter?.answers &&
                  testAllocation?.parameter?.answers.length > 0
                    ? {
                        uuid: this.values[testAllocation?.parameterUuid],
                      }
                    : null,
                abnormal: this.values[
                  testAllocation?.parameterUuid + "-abnormal"
                ]
                  ? this.values[testAllocation?.parameterUuid + "-abnormal"]
                  : false,
                additionalReqTimeLimit: this.getTimeConfigs(
                  testAllocation?.order?.concept?.uuid
                )?.additionalReqTimeLimit,
                standardTAT: this.getTimeConfigs(
                  testAllocation?.order?.concept?.uuid
                )?.standardTAT,
                urgentTAT: this.getTimeConfigs(
                  testAllocation?.order?.concept?.uuid
                )?.urgentTAT,
              };
            } else if (
              this.values[testAllocation?.parameterUuid] &&
              this.values[testAllocation?.parameterUuid][0]?.value
            ) {
              return this.values[testAllocation?.parameterUuid]?.map(
                (valueOption) => {
                  return {
                    concept: {
                      uuid: testAllocation?.parameterUuid,
                    },
                    testAllocation: {
                      uuid: testAllocation?.allocationUuid,
                    },
                    valueNumeric: testAllocation?.parameter?.numeric
                      ? this.values[testAllocation?.parameterUuid]
                      : null,
                    valueText:
                      !testAllocation?.parameter?.numeric &&
                      testAllocation?.parameter?.answers?.length == 0
                        ? this.values[testAllocation?.parameterUuid]
                        : null,

                    valueCoded:
                      testAllocation?.parameter?.answers &&
                      testAllocation?.parameter?.answers.length > 0
                        ? {
                            uuid: valueOption?.value,
                          }
                        : null,
                    abnormal: this.values[
                      testAllocation?.parameterUuid + "-abnormal"
                    ]
                      ? this.values[testAllocation?.parameterUuid + "-abnormal"]
                      : false,
                    additionalReqTimeLimit: this.getTimeConfigs(
                      testAllocation?.order?.concept?.uuid
                    )?.additionalReqTimeLimit,
                    standardTAT: this.getTimeConfigs(
                      testAllocation?.order?.concept?.uuid
                    )?.standardTAT,
                    urgentTAT: this.getTimeConfigs(
                      testAllocation?.order?.concept?.uuid
                    )?.urgentTAT,
                  };
                }
              );
            }
          })
          ?.filter((allocWithResults) => allocWithResults)
      );

      this.store.dispatch(
        saveLabTestResults({
          results: resultsToSave,
          comments: [],
          sampleDetails: currentSample,
          concept: null,
          allocation: null,
          isResultAnArray: true,
        })
      );
      this.getLoadingAndTestOrdersData();
    } else {
      this.saveAllMessage = "Please feed results first";
    }
  }

  saveFilesAsObservations(fileObjects: any[]) {
    fileObjects.forEach((file) => {
      this.savingLabResultsState$ = of(false);
      let data = new FormData();
      const jsonData = {
        concept: file?.parameterUuid,
        person: this.sample?.patient?.uuid,
        encounter:
          this.ordersKeyedByConcepts[file?.item?.order?.concept?.uuid]
            ?.encounter?.uuid,
        obsDatetime: new Date(),
        voided: false,
        status: "PRELIMINARY",
        comment: this.values[file?.parameterUuid + "-comment"],
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
          person: this.sample?.patient?.uuid,
          obsDatetime:
            this.obsKeyedByConcepts[file?.parameterUuid]?.encounter
              ?.obsDatetime,
          encounter:
            this.obsKeyedByConcepts[file?.parameterUuid]?.encounter?.uuid,
          status: "PRELIMINARY",
          comment:
            this.obsKeyedByConcepts[file?.parameterUuid]?.encounter?.comment,
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
              this.savingLabResultsState$ = of(false);
            }
          });
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

            this.savingLabResultsState$ = of(false);
          }
        });
    });
  }

  tabSelection(matTabEvent: MatTabChangeEvent): void {
    this.selectedIndex = matTabEvent.index;
  }
}
