import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { select, Store } from "@ngrx/store";
import { Observable, of, zip } from "rxjs";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { DrugOrderError } from "src/app/shared/resources/order/constants/drug-order-error.constant";
import {
  DrugOrder,
  DrugOrderObject,
} from "src/app/shared/resources/order/models/drug-order.model";
import { DrugOrdersService } from "src/app/shared/resources/order/services";
import { Patient } from "src/app/shared/resources/patient/models/patient.model";
import { Visit } from "src/app/shared/resources/visits/models/visit.model";
import { loadActiveVisit } from "src/app/store/actions/visit.actions";
import { AppState } from "src/app/store/reducers";
import {
  getCurrentLocation,
  getLocationsByTagName,
} from "src/app/store/selectors";
import { getCurrentPatient } from "src/app/store/selectors/current-patient.selectors";
import { getProviderDetails } from "src/app/store/selectors/current-user.selectors";
import { getActiveVisit } from "src/app/store/selectors/visit.selectors";
import { ConceptsService } from "../../resources/concepts/services/concepts.service";
import { DrugsService } from "../../resources/drugs/services/drugs.service";
import { OrdersService } from "../../resources/order/services/orders.service";
import { VisitsService } from "../../resources/visits/services";
import { LocationService } from "src/app/core/services";
import { map, tap } from "rxjs/operators";
import { ConceptGet } from "../../resources/openmrs";
import { SharedConfirmationDialogComponent } from "../../components/shared-confirmation-dialog/shared-confirmation-dialog.component";
import { ItemPriceService } from "../../services/item-price.service";

@Component({
  selector: "app-dispension-form",
  templateUrl: "./dispension-form.component.html",
  styleUrls: ["./dispension-form.component.scss"],
})
export class DispensingFormComponent implements OnInit {
  drugOrder: DrugOrderObject;

  formValues: { [name: string]: FormValue } = {};
  drugOrderData: any;
  savingOrder: boolean;
  savingOrderSuccess: boolean;
  savingError: string;
  savedOrder: DrugOrder;
  dispensingLocations$: Observable<any>;
  countOfDispensingFormFieldsWithValues: number = 0;
  generalPrescriptionOrderType$: Observable<any>;
  generalPrescriptionEncounterType$: Observable<any>;
  useGeneralPrescription$: Observable<any>;
  orderFrequencies$: Observable<any>;
  currentPatient$: Observable<Patient>;
  currentLocation$: Observable<any>;
  currentVisit$: Observable<any>;
  provider$: Observable<any>;
  dosingUnitsSettings$: Observable<any>;
  dosingUnits$: Observable<any>;
  durationUnitsSettings$: Observable<any>;
  durationUnits$: Observable<any>;
  drugRoutes$: Observable<any>;
  drugRoutesSettings$: Observable<any>;
  generalPrescriptionDurationConcept$: Observable<any>;
  generalPrescriptionDoseConcept$: Observable<any>;
  generalPrescriptionFrequencyConcept$: Observable<any>;
  dosingFrequencies$: Observable<any>;
  drugsToBeDispensed$: Observable<any>;
  genericPrescriptionOrderType: any;
  @Output() updateConsultationOrder = new EventEmitter();

  intermediateVisit$: Observable<any>; // TODO: Change this to use current visit
  errors: any[] = [];
  conceptFields$: Observable<any>;
  genericPrescriptionConceptUuids$: Observable<any>;
  drugOrderConceptDetails$: Observable<ConceptGet>;
  strengthConceptUuid$: Observable<string>;
  useSpecificDrugPrescription$: Observable<any>;
  specificDrugConceptUuid$: Observable<any>;
  prescribedMedication: any;
  drugPrice: number;
  showPrice: boolean;
  previousVisit$: Observable<any>;

