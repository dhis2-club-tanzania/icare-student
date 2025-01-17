import { AfterViewInit, Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatRadioChange } from "@angular/material/radio";
import { Observable, of, zip } from "rxjs";
import {
  EQA_PERSON_DATA,
  NON_CLINICAL_PERSON_DATA,
} from "src/app/core/constants/non-clinical-person.constant";
import { formulateSamplesByDepartments } from "src/app/core/helpers/create-samples-as-per-departments.helper";
import { Location } from "src/app/core/models";
import { SystemSettingsWithKeyDetails } from "src/app/core/models/system-settings.model";
import {
  GenerateMetadataLabelsService,
  LocationService,
} from "src/app/core/services";
import { IdentifiersService } from "src/app/core/services/identifiers.service";
import { LabOrdersService } from "src/app/modules/laboratory/resources/services/lab-orders.service";
import { LabTestsService } from "src/app/modules/laboratory/resources/services/lab-tests.service";
import { RegistrationService } from "src/app/modules/registration/services/registration.services";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { ICARE_CONFIG } from "src/app/shared/resources/config";
import { DiagnosisService } from "src/app/shared/resources/diagnosis/services";
import { ConceptGetFull } from "src/app/shared/resources/openmrs";
import { VisitsService } from "src/app/shared/resources/visits/services";
import { SamplesService } from "src/app/shared/services/samples.service";
import { BarCodeModalComponent } from "../../../../../../shared/dialogs/bar-code-modal/bar-code-modal.component";

import { uniqBy, keyBy, omit, groupBy } from "lodash";
import { OrdersService } from "src/app/shared/resources/order/services/orders.service";
import { SampleRegistrationFinalizationComponent } from "../sample-registration-finalization/sample-registration-finalization.component";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import { tap } from "rxjs/operators";
import { OtherClientLevelSystemsService } from "src/app/modules/laboratory/resources/services/other-client-level-systems.service";
import { SharedConfirmationComponent } from "src/app/shared/components/shared-confirmation/shared-confirmation.component";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/reducers";
import { getLocationsByIds } from "src/app/store/selectors";
import { isMoment } from "moment";
import { PersonService } from "src/app/core/services/person.service";
import { formatDateToYYMMDD } from "src/app/shared/helpers/format-date.helper";
import { webSocket } from "rxjs/webSocket";
import { keySampleTypesByTestOrder } from "src/app/shared/helpers/sample-types.helper";