  constructor(
    private drugOrderService: DrugOrdersService,
    private drugsService: DrugsService,
    private orderService: OrdersService,
    private dialogRef: MatDialogRef<DispensingFormComponent>,
    private dialog: MatDialog,
    private systemSettingsService: SystemSettingsService,
    private conceptsService: ConceptsService,
    private store: Store<AppState>,
    private visitService: VisitsService,
    private locationService: LocationService,
    private conceptService: ConceptsService,
    private itemPricesService: ItemPriceService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      drugOrder: any;
      patientUuid: string;
      patient: any;
      orderType: any;
      fromDispensing: boolean;
      showAddButton: boolean;
      visit: Visit;
      location: any;
      encounterUuid: string;
      drugInstructions: string;
      useGenericPrescription?: any;
      forConsultation: boolean;
    }
  ) {}

  get isValid(): boolean {
    return (
      this.formValues["drug"]?.isValid &&
      (this.formValues["duration"]?.isValid ||
        this.drugOrder?.duration !== null) &&
      (this.formValues["route"]?.isValid || this.drugOrder?.route !== null) &&
      (this.formValues["quantity"]?.isValid ||
        this.drugOrder?.quantity !== null) &&
      (this.formValues["dose"]?.isValid ||
        (this.drugOrder?.dose !== null &&
          this.drugOrder?.doseUnits !== null &&
          this.drugOrder?.frequency !== null))
    );
  }

  get genericDrugPrescription(): string {
    return this.data?.drugOrder?.obs
      ? "<b>" +
          this.data?.drugOrder?.concept?.display +
          "</b> " +
          (
            Object.keys(this.data?.drugOrder?.obs).map(
              (key) => this.data?.drugOrder?.obs[key]?.value
            ) || []
          ).join("; ")
      : "";
  }

  ngOnInit() {
    this.getVisitByUuid(this.data?.visit?.uuid);
    this.previousVisit$ = this.visitService
      .getLastPatientVisit(this.data?.patientUuid, false)
      .pipe(
        map((response) => (response?.length > 0 ? response[0]?.visit : {}))
      );
    this.drugOrder = this.data?.drugOrder;
    this.dispensingLocations$ = this.locationService
      .getLocationsByTagName("Dispensing+Unit")
      .pipe(
        map((response) => {
          return response;
        })
      );

    this.strengthConceptUuid$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "iCare.clinic.genericPrescription.strength.1"
      );
    this.useSpecificDrugPrescription$ = this.systemSettingsService
      .getSystemSettingsByKey(
        "iCare.clinic.genericPrescription.useSpecificDrug"
      )
      .pipe(
        tap((response) => {
          if (response === "none") {
            this.errors = [
              ...this.errors,
              {
                error: {
                  message:
                    "Generic Use Specific drug Config is missing, Set 'iCare.clinic.genericPrescription.useSpecificDrug' or Contact IT (Close to continue)",
                },
                type: "warning",
              },
            ];
          }
        })
      );

    this.specificDrugConceptUuid$ = this.systemSettingsService
      .getSystemSettingsByKey(
        "iCare.clinic.genericPrescription.specificDrugConceptUuid"
      )
      .pipe(
        tap((response) => {
          if (response === "none") {
            this.errors = [
              ...this.errors,
              {
                error: {
                  message:
                    "Generic Use Specific drug Concept config is missing, Set 'iCare.clinic.genericPrescription.specificDrugConceptUuid' or Contact IT (Close to continue)",
                },
                type: "warning",
              },
            ];
          } else {
            this.prescribedMedication = this.drugOrder?.obs[response]?.value;
          }
        })
      );

    this.generalPrescriptionEncounterType$ = this.systemSettingsService
      .getSystemSettingsByKey("iCare.clinic.genericPrescription.encounterType")
      .pipe(
        map((response) => {
          if (response?.error) {
            this.errors = [...this.errors, response.error];
          }
          if (response === "none") {
            this.errors = [
              ...this.errors,
              {
                error: {
                  message:
                    "Generic Prescription EncounterType Config is missing, Set 'iCare.clinic.genericPrescription.encounterType' or Contact IT",
                },
              },
            ];
          }
          return response;
        })
      );
    this.generalPrescriptionOrderType$ = this.systemSettingsService
      .getSystemSettingsByKey("iCare.clinic.genericPrescription.orderType")
      .pipe(
        map((response) => {
          if (response?.error) {
            this.errors = [...this.errors, response.error];
          }
          if (response === "none") {
            this.errors = [
              ...this.errors,
              {
                error: {
                  message:
                    "Generic Prescription OrderType Config is missing, Set 'iCare.clinic.genericPrescription.orderType' or Contact IT",
                },
              },
            ];
          }
          return response;
        })
      );
    this.useGeneralPrescription$ = this.systemSettingsService
      .getSystemSettingsByKey("iCare.clinic.useGeneralPrescription")
      .pipe(
        map((response) => {
          if (response?.error) {
            this.errors = [...this.errors, response.error];
          }
          return response;
        })
      );
    this.dosingUnitsSettings$ = this.systemSettingsService
      .getSystemSettingsByKey("order.drugDosingUnitsConceptUuid")
      .pipe(
        map((response) => {
          if (response?.error) {
            this.errors = [...this.errors, response.error];
          }
          return response;
        })
      );
    this.genericPrescriptionConceptUuids$ = this.systemSettingsService
      .getSystemSettingsMatchingAKey("iCare.clinic.genericPrescription.field")
      .pipe(
        map((response: any) => {
          if (response?.error) {
            this.errors = [...this.errors, response.error];
          }
          return response;
        })
      );
    this.durationUnitsSettings$ = this.systemSettingsService
      .getSystemSettingsByKey("order.durationUnitsConceptUuid")
      .pipe(
        map((response) => {
          if (response?.error) {
            this.errors = [...this.errors, response.error];
          }
          return response;
        })
      );
    this.drugRoutesSettings$ = this.systemSettingsService
      .getSystemSettingsByKey("order.drugRoutesConceptUuid")
      .pipe(
        map((response) => {
          if (response?.error) {
            this.errors = [...this.errors, response.error];
          }
          return response;
        })
      );
    this.generalPrescriptionDurationConcept$ = this.systemSettingsService
      .getSystemSettingsByKey("iCare.clinic.prescription.duration")
      .pipe(
        map((response) => {
          if (response?.error) {
            this.errors = [...this.errors, response.error];
          }
          return response;
        })
      );
    this.generalPrescriptionDoseConcept$ = this.systemSettingsService
      .getSystemSettingsByKey("iCare.clinic.prescription.dose")
      .pipe(
        map((response) => {
          if (response?.error) {
            this.errors = [...this.errors, response.error];
          }
          return response;
        })
      );
    this.generalPrescriptionFrequencyConcept$ = this.systemSettingsService
      .getSystemSettingsByKey("iCare.clinic.prescription.frequency")
      .pipe(
        map((response) => {
          if (response?.error) {
            this.errors = [...this.errors, response.error];
          }
          return response;
        })
      );
    this.currentPatient$ = this.store.pipe(select(getCurrentPatient));
    this.currentLocation$ = this.store.pipe(select(getCurrentLocation(false)));
    this.currentVisit$ = this.store.pipe(select(getActiveVisit));
    this.provider$ = this.store.select(getProviderDetails);

    this.drugOrderConceptDetails$ = this.data?.drugOrder
      ? this.conceptService.getConceptDetailsByUuid(
          this.data?.drugOrder?.concept?.uuid,
          "custom:(uuid,display,setMembers:(uuid,display))"
        )
      : of([]);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onGetEnterKeyResponsedFields(
    keys: any,
    specificDrugConceptUuid?: string,
    isEnsured?: boolean
  ): void {
    if (keys["quantity"]) {
      this.onUpdateOrder(null, specificDrugConceptUuid, isEnsured);
    }
  }

  onChangeDrugQuantity(quantity) {
    this.showPrice = false;
    this.drugOrder = { ...(this.drugOrder || ({} as any)), quantity };
    const pricePayload = {
      visitUuid: this.data.visit.uuid,
      drugUuid: this.prescribedMedication,
    };
    if (
      this.drugOrder.quantity?.toString().length > 0 &&
      this.drugOrder.quantity !== 0
    ) {
      this.itemPricesService
        .getItemPrice(pricePayload)
        .pipe(
          tap((response: any) => {
            this.showPrice = true;
            this.drugPrice = this.drugOrder.quantity * response?.price;
          })
        )
        .subscribe();
    }
  }

  onOrderingDrug(drugOrder: any) {
    this.dialogRef.close({
      drugOrder: DrugOrder.getOrderForSaving({
        ...drugOrder.order,
        action: drugOrder.order?.action || "NEW",
        providerUuid: drugOrder?.provider?.uuid,
      }),
    });
  }

  onFormUpdate(formData: {
    formName: string;
    formValue: FormValue;
    drugOrder: any;
    isTheOrderFromDoctor: boolean;
    patient: Patient;
    provider: any;
    orderType;
    countOfDispensingFormFieldsWithValues: number;
  }) {
    this.savingError = undefined;
    const { drugOrder, isTheOrderFromDoctor, patient, provider, orderType } =
      formData;

    this.formValues = {
      ...this.formValues,
      [formData?.formName]: formData.formValue,
    };

    this.countOfDispensingFormFieldsWithValues =
      formData.countOfDispensingFormFieldsWithValues;

    this.drugOrderData = {
      order: drugOrder,
      isTheOrderFromDoctor,
      patient,
      provider,
      orderType,
    };
  }

  onOrderSaved(saved, visit): void {
    this.getVisitByUuid(visit?.uuid);
  }

  getVisitByUuid(uuid: string): void {
    this.intermediateVisit$ = this.visitService
      .getVisitDetailsByVisitUuid(uuid, {
        v: "custom:(uuid,display,patient,encounters:(uuid,display,obs,orders),attributes)",
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  onUpdateOrder(
    e: Event,
    specificDrugConceptUuid?: string,
    isEnsured?: boolean
  ) {
    if (e) {
      e.stopPropagation();
    }
    this.dialog
      .open(SharedConfirmationDialogComponent, {
        width: "20%",
        data: {
          header: `Are you sure to save and complete medication verification?. <br> Note: This action is <b>irrevesible</b>`,
        },
      })
      .afterClosed()
      .subscribe((shouldConfirm) => {
        if (shouldConfirm) {
          this.savingOrder = true;
          this.savingOrderSuccess = false;
          this.savingError = null;
          this.savedOrder = null;

          const order = this.drugOrderData?.order || {};
          this.drugsService
            .getDrug(order?.obs[specificDrugConceptUuid]?.value)
            .subscribe((response) => {
              if (response) {
                let formattedOrder = {
                  ...order,
                  orderType: "iCARESTS-PRES-1111-1111-525400e4297f",
                  drug: {
                    uuid: response?.uuid,
                  },
                  concept: {
                    uuid: response?.concept?.uuid,
                  },
                  action: order?.action || "NEW",
                  urgency: "ROUTINE",
                  location: localStorage.getItem("currentLocation")
                    ? JSON.parse(localStorage.getItem("currentLocation"))[
                        "uuid"
                      ]
                    : null,
                  providerUuid: this.drugOrderData?.provider?.uuid,
                  encounterUuid: this.data?.fromDispensing
                    ? this.data?.drugOrder?.encounter?.uuid
                    : JSON.parse(localStorage.getItem("patientConsultation"))[
                        "encounterUuid"
                      ],
                  patientUuid: this.data?.patient
                    ? this.data?.patient?.uuid
                    : order?.patientUuid
                    ? order?.patientUuid
                    : this.data?.patientUuid,
                };

                if (isEnsured) {
                  formattedOrder = {
                    ...formattedOrder,
                    status: "EMPTY",
                    remarks: "Control status",
                  };
                }
                // console.log("this.data?.drugOrder", this.data?.drugOrder);
                this.drugOrderService
                  .saveDrugOrder(
                    DrugOrder.getOrderForSaving(formattedOrder),
                    "PRESCRIBE",
                    this.data.visit,
                    order?.location?.uuid ||
                      JSON.parse(localStorage.getItem("currentLocation"))[
                        "uuid"
                      ],
                    this.drugOrderData?.provider?.uuid
                  )
                  .subscribe(
                    (res) => {
                      this.getVisitByUuid(this.data?.visit?.uuid);
                      if (res?.message || res?.stackTrace) {
                        this.savingOrder = false;
                        this.errors = [
                          ...this.errors,
                          {
                            error: {
                              message:
                                res?.message ||
                                "Error occurred while connecting to the server",
                              detail: res?.stackTrace
                                ? JSON.stringify(res?.stackTrace)
                                : "",
                            },
                          },
                        ];
                      }
                      if (this.data?.useGenericPrescription && !res?.message) {
                        const genericOrderPayload = {
                          uuid: order?.uuid,
                          fulfillerStatus: "RECEIVED",
                          encounter: order?.encounter?.uuid,
                        };
                        this.orderService
                          .updateOrdersViaEncounter([genericOrderPayload])
                          .subscribe({
                            next: (order) => {
                              this.savingOrder = false;
                              if (this.data.fromDispensing) {
                                this.savingOrderSuccess = true;
                                this.savedOrder = new DrugOrder(res);
                                setTimeout(() => {
                                  this.dialogRef.close({
                                    action: "ORDER_SAVED",
                                    drugOrder: this.savedOrder,
                                  });
                                }, 200);
                              }
                              return order;
                            },
                            error: (error) => {
                              this.savingOrder = false;
                              return error;
                            },
                          });
                      }
                      // this.dialogRef.close({
                      //   action: 'ORDER_SAVED',
                      //   drugOrder: this.savedOrder,
                      // });
                      // this.store.dispatch(
                      //   loadActiveVisit({
                      //     patientId: this.data?.patient
                      //       ? this.data?.patient?.uuid
                      //       : this.data?.patientUuid,
                      //   })
                      // );
                      // if (this.data?.useGenericPrescription && !res?.message) {
                      //   this.dialogRef.close();
                      // }
                    },
                    (errorResponse) => {
                      this.savingOrder = false;
                      this.savingError =
                        DrugOrderError[errorResponse?.error?.message] ||
                        (errorResponse?.error?.message || "")
                          .replace("[", "")
                          .replace("]", "");
                      if (errorResponse?.message) {
                        this.errors = [
                          ...this.errors,
                          {
                            error: {
                              message:
                                errorResponse?.message ||
                                "Error occurred while connecting to the server",
                              detail: errorResponse?.error || "",
                            },
                          },
                        ];
                      } else {
                        this.errors = [
                          ...this.errors,
                          errorResponse.error || {
                            error: {
                              message:
                                "Error occured while executing the command",
                            },
                          },
                        ];
                      }
                      this.savingOrderSuccess = false;
                    }
                  );

                this.onUpdateConsultationOrder();
              }
            });
        }
      });
  }

  onClearError(e: MouseEvent) {
    e.stopPropagation();
    this.savingError = undefined;
  }

  getDosingUnits(conceptUuid: string) {
    this.dosingUnits$ = this.conceptsService.getConceptDetailsByUuid(
      conceptUuid,
      `custom:(uuid,name,conceptClass:(uuid,display),setMembers:(uuid,display),answers:(uuid,display)`
    );
  }

  getDurationUnits(conceptUuid: string) {
    this.durationUnits$ = this.conceptsService.getConceptDetailsByUuid(
      conceptUuid,
      `custom:(uuid,name,conceptClass:(uuid,display),setMembers:(uuid,display),answers:(uuid,display)`
    );
  }

  getDrugRoutes(conceptUuid: string) {
    this.drugRoutes$ = this.conceptsService.getConceptDetailsByUuid(
      conceptUuid,
      `custom:(uuid,name,conceptClass:(uuid,display),setMembers:(uuid,display),answers:(uuid,display)`
    );
  }

  getDosingFrequencies(conceptUuid: string) {
    this.dosingFrequencies$ = this.conceptsService.getConceptDetailsByUuid(
      conceptUuid,
      `custom:(uuid,name,conceptClass:(uuid,display),setMembers:(uuid,display),answers:(uuid,display)`
    );
  }

  getDrugsByConceptUuid(conceptUuid: string) {
    this.drugsToBeDispensed$ =
      this.drugsService.getDrugsUsingConceptUuid(conceptUuid);
  }

  getConceptsAsFields(genericFieldsConcepts) {
    this.conceptFields$ = zip(
      ...genericFieldsConcepts.map((conceptSetting) =>
        this.conceptsService
          .getConceptDetailsByUuid(
            conceptSetting?.value ? conceptSetting?.value : conceptSetting,
            `custom:(uuid,display,name,datatype,set,conceptClass:(uuid,display),setMembers:(uuid,display),answers:(uuid,display)`
          )
          .pipe(
            map((response) => {
              if (response?.error) {
                this.errors = [...this.errors, response.error];
              }
              return {
                ...response,
                order: conceptSetting?.order,
              };
            })
          )
      )
    );
  }

  onCloseDialog(closeDialog: boolean): void {
    this.dialogRef.close(closeDialog);
  }

  onUpdateConsultationOrder() {
    // this.dialogRef.close({
    //   updateConsultationOrder: true,
    // });
    this.updateConsultationOrder.emit();
  }

  onLoadVisit(visit: any) {
    this.getVisitByUuid(visit.uuid);
  }
}