@Component({
  selector: "app-sample-in-batch-registration",
  templateUrl: "./sample-in-batch-registration.component.html",
  styleUrls: ["./sample-in-batch-registration.component.scss"],
})
export class SampleInBatchRegistrationComponent
  implements OnInit, AfterViewInit
{
  labSampleLabel$: Observable<string>;
  @Input() mrnGeneratorSourceUuid: string;
  @Input() preferredPersonIdentifier: string;
  @Input() provider: any;
  @Input() agencyConceptConfigs: any;
  @Input() referFromFacilityVisitAttribute: string;
  @Input() referringDoctorAttributes: SystemSettingsWithKeyDetails[];
  @Input() labSections: ConceptGetFull[];
  @Input() labNumberCharactersCount: string;
  @Input() testsFromExternalSystemsConfigs: any[];
  @Input() currentUser: any;
  @Input() allRegistrationFields: any;
  @Input() fieldsObject: any;
  @Input() batch: any;
  @Input() batchSampleCodeFormatReference: any;
  @Input() barcodeSettings: any;
  @Input() LISConfigurations: any;
  @Input() specimenSources: ConceptGetFull[];

  @Input() personEmailAttributeTypeUuid: string;
  @Input() personPhoneAttributeTypeUuid: string;

  departmentField: any = {};
  specimenDetailsFields: any;
  testsFormField: any = {};
  agencyFormField: any = {};
  labFormField: any = {};
  formData: any = {};
  testsUnderSpecimen$: Observable<any[]>;
  selectedSpecimenUuid: string;

  currentLocation: Location;
  patientPayload: any;
  personDetailsData: any;
  savingData: boolean = false;
  savingDataResponse: any = null;
  currentSampleLabel: string;
  selectedLab: any;

  referringDoctorFields: any[];

  patientFieldSetClosed: boolean = false;

  registrationCategory: string = "CLINICAL";

  receivedOnField: any;
  receivedByField: any;

  testOrders: any[] = [];
  groupedTestOrdersByDepartments: any[] = [];
  errorMessage: string = "";

  sampleLabelsUsedDetails: any[] = [];

  isRegistrationReady: boolean = true;

  sampleCollectedByField: any;
  sampleColectionDateField: any;

  broughtOnField: any;
  broughtByField: any;

  // TODO: Find a way to softcode this
  pimaCOVIDDetails: any;
  sampleInformation: boolean = true;
  clinicalData: boolean = true;
  referingDoctor: boolean = true;
  broughtBy: boolean = true;
  tests: boolean = true;
  minForReceivedOn: boolean = false;
  maxForCollectedOn: boolean;
  minForBroughtOn: boolean;
  receivedOnDateLatestValue: any;
  broughtOnDateLatestValue: any;
  collectedOnDateLatestValue: string;
  receivedOnTimeValid: boolean = true;
  broughtOnTimeValid: boolean = true;
  collectedOnTimeValid: boolean = true;
  broughtOnTime: any;
  collectedOnTime: any;
  receivedOnTime: any;
  maxForBroughtOn: boolean = true;
  selectedSystem: any;
  fromExternalSystem: boolean;
  transportCondition: Dropdown;
  transportationTemperature: Dropdown;
  labRequestPayload: any;
  savingLabRequest: boolean = false;
  labLocations$: Observable<any>;
  currentLabLocation: any;
  existingFields: any;
  fixedFields: any[] = [];
  staticFields: any[] = [];
  dynamicFields: any[] = [];
  formDataObject: any = {};
  fieldsWithValues: any = {};
  fieldWithValuesChanged: boolean = false;
  samplesCreated: any[] = [];
  getBatch: any[] = [];
  gettingBatches: boolean = false;
  patientUuid: any;
  personDetailsCategory: string;
  selectedClientData: any;
  identifierTypes: any[];
  batchSampleCode$: Observable<any[]>;
  batchSampleCode: any;
  useExistingBatchSample: boolean = false;
  connection: any;
  specimenSourcesKeyedByTestOrders: any = {};

  constructor(
    private samplesService: SamplesService,
    private labTestsService: LabTestsService,
    private locationService: LocationService,
    private registrationService: RegistrationService,
    private identifierService: IdentifiersService,
    private visitsService: VisitsService,
    private labOrdersService: LabOrdersService,
    private diagnosisService: DiagnosisService,
    private dialog: MatDialog,
    private orderService: OrdersService,
    private conceptService: ConceptsService,
    private otherSystemsService: OtherClientLevelSystemsService,
    private store: Store<AppState>,
    private personService: PersonService,
    private generateMetadataLabelsService: GenerateMetadataLabelsService
  ) {
    this.currentLocation = JSON.parse(localStorage.getItem("currentLocation"));
  }

  ngAfterViewInit(): void {
    this.connection = webSocket(this.barcodeSettings?.socketUrl);

    this.connection.subscribe({
      next: (msg) => console.log("message received: ", msg), // Called whenever there is a message from the server.
      error: (err) => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      complete: () => console.log("complete"), // Called when connection is closed (for whatever reason).
    });
  }

  ngOnInit(): void {
    this.specimenSourcesKeyedByTestOrders = keySampleTypesByTestOrder(
      this.specimenSources
    );
    if (localStorage.getItem("batch") && localStorage.getItem("batchSample")) {
      this.dialog
        .open(SharedConfirmationComponent, {
          minWidth: "40%",
          data: {
            modalTitle: `Last Batch Instance (${localStorage.getItem(
              "batchSampleCode"
            )})`,
            modalMessage: `You have the exisiting batch instance with code (${localStorage.getItem(
              "batchSampleCode"
            )}. Do you want to proceed using it?`,
            confirmationButtonText: "Proceed",
            cancelButtonText: "Stop",
          },
          disableClose: true,
        })
        .afterClosed()
        .subscribe((data) => {
          if (!data?.confirm) {
            localStorage.removeItem("batch");
            localStorage.removeItem("batchSample");
            localStorage.removeItem("batchSampleCode");
          }
        });
    } else {
      localStorage.removeItem("batch");
      localStorage.removeItem("batchSample");
      localStorage.removeItem("batchSampleCode");
      localStorage.setItem("batch", this.batch?.uuid);
    }

    this.assignFields();
    const userLocationsIds = JSON.parse(
      this.currentUser?.userProperties?.locations
    );
    this.labLocations$ = this.store.select(getLocationsByIds(userLocationsIds));
    // this.labSampleLabel$ = this.samplesService.getSampleLabel();
    // this.referringDoctorFields = Object.keys(
    //   this.allRegistrationFields?.referringDoctorFields
    // ).map((key) => {
    //   return this.allRegistrationFields?.referringDoctorFields[key];
    // });
    // const currentLocation = JSON.parse(localStorage.getItem("currentLocation"));
    this.referringDoctorFields;
    let fields = [
      ...this.staticFields.map((field) => {
        return {
          [field.key]: isMoment(field.value)
            ? field.value.toString()
            : field.value,
        };
      }),
      ...this.fixedFields.map((field) => {
        return {
          [field.key]: isMoment(field.value)
            ? field.value.toString()
            : field.value,
        };
      }),
    ];
    fields.forEach((field) => {
      this.fieldsWithValues = {
        ...this.fieldsWithValues,
        ...field,
      };
    });

    Object.keys(this.allRegistrationFields?.patientAgeFields).forEach((key) => {
      if (this.fieldsWithValues[key]) {
        this.personDetailsData = {
          ...this.personDetailsData,
          [key]: this.fieldsWithValues[key],
        };
      }
    });
    Object.keys(this.allRegistrationFields?.testFields).forEach((key) => {
      if (this.fieldsWithValues[key]?.length > 0) {
        this.testOrders = [
          ...this.testOrders,
          ...this.fieldsWithValues[key]?.map((value, index) => {
            return {
              id: "test" + index,
              key: "test" + index,
              value: value?.uuid,
            };
          }),
        ];
      }
    });
    Object.keys(this.allRegistrationFields?.primaryIdentifierFields).forEach(
      (key) => {
        if (this.fieldsWithValues[key]) {
          this.personDetailsData = {
            ...this.personDetailsData,
            [key]: this.fieldsWithValues[key],
          };
        }
      }
    );
  }

  get maximumDate() {
    let maxDate = new Date();
    let maxMonth =
      (maxDate.getMonth() + 1).toString().length > 1
        ? maxDate.getMonth() + 1
        : `0${maxDate.getMonth() + 1}`;
    let maxDay =
      maxDate.getDate().toString().length > 1
        ? maxDate.getDate()
        : `0${maxDate.getDate()}`;
    return `${maxDate.getFullYear()}-${maxMonth}-${maxDay}`;
  }

  assignFields() {
    this.gettingBatches = true;
    this.samplesService
      .getBatches(null, null, this.batch?.name)
      .pipe(
        tap((response) => {
          if (!response?.error) {
            this.getBatch = response;
            this.gettingBatches = false;
          }
        })
      )
      .subscribe();
    this.fixedFields = this.fieldsObject?.fixedFieldsWithValues;
    this.staticFields = this.fieldsObject?.staticFieldsWithValues;
    this.dynamicFields = this.fieldsObject?.dynamicFields;
    this.batchSampleCode$ = this.generateMetadataLabelsService
      .getLabMetadatalabels({
        globalProperty: this.batchSampleCodeFormatReference?.uuid,
        metadataType: "batch",
      })
      .pipe(
        tap((response) => {
          if (!response[0]?.error) {
            this.batchSampleCode = response[0];
          }
        })
      );
  }

  getDateStringFromDate(date) {
    let month =
      (date.getMonth() + 1).toString().length > 1
        ? date.getMonth() + 1
        : `0${date.getMonth() + 1}`;
    let day =
      date.getDate().toString().length > 1
        ? date.getDate()
        : `0${date.getDate()}`;
    return `${date.getFullYear()}-${month}-${day}`;
  }

  togglePatientDetailsFieldSet(event: Event): void {
    event.stopPropagation();
    this.patientFieldSetClosed = !this.patientFieldSetClosed;
  }

  // getSelection(event: MatRadioChange): void {
  //   this.registrationCategory = event?.value;
  // }

  getTimestampFromDateAndTime(date: string, time?: string): number {
    return time
      ? new Date(`${date} ${time}`).getTime()
      : new Date(date).getTime();
  }

  //   getSelectedReceivedOnTime(event: Event): void {
  //     this.receivedOnTime = (event.target as any)?.value;
  //     this.receivedOnTimeValid = this.isValidTime(
  //       this.receivedOnTime,
  //       this.receivedOnDateLatestValue
  //         ? this.receivedOnDateLatestValue
  //         : this.maximumDate
  //     );
  //     if (this.collectedOnTime || this.broughtOnTime) {
  //       let valid1 = this.isValidTime(
  //         this.broughtOnTime ? this.broughtOnTime : this.collectedOnTime,
  //         this.broughtOnDateLatestValue
  //           ? this.broughtOnDateLatestValue
  //           : this?.collectedOnDateLatestValue
  //           ? this?.collectedOnDateLatestValue
  //           : this.maximumDate,
  //         this.receivedOnTime,
  //         this.receivedOnDateLatestValue
  //           ? this.receivedOnDateLatestValue
  //           : this.maximumDate
  //       );

  //       let valid2 = (this.receivedOnTimeValid = this.isValidTime(
  //         this.receivedOnTime,
  //         this.receivedOnDateLatestValue
  //           ? this.receivedOnDateLatestValue
  //           : this.maximumDate
  //       ));
  //       this.receivedOnTimeValid = valid1 && valid2 ? true : false;
  //     }
  //     this.formData = {
  //       ...this.formData,
  //       receivedAt: {
  //         value: (event.target as any)?.value,
  //         id: "receivedAt",
  //         key: "receivedAt",
  //       },
  //     };
  //   }

  //   getSelectedRCollectedOnTime(event: Event): void {
  //     this.collectedOnTime = (event.target as any)?.value;
  //     this.collectedOnTimeValid = this.isValidTime(
  //       this.collectedOnTime,
  //       this.collectedOnDateLatestValue
  //         ? this.collectedOnDateLatestValue
  //         : this.maximumDate
  //     );
  //     if (this.broughtOnTime || this.receivedOnTime) {
  //       this.collectedOnTimeValid = this.isValidTime(
  //         this.collectedOnTime,
  //         this.collectedOnDateLatestValue
  //           ? this.collectedOnDateLatestValue
  //           : this.maximumDate,
  //         this.broughtOnTime ? this.broughtOnTime : this.receivedOnTime,
  //         this.broughtOnDateLatestValue
  //           ? this.broughtOnDateLatestValue
  //           : this?.receivedOnDateLatestValue
  //       );
  //     }
  //     this.formData = {
  //       ...this.formData,
  //       collectedAt: {
  //         value: (event.target as any)?.value,
  //         id: "collectedAt",
  //         key: "collectedAt",
  //       },
  //     };
  //   }

  //   getSelectedBroughtOnTime(event: Event): void {
  //     this.broughtOnTime = (event.target as any)?.value;
  //     let valid1: boolean = true;
  //     let valid2: boolean = true;
  //     let valid3: boolean = true;
  //     let valid4: boolean = true;
  //     valid1 = this.isValidTime(
  //       this.broughtOnTime,
  //       this.broughtOnDateLatestValue
  //         ? this.broughtOnDateLatestValue
  //         : this.maximumDate
  //     );

  //     if (this.receivedOnTime) {
  //       valid2 = this.isValidTime(
  //         this.broughtOnTime,
  //         this.broughtOnDateLatestValue
  //           ? this.broughtOnDateLatestValue
  //           : this.maximumDate,
  //         this.receivedOnTime,
  //         this.receivedOnDateLatestValue
  //           ? this.receivedOnDateLatestValue
  //           : this.maximumDate
  //       );
  //       valid3 = valid1 && valid2 ? true : false;
  //     }
  //     if (this.collectedOnTime) {
  //       valid4 = this.isValidTime(
  //         this.collectedOnTime,
  //         this.collectedOnDateLatestValue
  //           ? this.collectedOnDateLatestValue
  //           : this.maximumDate,
  //         this.broughtOnTime,
  //         this.broughtOnDateLatestValue
  //           ? this.broughtOnDateLatestValue
  //           : this.maximumDate
  //       );
  //     }
  //     this.broughtOnTimeValid = valid1 && valid2 && valid3 && valid4;
  //     this.formData = {
  //       ...this.formData,
  //       broughtAt: {
  //         value: (event.target as any)?.value,
  //         id: "broughtAt",
  //         key: "broughtAt",
  //       },
  //     };
  //   }

  onFormUpdate(formValues: FormValue, itemKey?: string): void {
    //Validate Date fields
    this.formData = { ...this.formData, ...formValues.getValues() };
    if (
      formValues.getValues()?.collectedOn?.value.toString()?.length > 0 ||
      this.fixedFields.filter((field) => {
        if (field?.id === "collectedOn") {
          return field.value;
        }
      }).length ||
      this.staticFields.filter((field) => {
        if (field?.id === "collectedOn") {
          return field.value;
        }
      }).length
    ) {
      let collected_on_date;
      collected_on_date = formValues.getValues()?.collectedOn?.value
        ? this.getDateStringFromDate(
            new Date(formValues.getValues()?.collectedOn?.value)
          )
        : this.fixedFields.filter((field) => {
            if (field?.id === "collectedOn") {
              return field.value;
            }
          }).length > 0
        ? this.fixedFields.filter((field) => {
            if (field?.id === "collectedOn") {
              return field.value;
            }
          })[0]
        : this.staticFields.filter((field) => {
            if (field?.id === "collectedOn") {
              return field.value;
            }
          })[0];
      this.collectedOnDateLatestValue = collected_on_date;
      this.collectedOnTimeValid = this.isValidTime(
        this.collectedOnTime,
        this.collectedOnDateLatestValue
          ? this.collectedOnDateLatestValue
          : this.maximumDate
      );
    }
    if (
      formValues.getValues()?.receivedOn?.value?.toString()?.length > 0 ||
      this.fixedFields.filter((field) => {
        if (field?.id === "receivedOn") {
          return field.value;
        }
      }).length ||
      this.staticFields.filter((field) => {
        if (field?.id === "receivedOn") {
          return field.value;
        }
      }).length
    ) {
      let received_on_date;
      received_on_date = formValues.getValues()?.receivedOn?.value
        ? this.getDateStringFromDate(
            new Date(formValues.getValues()?.receivedOn?.value)
          )
        : this.fixedFields.filter((field) => {
            if (field?.id === "receivedOn") {
              return field.value;
            }
          }).length > 0
        ? this.fixedFields.filter((field) => {
            if (field?.id === "receivedOn") {
              return field.value;
            }
          })[0]
        : this.staticFields.filter((field) => {
            if (field?.id === "receivedOn") {
              return field.value;
            }
          })[0];
      this.receivedOnDateLatestValue = received_on_date;
      this.receivedOnTimeValid = this.isValidTime(
        this.receivedOnTime,
        this.receivedOnDateLatestValue
          ? this.receivedOnDateLatestValue
          : this.maximumDate
      );
    }
    if (
      formValues.getValues()?.broughtOn?.value.toString()?.length > 0 ||
      this.fixedFields.filter((field) => {
        if (field?.id === "broughtOn") {
          return field.value;
        }
      }).length ||
      this.staticFields.filter((field) => {
        if (field?.id === "broughtOn") {
          return field.value;
        }
      }).length
    ) {
      let brought_on_date;
      brought_on_date = formValues.getValues()?.broughtOn?.value
        ? this.getDateStringFromDate(
            new Date(formValues.getValues()?.broughtOn?.value)
          )
        : this.fixedFields.filter((field) => {
            if (field?.id === "broughtOn") {
              return field.value;
            }
          }).length > 0
        ? this.fixedFields.filter((field) => {
            if (field?.id === "broughtOn") {
              return field.value;
            }
          })[0]
        : this.staticFields.filter((field) => {
            if (field?.id === "broughtOn") {
              return field.value;
            }
          })[0];
      this.broughtOnDateLatestValue = brought_on_date;
      this.broughtOnTimeValid = this.isValidTime(
        this.broughtOnTime,
        this.broughtOnDateLatestValue
          ? this.broughtOnDateLatestValue
          : this.maximumDate
      );
    }

    this.minForReceivedOn = false;
    if (this.receivedOnField?.min) {
      this.receivedOnField.min = this.broughtOnDateLatestValue
        ? this.broughtOnDateLatestValue
        : this.collectedOnDateLatestValue;
    }
    if (this.broughtOnField?.min) {
      this.broughtOnField.min = this.collectedOnDateLatestValue
        ? this.collectedOnDateLatestValue
        : "";
    }
    this.minForReceivedOn = true;

    this.maxForCollectedOn = false;
    if (this.sampleColectionDateField?.max) {
      this.sampleColectionDateField.max = this.broughtOnDateLatestValue
        ? this.broughtOnDateLatestValue
        : this.receivedOnDateLatestValue
        ? this.receivedOnDateLatestValue
        : this.maximumDate;
    }
    if (this.broughtOnField?.max) {
      this.broughtOnField.max = this.receivedOnDateLatestValue
        ? this.receivedOnDateLatestValue
        : this.maximumDate;
    }
    this.maxForCollectedOn = true;

    // this.getDateStringFromMoment_i();
    if (this.formData["specimen"]?.value) {
      this.selectedSpecimenUuid = this.formData["specimen"]?.value;
    } else {
      this.selectedSpecimenUuid = this.fieldsWithValues["specimen"];
    }
    Object.keys(this.formData).forEach((key) => {
      if (
        this.allRegistrationFields?.testFields[key] &&
        this.formData[key] &&
        this.formData[key]?.value
      ) {
        this.testOrders = [
          ...this.testOrders,
          ...this.formData[key]?.value?.map((value, index) => {
            return {
              id: "test" + index,
              key: "test" + index,
              value: value,
            };
          }),
        ];
      }
      if (
        (this.allRegistrationFields?.personFields[key] ||
          this.allRegistrationFields?.patientAgeFields[key] ||
          this.allRegistrationFields?.personFieldsGroupThree[key]) &&
        this.formData[key]?.value
      ) {
        this.personDetailsData = {
          ...this.personDetailsData,
          [key]: this.formData[key]?.value,
        };
      }

      if (this.allRegistrationFields?.primaryIdentifierFields[key]) {
        this.personDetailsData = {
          ...this.personDetailsData,
          [key]: this.allRegistrationFields?.primaryIdentifierFields[key].value,
        };
      }
    });
  }

  onAddSampleData() {
    this.formDataObject = {
      ...this.formDataObject,
      [Object.keys(this.formDataObject).length + 1]: this.formData,
    };
    this.fieldsWithValues = Object.keys(this.formDataObject)
      .map((key) => {
        return Object.keys(this.formDataObject[key]).map((insideKey) => {
          if (
            this.formDataObject[key][insideKey]?.value?.toString().length > 0
          ) {
            return {
              [insideKey]: isMoment(this.formDataObject[key][insideKey]?.value)
                ? this.formDataObject[key][insideKey]?.value?.toDate()
                : this.formDataObject[key][insideKey]?.value,
            };
          } else {
            return null;
          }
        });
      })
      .filter((field) => field);
    this.dynamicFields = [];
    this.fieldWithValuesChanged = false;
    setTimeout(() => {
      this.assignFields();
      this.fieldWithValuesChanged = true;
    }, 200);
  }

  onFormUpdateForTest(testValues: any): void {
    Object.keys(this.formData).forEach((key) => {
      if (!testValues[key] && key?.indexOf("test") > -1) {
        this.formData = omit(this.formData, key);
      }
    });
    this.formData = { ...this.formData, ...testValues };
    Object.keys(this.formData).forEach((key) => {
      if (key.indexOf("test") === 0) {
        this.testOrders = uniqBy(
          [
            ...this.testOrders,
            {
              ...this.formData[key],
            },
          ],
          "id"
        );
      }
    });
    this.groupedTestOrdersByDepartments = formulateSamplesByDepartments(
      this.labSections,
      this.testOrders
    );

    if (this.testOrders?.length === 0) {
      this.errorMessage = "No test has been selected";
    } else {
      this.errorMessage = "";
    }

    if (this.groupedTestOrdersByDepartments?.length === 0) {
      this.errorMessage = "Test missing lab section";
    } else {
      this.errorMessage = "";
    }
  }

  onFormUpdateForAgency(formValues: FormValue): void {
    this.formData = { ...this.formData, ...formValues.getValues() };
  }

  onFormUpdateForLab(formValues: FormValue): void {
    this.formData = { ...this.formData, ...formValues.getValues() };
  }

  onGetSampleLabel(sampleLabel: string): void {
    this.currentSampleLabel = sampleLabel;
  }

  onGetSelectedOptionDetails(details): void {
    this.formData = { ...this.formData, ...details };
  }

  formatToSpecifiedChars(labNumber): string {
    let generatedStr = "";
    for (
      let count = 0;
      count <
      Number(this.labNumberCharactersCount) -
        (labNumber.toString()?.length + 6);
      count++
    ) {
      generatedStr = generatedStr + "0";
    }
    return (
      new Date().getFullYear().toString() +
      new Date().getMonth().toString() +
      generatedStr +
      labNumber.toString()
    );
  }

  onGetClinicalDataValues(clinicalData): void {
    this.formData = { ...this.formData, ...clinicalData };
  }

  onSave(event: Event, labLocations?: any[]): void {
    event.stopPropagation();
    if (labLocations?.length === 1) {
      this.currentLabLocation = labLocations[0];
    } else {
      this.currentLabLocation = null;
      // Then user should define the lab
    }
    let confirmationDialogue = this.dialog.open(SharedConfirmationComponent, {
      width: "25%",
      data: {
        modalTitle: `Save samples`,
        modalMessage: `Proceed with saving sample?`,
        showRemarksInput: false,
        confirmationButtonText: "Proceed",
      },
    });

    confirmationDialogue.afterClosed().subscribe((closingObject) => {
      if (closingObject?.confirmed) {
        // Identify if tests orderes are well configured
        // Identify referring doctor fields entered values
        let attributeMissingOnDoctorsAttributes;
        this.sampleLabelsUsedDetails = [];
        const doctorsAttributesWithValues =
          this.referringDoctorAttributes.filter(
            (attribute) =>
              this.formData["attribute-" + attribute?.value]?.value ||
              this.fieldsWithValues["attribute-" + attribute?.value]
          ) || [];
        if (
          doctorsAttributesWithValues?.length !==
          this.referringDoctorAttributes?.length
        ) {
          attributeMissingOnDoctorsAttributes = true;
          this.referringDoctorAttributes.forEach((attribute) => {
            if (
              !this.formData["attribute-" + attribute?.value]?.value &&
              !this.fieldsWithValues["attribute-" + attribute?.value]
            ) {
              this.formData["attribute-" + attribute?.value] = {
                id: "attribute-" + attribute?.value,
                value: "NONE",
              };
            }
          });
        }

        this.personDetailsData =
          this.registrationCategory === "CLINICAL"
            ? this.personDetailsData
            : this.registrationCategory === "EQA"
            ? EQA_PERSON_DATA
            : NON_CLINICAL_PERSON_DATA;
        if (this.testOrders?.length === 0) {
          this.errorMessage = "No test has been selected";
        } else {
          this.errorMessage = "";
          const orderConceptUuids =
            this.testOrders.map((testOrder) => testOrder?.value) || [];
          this.conceptService
            .getConceptSetsByConceptUuids(orderConceptUuids)
            .subscribe((conceptSetsResponse: any) => {
              if (conceptSetsResponse && !conceptSetsResponse?.error) {
                const groupedTestorders = groupBy(
                  conceptSetsResponse,
                  "testOrder"
                );
                this.groupedTestOrdersByDepartments = [];
                Object.keys(groupedTestorders).forEach((key: string) => {
                  let metadata = [];
                  metadata = groupedTestorders[key];
                  if (metadata.length > 0) {
                    this.groupedTestOrdersByDepartments = [
                      ...this.groupedTestOrdersByDepartments,
                      metadata,
                    ];
                  }
                });
                zip(
                  this.registrationService.getPatientIdentifierTypes(),
                  this.locationService.getFacilityCode(),
                  this.registrationService.getAutoFilledPatientIdentifierType()
                ).subscribe((results) => {
                  if (results) {
                    const patientIdentifierTypes = results[0];
                    this.identifierService
                      .generateIds({
                        generateIdentifiers: true,
                        sourceUuid: this.mrnGeneratorSourceUuid,
                        numberToGenerate: 1,
                      })
                      .subscribe((identifierResponse) => {
                        if (identifierResponse) {
                          /**
                            1. Create user
                            2. Create visit (Orders should be added in)
                            3. Create BatchSample
                            4. Create sample including batch sample uuid
                          */

                          this.patientPayload = {
                            person: {
                              names: [
                                {
                                  givenName: this.personDetailsData?.firstName,
                                  familyName: this.personDetailsData?.lastName,
                                  middleName:
                                    this.personDetailsData?.middleName,
                                },
                              ],
                              gender:
                                this.personDetailsData?.gender?.length > 0
                                  ? this.personDetailsData?.gender
                                  : "U",
                              age: this.personDetailsData?.age,
                              birthdate: this.personDetailsData?.dob
                                ? this.personDetailsData?.dob
                                : null,
                              birthdateEstimated: this.personDetailsData?.dob
                                ? false
                                : true,
                              addresses: [
                                {
                                  address1: this.personDetailsData?.address,
                                  address2: this.personDetailsData?.address,
                                  address3: this.personDetailsData?.address,
                                  cityVillage: "",
                                  country: "",
                                  postalCode: "",
                                },
                              ],
                              attributes: [
                                {
                                  attributeType:
                                    this.personPhoneAttributeTypeUuid,
                                  value: this.personDetailsData?.mobileNumber,
                                },
                                {
                                  attributeType:
                                    this.personEmailAttributeTypeUuid,
                                  value: this.personDetailsData?.email,
                                },
                              ],
                            },
                            identifiers:
                              this.registrationCategory === "CLINICAL"
                                ? (patientIdentifierTypes || [])
                                    .map((personIdentifierType) => {
                                      if (
                                        personIdentifierType.id ===
                                        this.preferredPersonIdentifier
                                      ) {
                                        return {
                                          identifier: this.personDetailsData
                                            ?.mrn
                                            ? this.personDetailsData["mrn"]
                                            : this.personDetailsData[
                                                personIdentifierType.id
                                              ]?.toString()?.length > 0
                                            ? this.personDetailsData[
                                                personIdentifierType.id
                                              ]
                                            : this.formData[
                                                "26742868-a38c-4e6a-ac1d-ae283c414c2e"
                                              ]?.value
                                            ? this.formData[
                                                "26742868-a38c-4e6a-ac1d-ae283c414c2e"
                                              ]?.value
                                            : identifierResponse[0],
                                          identifierType:
                                            personIdentifierType.id,
                                          location:
                                            this.currentLocation?.uuid ||
                                            "7fdfa2cb-bc95-405a-88c6-32b7673c0453", // TODO: Find a way to softcode this,
                                          preferred: true,
                                        };
                                      } else {
                                        return {
                                          identifier:
                                            this.personDetailsData[
                                              personIdentifierType.id
                                            ],
                                          identifierType:
                                            personIdentifierType.id,
                                          location:
                                            this.currentLocation?.uuid ||
                                            "7fdfa2cb-bc95-405a-88c6-32b7673c0453", // TODO: Find a way to softcode this,
                                          preferred: false,
                                        };
                                      }
                                    })
                                    .filter(
                                      (patientIdentifier) =>
                                        patientIdentifier?.identifier
                                    )
                                : [
                                    {
                                      identifier: identifierResponse[0],
                                      identifierType:
                                        this.preferredPersonIdentifier,
                                      location:
                                        this.currentLocation?.uuid ||
                                        "7fdfa2cb-bc95-405a-88c6-32b7673c0453", // TODO: Find a way to softcode this
                                      preferred: true,
                                    },
                                  ],
                          };
                          this.savingData = true;
                          this.registrationService
                            .createPatient(
                              this.patientPayload,
                              this.personDetailsData?.patientUuid
                            )
                            .subscribe((patientResponse) => {
                              this.savingDataResponse = patientResponse;
                              if (!patientResponse?.error) {
                                // TODO: SOftcode visit type
                                let visAttributes = [
                                  {
                                    attributeType:
                                      "PSCHEME0IIIIIIIIIIIIIIIIIIIIIIIATYPE",
                                    value:
                                      "00000102IIIIIIIIIIIIIIIIIIIIIIIIIIII",
                                  },
                                  {
                                    attributeType:
                                      "PTYPE000IIIIIIIIIIIIIIIIIIIIIIIATYPE",
                                    value:
                                      "00000100IIIIIIIIIIIIIIIIIIIIIIIIIIII",
                                  },
                                  {
                                    attributeType:
                                      "SERVICE0IIIIIIIIIIIIIIIIIIIIIIIATYPE",
                                    value:
                                      "30fe16ed-7514-4e93-a021-50024fe82bdd",
                                  },
                                  {
                                    attributeType:
                                      "66f3825d-1915-4278-8e5d-b045de8a5db9",
                                    value:
                                      "d1063120-26f0-4fbb-9e7d-f74c429de306",
                                  },
                                  {
                                    attributeType:
                                      "6eb602fc-ae4a-473c-9cfb-f11a60eeb9ac",
                                    value:
                                      "b72ed04a-2c4b-4835-9cd2-ed0e841f4b58",
                                  },
                                ];

                                if (this.registrationCategory === "CLINICAL") {
                                  const personDataAttributeKeys =
                                    Object.keys(this.personDetailsData).filter(
                                      (key) => key.indexOf("attribute-") === 0
                                    ) || [];

                                  const formDataAttributeKeys =
                                    Object.keys(this.formData).filter(
                                      (key) => key.indexOf("attribute-") === 0
                                    ) || [];

                                  personDataAttributeKeys.forEach((key) => {
                                    visAttributes = [
                                      ...visAttributes,
                                      {
                                        attributeType:
                                          key.split("attribute-")[1],
                                        value: this.personDetailsData[key],
                                      },
                                    ];
                                  });

                                  formDataAttributeKeys.forEach((key) => {
                                    visAttributes = [
                                      ...visAttributes,
                                      {
                                        attributeType:
                                          key.split("attribute-")[1],
                                        value: this.formData[key]?.value
                                          ? this.formData[key]?.value
                                          : "-",
                                      },
                                    ];
                                  });
                                }

                                if (
                                  this.personDetailsData?.pimaCOVIDLinkDetails
                                ) {
                                  visAttributes = [
                                    ...visAttributes,
                                    {
                                      attributeType:
                                        "0acd3180-710d-4417-8768-97bc45a02395",
                                      value: JSON.stringify({
                                        program:
                                          this.personDetailsData
                                            ?.pimaCOVIDLinkDetails?.program,
                                        enrollment:
                                          this.personDetailsData
                                            ?.pimaCOVIDLinkDetails?.enrollment,
                                        trackedEntityInstance:
                                          this.personDetailsData
                                            ?.pimaCOVIDLinkDetails
                                            ?.trackedEntityInstance,
                                        orgUnit:
                                          this.personDetailsData
                                            ?.pimaCOVIDLinkDetails?.orgUnit,
                                      }),
                                    },
                                  ];
                                }
                                const visitObject = {
                                  patient: this.savingDataResponse?.uuid,
                                  visitType:
                                    "54e8ffdc-dea0-4ef0-852f-c23e06d16066",
                                  location: this.currentLocation?.uuid,
                                  indication: "Sample Registration",
                                  attributes:
                                    visAttributes.filter(
                                      (attribute) => attribute?.value
                                    ) || [],
                                };

                                this.visitsService
                                  .createVisit(visitObject)
                                  .subscribe((visitResponse) => {
                                    this.savingDataResponse = visitResponse;
                                    if (!visitResponse?.error) {
                                      this.savingData = true;

                                      // Create encounter with orders
                                      zip(
                                        ...this.groupedTestOrdersByDepartments.map(
                                          (groupedTestOrders) => {
                                            const orders = uniqBy(
                                              groupedTestOrders,
                                              "testOrder"
                                            ).map((testOrder) => {
                                              // TODO: Remove hard coded order type
                                              return {
                                                concept: testOrder?.testOrder,
                                                orderType:
                                                  "52a447d3-a64a-11e3-9aeb-50e549534c5e", // TODO: Find a way to soft code this
                                                action: "NEW",
                                                orderer: this.provider?.uuid,
                                                patient: patientResponse?.uuid,
                                                careSetting: "OUTPATIENT",
                                                urgency: "ROUTINE", // TODO: Change to reflect users input
                                                instructions: "",
                                                type: "testorder",
                                              };
                                            });

                                            let obs = [];
                                            if (this.formData["notes"]?.value) {
                                              obs = [
                                                {
                                                  concept:
                                                    "3a010ff3-6361-4141-9f4e-dd863016db5a",
                                                  value:
                                                    this.formData["notes"]
                                                      ?.value,
                                                },
                                              ];
                                            }
                                            const encounterObject = {
                                              visit: visitResponse?.uuid,
                                              patient: patientResponse?.uuid,
                                              encounterType:
                                                "9b46d3fe-1c3e-4836-a760-f38d286b578b",
                                              location:
                                                this.currentLocation?.uuid,
                                              orders,
                                              obs,
                                              encounterProviders: [
                                                {
                                                  provider: this.provider?.uuid,
                                                  encounterRole:
                                                    ICARE_CONFIG.encounterRole,
                                                },
                                              ],
                                            };
                                            return this.labOrdersService.createLabOrdersViaEncounter(
                                              encounterObject
                                            );
                                          }
                                        )
                                      ).subscribe((responses: any[]) => {
                                        if (responses) {
                                          responses.forEach(
                                            (encounterResponse, index) => {
                                              if (!encounterResponse?.error) {
                                                this.savingData = true;
                                                // Get orders details for allocations
                                                const orderUuids =
                                                  encounterResponse?.orders.map(
                                                    (order) => {
                                                      return order?.uuid;
                                                    }
                                                  );
                                                this.orderService
                                                  .getOrdersByUuids(orderUuids)
                                                  .subscribe(
                                                    (ordersResponse) => {
                                                      if (ordersResponse) {
                                                        const configs = {
                                                          otherContainer: {
                                                            id: "eb21ff23-a627-4a62-8bd0-efdc1db2ebb5",
                                                            uuid: "eb21ff23-a627-4a62-8bd0-efdc1db2ebb5",
                                                          },
                                                        };

                                                        const keyedOrders =
                                                          keyBy(
                                                            ordersResponse,
                                                            "uuid"
                                                          );
                                                        const batchSampleObject =
                                                          [
                                                            {
                                                              code: this
                                                                .batchSampleCode,
                                                              batch: {
                                                                uuid: this.batch
                                                                  .uuid,
                                                              },
                                                            },
                                                          ];
                                                        if (
                                                          localStorage.getItem(
                                                            "batchSample"
                                                          )?.length
                                                        ) {
                                                          this.samplesService
                                                            .getIncreamentalSampleLabel()
                                                            .subscribe(
                                                              (sampleLabel) => {
                                                                if (
                                                                  sampleLabel
                                                                ) {
                                                                  const sample =
                                                                    {
                                                                      visit: {
                                                                        uuid: visitResponse?.uuid,
                                                                      },
                                                                      label:
                                                                        sampleLabel,
                                                                      concept: {
                                                                        uuid: (this.groupedTestOrdersByDepartments[
                                                                          index
                                                                        ]?.filter(
                                                                          (
                                                                            testOrderDepartment
                                                                          ) =>
                                                                            testOrderDepartment?.systemName?.indexOf(
                                                                              "LAB_DEPARTMENT"
                                                                            ) >
                                                                            -1
                                                                        ) ||
                                                                          [])[0]
                                                                          ?.uuid,
                                                                      },
                                                                      specimenSource:
                                                                        {
                                                                          uuid: this
                                                                            .selectedSpecimenUuid
                                                                            ? this
                                                                                .selectedSpecimenUuid
                                                                            : this
                                                                                .specimenSourcesKeyedByTestOrders[
                                                                                this
                                                                                  .testOrders[0]
                                                                                  ?.value
                                                                              ]
                                                                                ?.specimenUuid,
                                                                        },
                                                                      location:
                                                                        {
                                                                          uuid: this
                                                                            .currentLabLocation
                                                                            ?.uuid,
                                                                        },
                                                                      orders:
                                                                        encounterResponse?.orders.map(
                                                                          (
                                                                            order
                                                                          ) => {
                                                                            return {
                                                                              uuid: order?.uuid,
                                                                            };
                                                                          }
                                                                        ),
                                                                      batchSample:
                                                                        {
                                                                          uuid: localStorage.getItem(
                                                                            "batchSample"
                                                                          ),
                                                                        },
                                                                    };
                                                                  // Create sample
                                                                  this.samplesService
                                                                    .createLabSample(
                                                                      sample
                                                                    )
                                                                    .subscribe(
                                                                      (
                                                                        sampleResponse: any
                                                                      ) => {
                                                                        localStorage.setItem(
                                                                          "batchSample",
                                                                          sampleResponse?.batchSample
                                                                            ? sampleResponse
                                                                                ?.batchSample
                                                                                ?.uuid
                                                                            : sampleResponse
                                                                                ?.batch
                                                                                ?.uuid
                                                                        );
                                                                        this.savingDataResponse =
                                                                          sampleResponse;
                                                                        this.sampleLabelsUsedDetails =
                                                                          [
                                                                            ...this
                                                                              .sampleLabelsUsedDetails,
                                                                            {
                                                                              ...sample,
                                                                            },
                                                                          ];

                                                                        this.samplesCreated =
                                                                          [
                                                                            ...this
                                                                              .samplesCreated,
                                                                            sampleResponse,
                                                                          ];
                                                                        // TODO: Find a better way to control three labels to be printed

                                                                        this.sampleLabelsUsedDetails =
                                                                          [
                                                                            ...this
                                                                              .sampleLabelsUsedDetails,
                                                                            sample,
                                                                          ];
                                                                        this.sampleLabelsUsedDetails =
                                                                          [
                                                                            ...this
                                                                              .sampleLabelsUsedDetails,
                                                                            sample,
                                                                          ];

                                                                        // Create sample allocations

                                                                        if (
                                                                          sampleResponse
                                                                        ) {
                                                                          let ordersWithConceptsDetails =
                                                                            [];

                                                                          sampleResponse?.orders?.forEach(
                                                                            (
                                                                              order
                                                                            ) => {
                                                                              ordersWithConceptsDetails =
                                                                                [
                                                                                  ...ordersWithConceptsDetails,
                                                                                  {
                                                                                    sample:
                                                                                      sampleResponse,
                                                                                    order:
                                                                                      {
                                                                                        sample:
                                                                                          sampleResponse,
                                                                                        ...keyedOrders[
                                                                                          order
                                                                                            ?.uuid
                                                                                        ],
                                                                                      },
                                                                                  },
                                                                                ];
                                                                            }
                                                                          );

                                                                          this.savingData =
                                                                            this
                                                                              .formData[
                                                                              "agency"
                                                                            ]
                                                                              ?.value ||
                                                                            this
                                                                              .fieldsWithValues[
                                                                              "agency"
                                                                            ]
                                                                              ? true
                                                                              : false;
                                                                          let statuses =
                                                                            [];
                                                                          if (
                                                                            this
                                                                              .formData[
                                                                              "agency"
                                                                            ]
                                                                              ?.value ||
                                                                            this
                                                                              .fieldsWithValues[
                                                                              "agency"
                                                                            ]
                                                                          ) {
                                                                            const agencyStatus =
                                                                              {
                                                                                sample:
                                                                                  {
                                                                                    uuid: sampleResponse?.uuid,
                                                                                  },
                                                                                user: {
                                                                                  uuid: localStorage.getItem(
                                                                                    "userUuid"
                                                                                  ),
                                                                                },
                                                                                remarks:
                                                                                  this
                                                                                    .formData[
                                                                                    "agency"
                                                                                  ]
                                                                                    ?.value ||
                                                                                  this
                                                                                    .fieldsWithValues[
                                                                                    "agency"
                                                                                  ],
                                                                                category:
                                                                                  "PRIORITY",
                                                                                status:
                                                                                  "PRIORITY",
                                                                              };
                                                                            statuses =
                                                                              [
                                                                                ...statuses,
                                                                                agencyStatus,
                                                                              ];
                                                                          }

                                                                          if (
                                                                            this
                                                                              .formData[
                                                                              "receivedOn"
                                                                            ]
                                                                              ?.value ||
                                                                            this
                                                                              .fieldsWithValues
                                                                              ?.receivedOn
                                                                          ) {
                                                                            const receivedOnStatus =
                                                                              {
                                                                                sample:
                                                                                  {
                                                                                    uuid: sampleResponse?.uuid,
                                                                                  },
                                                                                user: {
                                                                                  uuid: localStorage.getItem(
                                                                                    "userUuid"
                                                                                  ),
                                                                                },
                                                                                remarks:
                                                                                  this
                                                                                    .fieldsWithValues
                                                                                    ?.receivedOn
                                                                                    ? this.getTimestampFromDateAndTime(
                                                                                        this
                                                                                          .fieldsWithValues
                                                                                          ?.receivedOn
                                                                                      )
                                                                                    : this.getTimestampFromDateAndTime(
                                                                                        this
                                                                                          .receivedOnDateLatestValue,
                                                                                        this
                                                                                          .receivedOnTime
                                                                                      ),
                                                                                status:
                                                                                  "RECEIVED_ON",
                                                                                category:
                                                                                  "RECEIVED_ON",
                                                                              };
                                                                            statuses =
                                                                              [
                                                                                ...statuses,
                                                                                receivedOnStatus,
                                                                              ];
                                                                          }

                                                                          if (
                                                                            this
                                                                              .formData[
                                                                              "broughtOn"
                                                                            ]
                                                                              ?.value ||
                                                                            this
                                                                              .fieldsWithValues
                                                                              ?.broughtOn
                                                                          ) {
                                                                            const broughtOnStatus =
                                                                              {
                                                                                sample:
                                                                                  {
                                                                                    uuid: sampleResponse?.uuid,
                                                                                  },
                                                                                user: {
                                                                                  uuid: localStorage.getItem(
                                                                                    "userUuid"
                                                                                  ),
                                                                                },
                                                                                remarks:
                                                                                  this
                                                                                    .fieldsWithValues
                                                                                    ?.broughtOn
                                                                                    ? this.getTimestampFromDateAndTime(
                                                                                        this
                                                                                          .fieldsWithValues
                                                                                          ?.broughtOn
                                                                                      )
                                                                                    : this.getTimestampFromDateAndTime(
                                                                                        this
                                                                                          .broughtOnDateLatestValue,
                                                                                        this
                                                                                          .broughtOnTime
                                                                                      ),
                                                                                status:
                                                                                  "DELIVERED_ON",
                                                                                category:
                                                                                  "DELIVERED_ON",
                                                                              };
                                                                            statuses =
                                                                              [
                                                                                ...statuses,
                                                                                broughtOnStatus,
                                                                              ];
                                                                          }

                                                                          if (
                                                                            this
                                                                              .formData[
                                                                              "collectedOn"
                                                                            ]
                                                                              ?.value ||
                                                                            this
                                                                              .fieldsWithValues
                                                                              ?.collectedOn
                                                                          ) {
                                                                            const collectedOnStatus =
                                                                              {
                                                                                sample:
                                                                                  {
                                                                                    uuid: sampleResponse?.uuid,
                                                                                  },
                                                                                user: {
                                                                                  uuid: localStorage.getItem(
                                                                                    "userUuid"
                                                                                  ),
                                                                                },
                                                                                remarks:
                                                                                  this
                                                                                    .fieldsWithValues
                                                                                    ?.collectedOn
                                                                                    ? this.getTimestampFromDateAndTime(
                                                                                        this
                                                                                          .fieldsWithValues
                                                                                          ?.broughtOn
                                                                                      )
                                                                                    : this.getTimestampFromDateAndTime(
                                                                                        this
                                                                                          .collectedOnDateLatestValue,
                                                                                        this
                                                                                          .collectedOnTime
                                                                                      ),
                                                                                status:
                                                                                  "COLLECTED_ON",
                                                                                category:
                                                                                  "COLLECTED_ON",
                                                                              };
                                                                            statuses =
                                                                              [
                                                                                ...statuses,
                                                                                collectedOnStatus,
                                                                              ];
                                                                          }

                                                                          if (
                                                                            this
                                                                              .formData[
                                                                              "condition"
                                                                            ]
                                                                              ?.value ||
                                                                            this
                                                                              .fieldsWithValues[
                                                                              "condition"
                                                                            ]
                                                                          ) {
                                                                            const conditionStatus =
                                                                              {
                                                                                sample:
                                                                                  {
                                                                                    uuid: sampleResponse?.uuid,
                                                                                  },
                                                                                user: {
                                                                                  uuid: localStorage.getItem(
                                                                                    "userUuid"
                                                                                  ),
                                                                                },
                                                                                remarks:
                                                                                  this
                                                                                    .formData[
                                                                                    "condition"
                                                                                  ]
                                                                                    ?.value ||
                                                                                  this
                                                                                    .fieldsWithValues[
                                                                                    "condition"
                                                                                  ],
                                                                                category:
                                                                                  "CONDITION",
                                                                                status:
                                                                                  this
                                                                                    .formData[
                                                                                    "condition"
                                                                                  ]
                                                                                    ?.value,
                                                                              };
                                                                            statuses =
                                                                              [
                                                                                ...statuses,
                                                                                conditionStatus,
                                                                              ];
                                                                          }

                                                                          if (
                                                                            this
                                                                              .formData[
                                                                              "receivedBy"
                                                                            ]
                                                                              ?.value ||
                                                                            this
                                                                              .fieldsWithValues[
                                                                              "receivedBy"
                                                                            ]
                                                                          ) {
                                                                            const receivedByStatus =
                                                                              {
                                                                                sample:
                                                                                  {
                                                                                    uuid: sampleResponse?.uuid,
                                                                                  },
                                                                                user: {
                                                                                  uuid: this
                                                                                    .formData[
                                                                                    "receivedBy"
                                                                                  ]
                                                                                    ?.value
                                                                                    ? this
                                                                                        .formData[
                                                                                        "receivedBy"
                                                                                      ]
                                                                                        ?.value
                                                                                    : this
                                                                                        .fieldsWithValues[
                                                                                        "receivedBy"
                                                                                      ]
                                                                                    ? this
                                                                                        .fieldsWithValues[
                                                                                        "receivedBy"
                                                                                      ]
                                                                                    : localStorage.getItem(
                                                                                        "userUuid"
                                                                                      ),
                                                                                },
                                                                                category:
                                                                                  "RECEIVED_BY",
                                                                                remarks:
                                                                                  "RECEIVED_BY",
                                                                                status:
                                                                                  "RECEIVED_BY",
                                                                              };
                                                                            statuses =
                                                                              [
                                                                                ...statuses,
                                                                                receivedByStatus,
                                                                              ];
                                                                          }

                                                                          if (
                                                                            this
                                                                              .formData[
                                                                              "collectedBy"
                                                                            ]
                                                                              ?.value ||
                                                                            this
                                                                              .fieldsWithValues[
                                                                              "collectedBy"
                                                                            ]
                                                                          ) {
                                                                            const collectedByStatus =
                                                                              {
                                                                                sample:
                                                                                  {
                                                                                    uuid: sampleResponse?.uuid,
                                                                                  },
                                                                                user: {
                                                                                  uuid: localStorage.getItem(
                                                                                    "userUuid"
                                                                                  ),
                                                                                },
                                                                                remarks:
                                                                                  this
                                                                                    .formData[
                                                                                    "collectedBy"
                                                                                  ]
                                                                                    ?.value
                                                                                    ? this
                                                                                        .formData[
                                                                                        "collectedBy"
                                                                                      ]
                                                                                        ?.value
                                                                                    : this
                                                                                        .fieldsWithValues[
                                                                                        "receivedBy"
                                                                                      ]
                                                                                    ? this
                                                                                        .fieldsWithValues[
                                                                                        "receivedBy"
                                                                                      ]
                                                                                    : "NO COLLECTOR SPECIFIED",
                                                                                status:
                                                                                  "COLLECTED_BY",
                                                                                category:
                                                                                  "COLLECTED_BY",
                                                                              };
                                                                            statuses =
                                                                              [
                                                                                ...statuses,
                                                                                collectedByStatus,
                                                                              ];
                                                                          }

                                                                          if (
                                                                            this
                                                                              .formData[
                                                                              "broughtBy"
                                                                            ]
                                                                              ?.value ||
                                                                            this
                                                                              .fieldsWithValues[
                                                                              "broughtBy"
                                                                            ]
                                                                          ) {
                                                                            const broughtdByStatus =
                                                                              {
                                                                                sample:
                                                                                  {
                                                                                    uuid: sampleResponse?.uuid,
                                                                                  },
                                                                                user: {
                                                                                  uuid: localStorage.getItem(
                                                                                    "userUuid"
                                                                                  ),
                                                                                },
                                                                                remarks:
                                                                                  this
                                                                                    .formData[
                                                                                    "broughtBy"
                                                                                  ]
                                                                                    ?.value
                                                                                    ? this
                                                                                        .formData[
                                                                                        "broughtBy"
                                                                                      ]
                                                                                        ?.value
                                                                                    : this
                                                                                        .fieldsWithValues[
                                                                                        "broughtBy"
                                                                                      ]
                                                                                    ? this
                                                                                        .fieldsWithValues[
                                                                                        "broughtBy"
                                                                                      ]
                                                                                    : "NO PERSON SPECIFIED",
                                                                                status:
                                                                                  "DELIVERED_BY",
                                                                                category:
                                                                                  "DELIVERED_BY",
                                                                              };
                                                                            statuses =
                                                                              [
                                                                                ...statuses,
                                                                                broughtdByStatus,
                                                                              ];
                                                                          }
                                                                          if (
                                                                            this
                                                                              .formData[
                                                                              "transportCondition"
                                                                            ]
                                                                              ?.value
                                                                              .length >
                                                                              0 ||
                                                                            this
                                                                              .fieldsWithValues[
                                                                              "transportCondition"
                                                                            ]
                                                                          ) {
                                                                            const transportCondition =
                                                                              {
                                                                                sample:
                                                                                  {
                                                                                    uuid: sampleResponse?.uuid,
                                                                                  },
                                                                                user: {
                                                                                  uuid: localStorage.getItem(
                                                                                    "userUuid"
                                                                                  ),
                                                                                },
                                                                                remarks:
                                                                                  this
                                                                                    .formData[
                                                                                    "transportCondition"
                                                                                  ]
                                                                                    ?.value
                                                                                    ? this
                                                                                        .formData[
                                                                                        "transportCondition"
                                                                                      ]
                                                                                        ?.value
                                                                                    : this
                                                                                        .fieldsWithValues[
                                                                                        "transportCondition"
                                                                                      ]
                                                                                    ? this
                                                                                        .fieldsWithValues[
                                                                                        "transportCondition"
                                                                                      ]
                                                                                    : "NO TRANSPORT CONDITION SPECIFIED",
                                                                                category:
                                                                                  "TRANSPORT_CONDITION",
                                                                                status:
                                                                                  "TRANSPORT_CONDITION",
                                                                              };
                                                                            statuses =
                                                                              [
                                                                                ...statuses,
                                                                                transportCondition,
                                                                              ];
                                                                          }
                                                                          if (
                                                                            this
                                                                              .formData[
                                                                              "transportationTemperature"
                                                                            ]
                                                                              ?.value
                                                                              ?.length >
                                                                              0 ||
                                                                            this
                                                                              .fieldsWithValues[
                                                                              "transportationTemperature"
                                                                            ]
                                                                          ) {
                                                                            const transportationTemperature =
                                                                              {
                                                                                sample:
                                                                                  {
                                                                                    uuid: sampleResponse?.uuid,
                                                                                  },
                                                                                user: {
                                                                                  uuid: localStorage.getItem(
                                                                                    "userUuid"
                                                                                  ),
                                                                                },
                                                                                remarks:
                                                                                  this
                                                                                    .formData[
                                                                                    "transportationTemperature"
                                                                                  ]
                                                                                    ?.value
                                                                                    ? this
                                                                                        .formData[
                                                                                        "transportationTemperature"
                                                                                      ]
                                                                                        ?.value
                                                                                    : this
                                                                                        .fieldsWithValues[
                                                                                        "transportationTemperature"
                                                                                      ]
                                                                                    ? this
                                                                                        .fieldsWithValues[
                                                                                        "transportationTemperature"
                                                                                      ]
                                                                                    : "NO TRANSPORTATION TEMPERATURE SPECIFIED",
                                                                                category:
                                                                                  "TRANSPORT_TEMPERATURE",
                                                                                status:
                                                                                  "TRANSPORT_TEMPERATURE",
                                                                              };
                                                                            statuses =
                                                                              [
                                                                                ...statuses,
                                                                                transportationTemperature,
                                                                              ];
                                                                          }

                                                                          statuses =
                                                                            [
                                                                              ...statuses,
                                                                              {
                                                                                sample:
                                                                                  {
                                                                                    uuid: sampleResponse?.uuid,
                                                                                  },
                                                                                user: {
                                                                                  uuid: localStorage.getItem(
                                                                                    "userUuid"
                                                                                  ),
                                                                                },
                                                                                category:
                                                                                  "SAMPLE_REGISTRATION_CATEGORY",
                                                                                remarks:
                                                                                  "Sample registration form type reference",
                                                                                status:
                                                                                  this
                                                                                    .registrationCategory,
                                                                              },
                                                                            ];

                                                                          // console.log(
                                                                          //   "statuses",
                                                                          //   statuses
                                                                          // );

                                                                          if (
                                                                            this
                                                                              .personDetailsData
                                                                              ?.pimaCOVIDLinkDetails
                                                                          ) {
                                                                            statuses =
                                                                              [
                                                                                ...statuses,
                                                                                {
                                                                                  sample:
                                                                                    {
                                                                                      uuid: sampleResponse?.uuid,
                                                                                    },
                                                                                  user: {
                                                                                    uuid: localStorage.getItem(
                                                                                      "userUuid"
                                                                                    ),
                                                                                  },
                                                                                  category:
                                                                                    "INTEGRATION_PIMACOVID",
                                                                                  remarks:
                                                                                    "Sample registration from external systems",
                                                                                  status:
                                                                                    "INTEGRATION WITH PimaCOVID",
                                                                                },
                                                                              ];
                                                                          }

                                                                          if (
                                                                            statuses?.length >
                                                                            0
                                                                          ) {
                                                                            zip(
                                                                              this.samplesService.setMultipleSampleStatuses(
                                                                                statuses
                                                                              )
                                                                            ).subscribe(
                                                                              (
                                                                                sampleStatusResponse
                                                                              ) => {
                                                                                this.savingDataResponse =
                                                                                  sampleStatusResponse;
                                                                                if (
                                                                                  sampleStatusResponse
                                                                                ) {
                                                                                  const data =
                                                                                    {
                                                                                      identifier:
                                                                                        this
                                                                                          .currentSampleLabel,
                                                                                      sample:
                                                                                        sampleResponse,
                                                                                      sampleLabelsUsedDetails:
                                                                                        this
                                                                                          .sampleLabelsUsedDetails,
                                                                                    };
                                                                                  this.dialog
                                                                                    .open(
                                                                                      SampleRegistrationFinalizationComponent,
                                                                                      {
                                                                                        height:
                                                                                          "100px",
                                                                                        width:
                                                                                          "30%",
                                                                                        data: {
                                                                                          ...data,
                                                                                          popupHeader:
                                                                                            "Sample Saved",
                                                                                        },
                                                                                        disableClose:
                                                                                          true,
                                                                                        panelClass:
                                                                                          "custom-dialog-container",
                                                                                      }
                                                                                    )
                                                                                    .afterClosed()
                                                                                    .subscribe(
                                                                                      () => {
                                                                                        this.dynamicFields =
                                                                                          [];
                                                                                        this.getBatch =
                                                                                          [];
                                                                                        setTimeout(
                                                                                          () => {
                                                                                            this.assignFields();
                                                                                          },
                                                                                          100
                                                                                        );
                                                                                        this.openBarCodeDialog(
                                                                                          data
                                                                                        );
                                                                                        this.isRegistrationReady =
                                                                                          false;
                                                                                        setTimeout(
                                                                                          () => {
                                                                                            this.isRegistrationReady =
                                                                                              true;
                                                                                          },
                                                                                          200
                                                                                        );
                                                                                      }
                                                                                    );
                                                                                  this.savingData =
                                                                                    false;
                                                                                }
                                                                              }
                                                                            );
                                                                          }
                                                                        }
                                                                      }
                                                                    );
                                                                }
                                                              }
                                                            );
                                                        } else {
                                                          this.samplesService
                                                            .createBatchSample(
                                                              batchSampleObject
                                                            )
                                                            .subscribe(
                                                              (
                                                                batchSampleResponse
                                                              ) => {
                                                                if (
                                                                  !batchSampleResponse?.error
                                                                ) {
                                                                  localStorage.setItem(
                                                                    "batchSample",
                                                                    batchSampleResponse[0]
                                                                      ?.uuid
                                                                  );
                                                                  localStorage.setItem(
                                                                    "batchSampleCode",
                                                                    batchSampleResponse[0]
                                                                      ?.code
                                                                  );
                                                                  this.samplesService
                                                                    .getIncreamentalSampleLabel()
                                                                    .subscribe(
                                                                      (
                                                                        sampleLabel
                                                                      ) => {
                                                                        if (
                                                                          sampleLabel
                                                                        ) {
                                                                          const sample =
                                                                            {
                                                                              visit:
                                                                                {
                                                                                  uuid: visitResponse?.uuid,
                                                                                },
                                                                              label:
                                                                                sampleLabel,
                                                                              concept:
                                                                                {
                                                                                  uuid: (this.groupedTestOrdersByDepartments[
                                                                                    index
                                                                                  ]?.filter(
                                                                                    (
                                                                                      testOrderDepartment
                                                                                    ) =>
                                                                                      testOrderDepartment?.systemName?.indexOf(
                                                                                        "LAB_DEPARTMENT"
                                                                                      ) >
                                                                                      -1
                                                                                  ) ||
                                                                                    [])[0]
                                                                                    ?.uuid,
                                                                                },
                                                                              location:
                                                                                {
                                                                                  uuid: this
                                                                                    .currentLabLocation
                                                                                    ?.uuid,
                                                                                },
                                                                              specimenSource:
                                                                                {
                                                                                  uuid: this
                                                                                    .selectedSpecimenUuid
                                                                                    ? this
                                                                                        .selectedSpecimenUuid
                                                                                    : this
                                                                                        .specimenSourcesKeyedByTestOrders[
                                                                                        this
                                                                                          .testOrders[0]
                                                                                          ?.value
                                                                                      ]
                                                                                        ?.specimenUuid,
                                                                                },
                                                                              orders:
                                                                                encounterResponse?.orders.map(
                                                                                  (
                                                                                    order
                                                                                  ) => {
                                                                                    return {
                                                                                      uuid: order?.uuid,
                                                                                    };
                                                                                  }
                                                                                ),
                                                                              batchSample:
                                                                                {
                                                                                  uuid: batchSampleResponse[0]
                                                                                    ?.uuid,
                                                                                },
                                                                            };
                                                                          // Create sample
                                                                          this.samplesService
                                                                            .createLabSample(
                                                                              sample
                                                                            )
                                                                            .subscribe(
                                                                              (
                                                                                sampleResponse
                                                                              ) => {
                                                                                this.savingDataResponse =
                                                                                  sampleResponse;
                                                                                this.sampleLabelsUsedDetails =
                                                                                  [
                                                                                    ...this
                                                                                      .sampleLabelsUsedDetails,
                                                                                    {
                                                                                      ...sample,
                                                                                    },
                                                                                  ];

                                                                                this.samplesCreated =
                                                                                  [
                                                                                    ...this
                                                                                      .samplesCreated,
                                                                                    sampleResponse,
                                                                                  ];
                                                                                // TODO: Find a better way to control three labels to be printed

                                                                                this.sampleLabelsUsedDetails =
                                                                                  [
                                                                                    ...this
                                                                                      .sampleLabelsUsedDetails,
                                                                                    sample,
                                                                                  ];
                                                                                this.sampleLabelsUsedDetails =
                                                                                  [
                                                                                    ...this
                                                                                      .sampleLabelsUsedDetails,
                                                                                    sample,
                                                                                  ];

                                                                                // Create sample allocations

                                                                                if (
                                                                                  sampleResponse
                                                                                ) {
                                                                                  let ordersWithConceptsDetails =
                                                                                    [];

                                                                                  sampleResponse?.orders?.forEach(
                                                                                    (
                                                                                      order
                                                                                    ) => {
                                                                                      ordersWithConceptsDetails =
                                                                                        [
                                                                                          ...ordersWithConceptsDetails,
                                                                                          {
                                                                                            sample:
                                                                                              sampleResponse,
                                                                                            order:
                                                                                              {
                                                                                                sample:
                                                                                                  sampleResponse,
                                                                                                ...keyedOrders[
                                                                                                  order
                                                                                                    ?.uuid
                                                                                                ],
                                                                                              },
                                                                                          },
                                                                                        ];
                                                                                    }
                                                                                  );

                                                                                  this.savingData =
                                                                                    this
                                                                                      .formData[
                                                                                      "agency"
                                                                                    ]
                                                                                      ?.value ||
                                                                                    this
                                                                                      .fieldsWithValues[
                                                                                      "agency"
                                                                                    ]
                                                                                      ? true
                                                                                      : false;
                                                                                  let statuses =
                                                                                    [];
                                                                                  if (
                                                                                    this
                                                                                      .formData[
                                                                                      "agency"
                                                                                    ]
                                                                                      ?.value ||
                                                                                    this
                                                                                      .fieldsWithValues[
                                                                                      "agency"
                                                                                    ]
                                                                                  ) {
                                                                                    const agencyStatus =
                                                                                      {
                                                                                        sample:
                                                                                          {
                                                                                            uuid: sampleResponse?.uuid,
                                                                                          },
                                                                                        user: {
                                                                                          uuid: localStorage.getItem(
                                                                                            "userUuid"
                                                                                          ),
                                                                                        },
                                                                                        remarks:
                                                                                          this
                                                                                            .formData[
                                                                                            "agency"
                                                                                          ]
                                                                                            ?.value ||
                                                                                          this
                                                                                            .fieldsWithValues[
                                                                                            "agency"
                                                                                          ],
                                                                                        category:
                                                                                          "PRIORITY",
                                                                                        status:
                                                                                          "PRIORITY",
                                                                                      };
                                                                                    statuses =
                                                                                      [
                                                                                        ...statuses,
                                                                                        agencyStatus,
                                                                                      ];
                                                                                  }

                                                                                  if (
                                                                                    this
                                                                                      .formData[
                                                                                      "receivedOn"
                                                                                    ]
                                                                                      ?.value ||
                                                                                    this
                                                                                      .fieldsWithValues
                                                                                      ?.receivedOn
                                                                                  ) {
                                                                                    const receivedOnStatus =
                                                                                      {
                                                                                        sample:
                                                                                          {
                                                                                            uuid: sampleResponse?.uuid,
                                                                                          },
                                                                                        user: {
                                                                                          uuid: localStorage.getItem(
                                                                                            "userUuid"
                                                                                          ),
                                                                                        },
                                                                                        remarks:
                                                                                          this
                                                                                            .fieldsWithValues
                                                                                            ?.receivedOn
                                                                                            ? this.getTimestampFromDateAndTime(
                                                                                                this
                                                                                                  .fieldsWithValues
                                                                                                  ?.receivedOn
                                                                                              )
                                                                                            : this.getTimestampFromDateAndTime(
                                                                                                this
                                                                                                  .receivedOnDateLatestValue,
                                                                                                this
                                                                                                  .receivedOnTime
                                                                                              ),
                                                                                        status:
                                                                                          "RECEIVED_ON",
                                                                                        category:
                                                                                          "RECEIVED_ON",
                                                                                      };
                                                                                    statuses =
                                                                                      [
                                                                                        ...statuses,
                                                                                        receivedOnStatus,
                                                                                      ];
                                                                                  }

                                                                                  if (
                                                                                    this
                                                                                      .formData[
                                                                                      "broughtOn"
                                                                                    ]
                                                                                      ?.value ||
                                                                                    this
                                                                                      .fieldsWithValues
                                                                                      ?.broughtOn
                                                                                  ) {
                                                                                    const broughtOnStatus =
                                                                                      {
                                                                                        sample:
                                                                                          {
                                                                                            uuid: sampleResponse?.uuid,
                                                                                          },
                                                                                        user: {
                                                                                          uuid: localStorage.getItem(
                                                                                            "userUuid"
                                                                                          ),
                                                                                        },
                                                                                        remarks:
                                                                                          this
                                                                                            .fieldsWithValues
                                                                                            ?.broughtOn
                                                                                            ? this.getTimestampFromDateAndTime(
                                                                                                this
                                                                                                  .fieldsWithValues
                                                                                                  ?.broughtOn
                                                                                              )
                                                                                            : this.getTimestampFromDateAndTime(
                                                                                                this
                                                                                                  .broughtOnDateLatestValue,
                                                                                                this
                                                                                                  .broughtOnTime
                                                                                              ),
                                                                                        status:
                                                                                          "DELIVERED_ON",
                                                                                        category:
                                                                                          "DELIVERED_ON",
                                                                                      };
                                                                                    statuses =
                                                                                      [
                                                                                        ...statuses,
                                                                                        broughtOnStatus,
                                                                                      ];
                                                                                  }

                                                                                  if (
                                                                                    this
                                                                                      .formData[
                                                                                      "collectedOn"
                                                                                    ]
                                                                                      ?.value ||
                                                                                    this
                                                                                      .fieldsWithValues
                                                                                      ?.collectedOn
                                                                                  ) {
                                                                                    const collectedOnStatus =
                                                                                      {
                                                                                        sample:
                                                                                          {
                                                                                            uuid: sampleResponse?.uuid,
                                                                                          },
                                                                                        user: {
                                                                                          uuid: localStorage.getItem(
                                                                                            "userUuid"
                                                                                          ),
                                                                                        },
                                                                                        remarks:
                                                                                          this
                                                                                            .fieldsWithValues
                                                                                            ?.collectedOn
                                                                                            ? this.getTimestampFromDateAndTime(
                                                                                                this
                                                                                                  .fieldsWithValues
                                                                                                  ?.broughtOn
                                                                                              )
                                                                                            : this.getTimestampFromDateAndTime(
                                                                                                this
                                                                                                  .collectedOnDateLatestValue,
                                                                                                this
                                                                                                  .collectedOnTime
                                                                                              ),
                                                                                        status:
                                                                                          "COLLECTED_ON",
                                                                                        category:
                                                                                          "COLLECTED_ON",
                                                                                      };
                                                                                    statuses =
                                                                                      [
                                                                                        ...statuses,
                                                                                        collectedOnStatus,
                                                                                      ];
                                                                                  }

                                                                                  if (
                                                                                    this
                                                                                      .formData[
                                                                                      "condition"
                                                                                    ]
                                                                                      ?.value ||
                                                                                    this
                                                                                      .fieldsWithValues[
                                                                                      "condition"
                                                                                    ]
                                                                                  ) {
                                                                                    const conditionStatus =
                                                                                      {
                                                                                        sample:
                                                                                          {
                                                                                            uuid: sampleResponse?.uuid,
                                                                                          },
                                                                                        user: {
                                                                                          uuid: localStorage.getItem(
                                                                                            "userUuid"
                                                                                          ),
                                                                                        },
                                                                                        remarks:
                                                                                          this
                                                                                            .formData[
                                                                                            "condition"
                                                                                          ]
                                                                                            ?.value ||
                                                                                          this
                                                                                            .fieldsWithValues[
                                                                                            "condition"
                                                                                          ],
                                                                                        category:
                                                                                          "CONDITION",
                                                                                        status:
                                                                                          this
                                                                                            .formData[
                                                                                            "condition"
                                                                                          ]
                                                                                            ?.value,
                                                                                      };
                                                                                    statuses =
                                                                                      [
                                                                                        ...statuses,
                                                                                        conditionStatus,
                                                                                      ];
                                                                                  }

                                                                                  if (
                                                                                    this
                                                                                      .formData[
                                                                                      "receivedBy"
                                                                                    ]
                                                                                      ?.value ||
                                                                                    this
                                                                                      .fieldsWithValues[
                                                                                      "receivedBy"
                                                                                    ]
                                                                                  ) {
                                                                                    const receivedByStatus =
                                                                                      {
                                                                                        sample:
                                                                                          {
                                                                                            uuid: sampleResponse?.uuid,
                                                                                          },
                                                                                        user: {
                                                                                          uuid: this
                                                                                            .formData[
                                                                                            "receivedBy"
                                                                                          ]
                                                                                            ?.value
                                                                                            ? this
                                                                                                .formData[
                                                                                                "receivedBy"
                                                                                              ]
                                                                                                ?.value
                                                                                            : this
                                                                                                .fieldsWithValues[
                                                                                                "receivedBy"
                                                                                              ]
                                                                                            ? this
                                                                                                .fieldsWithValues[
                                                                                                "receivedBy"
                                                                                              ]
                                                                                            : localStorage.getItem(
                                                                                                "userUuid"
                                                                                              ),
                                                                                        },
                                                                                        category:
                                                                                          "RECEIVED_BY",
                                                                                        remarks:
                                                                                          "RECEIVED_BY",
                                                                                        status:
                                                                                          "RECEIVED_BY",
                                                                                      };
                                                                                    statuses =
                                                                                      [
                                                                                        ...statuses,
                                                                                        receivedByStatus,
                                                                                      ];
                                                                                  }

                                                                                  if (
                                                                                    this
                                                                                      .formData[
                                                                                      "collectedBy"
                                                                                    ]
                                                                                      ?.value ||
                                                                                    this
                                                                                      .fieldsWithValues[
                                                                                      "collectedBy"
                                                                                    ]
                                                                                  ) {
                                                                                    const collectedByStatus =
                                                                                      {
                                                                                        sample:
                                                                                          {
                                                                                            uuid: sampleResponse?.uuid,
                                                                                          },
                                                                                        user: {
                                                                                          uuid: localStorage.getItem(
                                                                                            "userUuid"
                                                                                          ),
                                                                                        },
                                                                                        remarks:
                                                                                          this
                                                                                            .formData[
                                                                                            "collectedBy"
                                                                                          ]
                                                                                            ?.value
                                                                                            ? this
                                                                                                .formData[
                                                                                                "collectedBy"
                                                                                              ]
                                                                                                ?.value
                                                                                            : this
                                                                                                .fieldsWithValues[
                                                                                                "receivedBy"
                                                                                              ]
                                                                                            ? this
                                                                                                .fieldsWithValues[
                                                                                                "receivedBy"
                                                                                              ]
                                                                                            : "NO COLLECTOR SPECIFIED",
                                                                                        status:
                                                                                          "COLLECTED_BY",
                                                                                        category:
                                                                                          "COLLECTED_BY",
                                                                                      };
                                                                                    statuses =
                                                                                      [
                                                                                        ...statuses,
                                                                                        collectedByStatus,
                                                                                      ];
                                                                                  }

                                                                                  if (
                                                                                    this
                                                                                      .formData[
                                                                                      "broughtBy"
                                                                                    ]
                                                                                      ?.value ||
                                                                                    this
                                                                                      .fieldsWithValues[
                                                                                      "broughtBy"
                                                                                    ]
                                                                                  ) {
                                                                                    const broughtdByStatus =
                                                                                      {
                                                                                        sample:
                                                                                          {
                                                                                            uuid: sampleResponse?.uuid,
                                                                                          },
                                                                                        user: {
                                                                                          uuid: localStorage.getItem(
                                                                                            "userUuid"
                                                                                          ),
                                                                                        },
                                                                                        remarks:
                                                                                          this
                                                                                            .formData[
                                                                                            "broughtBy"
                                                                                          ]
                                                                                            ?.value
                                                                                            ? this
                                                                                                .formData[
                                                                                                "broughtBy"
                                                                                              ]
                                                                                                ?.value
                                                                                            : this
                                                                                                .fieldsWithValues[
                                                                                                "broughtBy"
                                                                                              ]
                                                                                            ? this
                                                                                                .fieldsWithValues[
                                                                                                "broughtBy"
                                                                                              ]
                                                                                            : "NO PERSON SPECIFIED",
                                                                                        status:
                                                                                          "DELIVERED_BY",
                                                                                        category:
                                                                                          "DELIVERED_BY",
                                                                                      };
                                                                                    statuses =
                                                                                      [
                                                                                        ...statuses,
                                                                                        broughtdByStatus,
                                                                                      ];
                                                                                  }
                                                                                  if (
                                                                                    this
                                                                                      .formData[
                                                                                      "transportCondition"
                                                                                    ]
                                                                                      ?.value
                                                                                      .length >
                                                                                      0 ||
                                                                                    this
                                                                                      .fieldsWithValues[
                                                                                      "transportCondition"
                                                                                    ]
                                                                                  ) {
                                                                                    const transportCondition =
                                                                                      {
                                                                                        sample:
                                                                                          {
                                                                                            uuid: sampleResponse?.uuid,
                                                                                          },
                                                                                        user: {
                                                                                          uuid: localStorage.getItem(
                                                                                            "userUuid"
                                                                                          ),
                                                                                        },
                                                                                        remarks:
                                                                                          this
                                                                                            .formData[
                                                                                            "transportCondition"
                                                                                          ]
                                                                                            ?.value
                                                                                            ? this
                                                                                                .formData[
                                                                                                "transportCondition"
                                                                                              ]
                                                                                                ?.value
                                                                                            : this
                                                                                                .fieldsWithValues[
                                                                                                "transportCondition"
                                                                                              ]
                                                                                            ? this
                                                                                                .fieldsWithValues[
                                                                                                "transportCondition"
                                                                                              ]
                                                                                            : "NO TRANSPORT CONDITION SPECIFIED",
                                                                                        category:
                                                                                          "TRANSPORT_CONDITION",
                                                                                        status:
                                                                                          "TRANSPORT_CONDITION",
                                                                                      };
                                                                                    statuses =
                                                                                      [
                                                                                        ...statuses,
                                                                                        transportCondition,
                                                                                      ];
                                                                                  }
                                                                                  if (
                                                                                    this
                                                                                      .formData[
                                                                                      "transportationTemperature"
                                                                                    ]
                                                                                      ?.value
                                                                                      ?.length >
                                                                                      0 ||
                                                                                    this
                                                                                      .fieldsWithValues[
                                                                                      "transportationTemperature"
                                                                                    ]
                                                                                  ) {
                                                                                    const transportationTemperature =
                                                                                      {
                                                                                        sample:
                                                                                          {
                                                                                            uuid: sampleResponse?.uuid,
                                                                                          },
                                                                                        user: {
                                                                                          uuid: localStorage.getItem(
                                                                                            "userUuid"
                                                                                          ),
                                                                                        },
                                                                                        remarks:
                                                                                          this
                                                                                            .formData[
                                                                                            "transportationTemperature"
                                                                                          ]
                                                                                            ?.value
                                                                                            ? this
                                                                                                .formData[
                                                                                                "transportationTemperature"
                                                                                              ]
                                                                                                ?.value
                                                                                            : this
                                                                                                .fieldsWithValues[
                                                                                                "transportationTemperature"
                                                                                              ]
                                                                                            ? this
                                                                                                .fieldsWithValues[
                                                                                                "transportationTemperature"
                                                                                              ]
                                                                                            : "NO TRANSPORTATION TEMPERATURE SPECIFIED",
                                                                                        category:
                                                                                          "TRANSPORT_TEMPERATURE",
                                                                                        status:
                                                                                          "TRANSPORT_TEMPERATURE",
                                                                                      };
                                                                                    statuses =
                                                                                      [
                                                                                        ...statuses,
                                                                                        transportationTemperature,
                                                                                      ];
                                                                                  }

                                                                                  statuses =
                                                                                    [
                                                                                      ...statuses,
                                                                                      {
                                                                                        sample:
                                                                                          {
                                                                                            uuid: sampleResponse?.uuid,
                                                                                          },
                                                                                        user: {
                                                                                          uuid: localStorage.getItem(
                                                                                            "userUuid"
                                                                                          ),
                                                                                        },
                                                                                        category:
                                                                                          "SAMPLE_REGISTRATION_CATEGORY",
                                                                                        remarks:
                                                                                          "Sample registration form type reference",
                                                                                        status:
                                                                                          this
                                                                                            .registrationCategory,
                                                                                      },
                                                                                    ];

                                                                                  // console.log(
                                                                                  //   "statuses",
                                                                                  //   statuses
                                                                                  // );

                                                                                  if (
                                                                                    this
                                                                                      .personDetailsData
                                                                                      ?.pimaCOVIDLinkDetails
                                                                                  ) {
                                                                                    statuses =
                                                                                      [
                                                                                        ...statuses,
                                                                                        {
                                                                                          sample:
                                                                                            {
                                                                                              uuid: sampleResponse?.uuid,
                                                                                            },
                                                                                          user: {
                                                                                            uuid: localStorage.getItem(
                                                                                              "userUuid"
                                                                                            ),
                                                                                          },
                                                                                          category:
                                                                                            "INTEGRATION_PIMACOVID",
                                                                                          remarks:
                                                                                            "Sample registration from external systems",
                                                                                          status:
                                                                                            "INTEGRATION WITH PimaCOVID",
                                                                                        },
                                                                                      ];
                                                                                  }

                                                                                  if (
                                                                                    statuses?.length >
                                                                                    0
                                                                                  ) {
                                                                                    zip(
                                                                                      this.samplesService.setMultipleSampleStatuses(
                                                                                        statuses
                                                                                      )
                                                                                    ).subscribe(
                                                                                      (
                                                                                        sampleStatusResponse
                                                                                      ) => {
                                                                                        this.savingDataResponse =
                                                                                          sampleStatusResponse;
                                                                                        if (
                                                                                          sampleStatusResponse
                                                                                        ) {
                                                                                          const data =
                                                                                            {
                                                                                              identifier:
                                                                                                this
                                                                                                  .currentSampleLabel,
                                                                                              sample:
                                                                                                sampleResponse,
                                                                                              sampleLabelsUsedDetails:
                                                                                                this
                                                                                                  .sampleLabelsUsedDetails,
                                                                                              isLis:
                                                                                                this
                                                                                                  .LISConfigurations
                                                                                                  ?.isLIS,
                                                                                            };
                                                                                          this.dialog
                                                                                            .open(
                                                                                              SampleRegistrationFinalizationComponent,
                                                                                              {
                                                                                                height:
                                                                                                  "100px",
                                                                                                width:
                                                                                                  "30%",
                                                                                                data: {
                                                                                                  ...data,
                                                                                                  popupHeader:
                                                                                                    "Sample Saved",
                                                                                                },
                                                                                                disableClose:
                                                                                                  true,
                                                                                                panelClass:
                                                                                                  "custom-dialog-container",
                                                                                              }
                                                                                            )
                                                                                            .afterClosed()
                                                                                            .subscribe(
                                                                                              () => {
                                                                                                this.dynamicFields =
                                                                                                  [];
                                                                                                this.getBatch =
                                                                                                  [];
                                                                                                setTimeout(
                                                                                                  () => {
                                                                                                    this.assignFields();
                                                                                                  },
                                                                                                  100
                                                                                                );
                                                                                                this.openBarCodeDialog(
                                                                                                  data
                                                                                                );
                                                                                                this.isRegistrationReady =
                                                                                                  false;
                                                                                                setTimeout(
                                                                                                  () => {
                                                                                                    this.isRegistrationReady =
                                                                                                      true;
                                                                                                  },
                                                                                                  200
                                                                                                );
                                                                                              }
                                                                                            );
                                                                                          this.savingData =
                                                                                            false;
                                                                                        }
                                                                                      }
                                                                                    );
                                                                                  }
                                                                                }
                                                                              }
                                                                            );
                                                                        }
                                                                      }
                                                                    );
                                                                }
                                                              }
                                                            );
                                                        }
                                                      }
                                                    }
                                                  );

                                                // Set diagnosis if any

                                                if (
                                                  encounterResponse?.uuid &&
                                                  this.formData["icd10"]
                                                ) {
                                                  const diagnosisData = {
                                                    diagnosis: {
                                                      coded:
                                                        this.formData["icd10"]
                                                          ?.value,
                                                      nonCoded:
                                                        this.formData[
                                                          "diagnosis"
                                                        ]?.value,
                                                      specificName: null,
                                                    },
                                                    rank: 0,
                                                    condition: null,
                                                    certainty: "PROVISIONAL",
                                                    patient:
                                                      patientResponse?.uuid,
                                                    encounter:
                                                      encounterResponse?.uuid,
                                                  };

                                                  this.diagnosisService
                                                    .addDiagnosis(diagnosisData)
                                                    .subscribe(
                                                      (diagnosisResponse) => {
                                                        if (diagnosisResponse) {
                                                          this.savingData =
                                                            false;
                                                        }
                                                      }
                                                    );
                                                }
                                              } else {
                                                this.savingData = false;
                                                this.errorMessage =
                                                  encounterResponse?.error?.message;
                                              }
                                            }
                                          );
                                        }
                                      });
                                      // this.labOrdersService
                                      //   .createLabOrdersViaEncounter(encounterObject)
                                      //   .subscribe((encounterResponse) => {
                                      //     this.savingDataResponse = encounterResponse;

                                      //   });
                                      if (
                                        this.personDetailsData
                                          ?.pimaCOVIDLinkDetails
                                      ) {
                                        // Send to Extrnal System
                                        this.savingLabRequest = true;
                                        const labRequest =
                                          this.createLabRequestPayload(
                                            this.personDetailsData
                                              ?.pimaCOVIDLinkDetails
                                          );
                                        this.otherSystemsService
                                          .sendLabRequest(labRequest)
                                          .subscribe((response) => {
                                            if (response) {
                                              this.savingLabRequest = false;
                                            }
                                          });
                                      }
                                    } else {
                                      this.savingData = false;
                                    }
                                  });
                              } else {
                                this.errorMessage = !patientResponse?.error
                                  ?.error?.fieldErrors
                                  ? patientResponse?.error?.error?.message
                                  : !Object.keys(
                                      patientResponse?.error?.error?.fieldErrors
                                    )?.length
                                  ? "Error occured hence couldn't save the form"
                                  : patientResponse?.error?.error?.fieldErrors[
                                      Object.keys(
                                        patientResponse?.error?.error
                                          ?.fieldErrors
                                      )[0]
                                    ][0]?.message;
                                this.savingData = false;
                              }
                            });
                        }
                      });
                  }
                });
              } else {
                this.errorMessage = `Lab section not configured ${conceptSetsResponse?.error?.error?.message}`;
              }
            });
        }
      }
    });
  }

  isValidTime(
    time: string,
    date: string,
    validTime?: string,
    validDate?: string
  ): boolean {
    if (time) {
      let currentDate = new Date();

      let hours = time.split(":")[0];
      let mins = time.split(":")[1];
      let year = date?.split("-")[0];
      let month =
        date?.split("-")[1].toString()?.length > 1
          ? date?.split("-")[1]
          : `0${date?.split("-")[1]}`;
      let day =
        date?.split("-")[2].toString()?.length > 1
          ? date?.split("-")[2]
          : `0${date?.split("-")[2]}`;
      let inputDateString = `${year}-${month}-${day}`;

      let thisHours = validTime
        ? parseInt(validTime?.split(":")[0])
        : currentDate.getHours();
      let thisMinutes = validTime
        ? parseInt(validTime?.split(":")[1])
        : currentDate.getMinutes();
      let thisYear = currentDate.getFullYear();
      let thisMonth =
        (currentDate.getMonth() + 1).toString()?.length > 1
          ? currentDate.getMonth() + 1
          : `0${currentDate.getMonth() + 1}`;
      let thisDay =
        currentDate.getDate().toString()?.length > 1
          ? currentDate.getDate()
          : `0${currentDate.getDate()}`;
      let currentDateString = `${thisYear}-${thisMonth}-${thisDay}`;

      currentDateString = validDate ? validDate : currentDateString;

      if (
        inputDateString === currentDateString &&
        parseInt(hours) > thisHours
      ) {
        return false;
      }
      if (
        inputDateString === currentDateString &&
        parseInt(hours) === thisHours &&
        parseInt(mins) > thisMinutes
      ) {
        return false;
      }
      return true;
    }
    return true;
  }

  openBarCodeDialog(data): void {
    this.dialog
      .open(BarCodeModalComponent, {
        height: "200px",
        width: "20%",
        data,
        disableClose: true,
        panelClass: "custom-dialog-container",
      })
      .afterClosed()
      .subscribe((results) => {
        if (results) {
          let tests = [];
          results?.sampleData?.orders?.forEach((order) => {
            tests = [
              ...tests,
              order?.order?.shortName?.split("TEST_ORDERS:")?.join(""),
            ];
          });
          // let message = this.barcodeSettings?.barcode?.split("{{SampleID}}").join(results?.sampleData?.label);
          // message = message.split("{{PatientNames}}").join(`${results?.sampleData?.patient?.givenName} ${results?.sampleData?.patient?.middleName} ${results?.sampleData?.patient?.familyName}`);
          // message = message?.split("{{Date}}").join(formatDateToYYMMDD(new Date(results?.sampleData?.created), true));
          // message = message?.split("{{Storage}}").join("");
          // message = message?.split("{{Tests}}").join(tests?.join(","));
          const message = {
            SampleID: results?.sampleData?.label,
            Tests: tests?.join(","),
            PatientNames: `${results?.sampleData?.patient?.givenName} ${
              results?.sampleData?.patient?.middleName?.length
                ? results?.sampleData?.patient?.middleName
                : ""
            } ${results?.sampleData?.patient?.familyName}`,
            Date: formatDateToYYMMDD(
              new Date(results?.sampleData?.created),
              true
            ),
            Storage: "",
            Department:
              results?.sampleData?.department?.shortName
                ?.split("LAB_DEPARTMENT:")
                .join("") || "",
            BarcodeData: results?.sampleData?.label
              ?.split(this.barcodeSettings?.textToIgnore)
              .join(""),
          };
          this.connection.next({
            Message: message,
            Description: "Message of data to be printed",
            Type: "print",
          });
        }
      });
  }

  //   onGetIsDataFromExternalSystem(fromExternalSystem: boolean): void {
  //     this.fromExternalSystem = fromExternalSystem;
  //     this.testsUnderSpecimen$ = of(null);
  //   }

  //   onGetSelectedSystem(system): void {
  //     this.selectedSystem = system;
  //   }

  createLabRequestPayload(data): any {
    // TODO: Remove hardcoded UIDS
    this.labRequestPayload = {
      program: data?.program,
      programStage: "emVt37lHjub",
      orgUnit: data?.orgUnit,
      trackedEntityInstance: data?.trackedEntityInstance,
      enrollment: data?.enrollment,
      dataValues: [
        {
          dataElement: "Q98LhagGLFj",
          value: this.formatDateAndTime(new Date()),
        },
        { dataElement: "D0RBm3alWd9", value: "RT - PCR" },
        {
          dataElement: "RfWBPHo9MnC",
          value: this.formatDateAndTime(new Date()),
        },
        { dataElement: "HTBFvtjeztu", value: true },
        { dataElement: "xzuzLYN1f0J", value: true },
      ],
      eventDate: this.formatDateAndTime(new Date()),
    };
    return this.labRequestPayload;
  }

  formatDateAndTime(date: Date): string {
    return (
      formatDateToYYMMDD(date) +
      "T" +
      this.formatDimeChars(date.getHours().toString()) +
      ":" +
      this.formatDimeChars(date.getMinutes().toString()) +
      ":" +
      this.formatDimeChars(date.getSeconds().toString()) +
      ".000Z"
    );
  }

  formatDimeChars(char: string): string {
    return char.length == 1 ? "0" + char : char;
  }

  onPageChange(e: any) {
    console.log("==> On page change.");
  }

  getSelection(event: MatRadioChange): void {
    this.personDetailsCategory = event?.value;
    this.personDetailsData = {
      ...this.personDetailsData,
      isNewPatient: this.personDetailsCategory === "new",
      patientUuid: this.patientUuid,
      pimaCOVIDLinkDetails: !this.selectedClientData?.hasResults
        ? this.selectedClientData
        : null,
    };
    if (this.personDetailsCategory === "new") {
      this.setPersonDetails();
    }
  }
  onGetPersonDetails(personDetails: any): void {
    this.personDetailsData =
      this.registrationCategory === "CLINICAL"
        ? personDetails
        : this.registrationCategory === "EQA"
        ? EQA_PERSON_DATA
        : NON_CLINICAL_PERSON_DATA;
    if (this.fromExternalSystem && this.selectedSystem) {
      const uuid = (this.testsFromExternalSystemsConfigs.filter(
        (testConfigs) =>
          testConfigs?.referenceKeyPart ===
          this.selectedSystem?.testsSearchingKey
      ) || [])[0]?.value;
    }
    this.setPersonDetails(personDetails);
  }

  setPersonDetails(personDetails?: any): void {
    this.patientUuid = personDetails?.uuid;
    this.dynamicFields = [];
    setTimeout(() => {
      if (personDetails) {
        this.personDetailsData = {
          ...this.personDetailsData,
          ...personDetails,
          firstName: personDetails?.preferredName?.givenName,
          middleName: personDetails?.preferredName?.familyName2,
          lastName: personDetails?.preferredName?.familyName,
          mobileNumber: personDetails?.attributes?.filter((attribute) => {
            if (
              attribute?.attributeType === this.personPhoneAttributeTypeUuid
            ) {
              return attribute;
            }
          })[0]?.value,
          isNewPatient: this.personDetailsCategory === "new",
          patientUuid: this.patientUuid,
          pimaCOVIDLinkDetails: !this.selectedClientData?.hasResults
            ? this.selectedClientData
            : null,
        };
      }
      this.dynamicFields = this.fieldsObject?.dynamicFields?.map((field) => {
        const id =
          this.personDetailsData?.identifiers?.filter(
            (identifier) => identifier?.identifierType?.uuid === field?.id
          ) || [];
        console.log("==> Field ID: ", field?.id);
        field = {
          ...field,
          value:
            this.personDetailsData &&
            this.personDetailsData?.identifiers?.length &&
            id.length
              ? id[0]?.identifier
              : this.personDetailsData[field.id]
              ? this.personDetailsData[field.id]
              : null,
        };
        if (field.id === "dob") {
          field = {
            ...field,
            value:
              this.personDetailsData && this.personDetailsData?.birthdate
                ? new Date(personDetails?.birthdate)
                : null,
          };
        }

        return field;
      });
    }, 100);
  }

  getSelectedClientRequest(clientRequest: any): void {
    this.selectedClientData = clientRequest;
    // First Check if client exists
    this.personService
      .getPatientsByIdentifier(clientRequest?.passportNumber)
      .subscribe((response) => {
        if (response) {
          if (response?.length > 0) {
            this.personDetailsCategory === "existing";
            this.setPersonDetails(response[0]);
          } else {
            this.personDetailsData = {
              ...this.personDetailsData,
              preferredName: {
                givenName: clientRequest?.firstName,
                familyName2: clientRequest?.middleName,
                familyName: clientRequest?.lastName,
              },
              gender:
                clientRequest?.gender &&
                clientRequest?.gender?.toLowerCase() == "me"
                  ? "M"
                  : "F",
              email: clientRequest?.email,
              phoneNumber: clientRequest?.phoneNumber,
              birthdate: clientRequest?.dob,
            };
            this.setPersonDetails(this.personDetailsData);
          }
        }
      });
  }
}
