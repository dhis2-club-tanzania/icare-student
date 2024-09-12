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
import { LocationService } from "src/app/core/services";
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

import { uniqBy, keyBy, omit, groupBy, flatten } from "lodash";
import { OrdersService } from "src/app/shared/resources/order/services/orders.service";
import { SampleRegistrationFinalizationComponent } from "../sample-registration-finalization/sample-registration-finalization.component";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import { map } from "rxjs/operators";
import { OtherClientLevelSystemsService } from "src/app/modules/laboratory/resources/services/other-client-level-systems.service";
import { SharedConfirmationComponent } from "src/app/shared/components/shared-confirmation/shared-confirmation.component";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/reducers";
import { getLocationsByIds } from "src/app/store/selectors";
import { formatDateToYYMMDD } from "src/app/shared/helpers/format-date.helper";
import { webSocket } from "rxjs/webSocket";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";

@Component({
  selector: "app-single-registration",
  templateUrl: "./single-registration.component.html",
  styleUrls: ["./single-registration.component.scss"],
})
export class SingleRegistrationComponent implements OnInit, AfterViewInit {
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
  @Input() LISConfigurations: any;
  @Input() barcodeSettings: any;
  @Input() specimenSources: ConceptGetFull[];
  @Input() personEmailAttributeTypeUuid: string;
  @Input() personPhoneAttributeTypeUuid: string;
  @Input() labTestRequestProgramStageId: string;
  @Input() sampleRegistrationCategories: any[];
  @Input() specimenSourceConceptUuid: string;

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

  registrationCategory: any;
  // "CLINICAL";

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
  connection: any;
  referralFields: any[];
  referralData: any;
  showReferralDataFields: boolean = true;

  renderGenericForms: boolean = false;
  generalObsFormData: any = {};
  generalObservationsData: any;
  isGeneralObsFormValid: boolean = true;
  formId: string;

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
    private store: Store<AppState>
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
    // console.log(
    //   "sampleRegistrationCategories refKey",
    //   this.sampleRegistrationCategories
    // );
    this.registrationCategory = this.sampleRegistrationCategories[0];
    const userLocationsIds = JSON.parse(
      this.currentUser?.userProperties?.locations
    );
    this.labLocations$ = this.store.select(getLocationsByIds(userLocationsIds));
    this.labSampleLabel$ = this.samplesService.getSampleLabel();
    this.referringDoctorFields = Object.keys(
      this.allRegistrationFields?.referringDoctorFields
    ).map((key) => {
      return this.allRegistrationFields?.referringDoctorFields[key];
    });

    this.specimenDetailsFields = Object.keys(
      this.allRegistrationFields?.specimenDetailFields
    )
      .slice(0, 3)
      .map((key) => {
        const field = this.allRegistrationFields?.specimenDetailFields[key];
        return field;
      });
    this.createReferralFields();
    this.receivedOnField =
      this.allRegistrationFields?.specimenDetailFields?.receivedOn;
    this.receivedByField =
      this.allRegistrationFields?.specimenDetailFields?.receivedBy;
    this.transportCondition =
      this.allRegistrationFields?.specimenDetailFields?.transportCondition;
    this.transportationTemperature =
      this.allRegistrationFields?.specimenDetailFields?.transportationTemperature;

    this.sampleColectionDateField =
      this.allRegistrationFields?.specimenDetailFields?.collectedOn;
    this.sampleCollectedByField =
      this.allRegistrationFields?.specimenDetailFields?.collectedBy;
    this.broughtOnField =
      this.allRegistrationFields?.specimenDetailFields?.broughtOn;
    this.broughtByField =
      this.allRegistrationFields?.specimenDetailFields?.broughtBy;

    this.receivedOnField.max = this.maximumDate;
    this.broughtOnField.max = this.maximumDate;
    this.sampleColectionDateField.max = this.maximumDate;

    const currentLocation = JSON.parse(localStorage.getItem("currentLocation"));
    const labsAvailable =
      currentLocation && currentLocation?.childLocations
        ? currentLocation?.childLocations
        : [];

    this.renderGenericForms = true;
  }

  onCustomFormUpdate(data: FormValue): void {
    this.isGeneralObsFormValid = data.isValid;
    this.generalObsFormData = {
      ...this.generalObsFormData,
      ...data.getValues(),
    };
    this.selectedSpecimenUuid =
      this.generalObsFormData[this.specimenSourceConceptUuid]?.value;
    // console.log("this.selectedSpecimenUuid", this.selectedSpecimenUuid);
    if (this.selectedSpecimenUuid) {
      this.testsUnderSpecimen$ =
        this.labTestsService.getSetMembersByConceptUuid(
          this.selectedSpecimenUuid
        );
    }
    this.generalObservationsData = groupBy(
      Object.keys(this.generalObsFormData).map((key) => {
        return {
          concept: key,
          value: (this.generalObsFormData[key]?.value).toString(),
          form: this.generalObsFormData[key]?.form,
        };
      }) || [],
      "form"
    );
  }

  onGetFormId(id: string): void {
    this.formId = id;
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

  getSelection(event: MatRadioChange): void {
    this.registrationCategory = event?.value;
    this.renderGenericForms = false;
    setTimeout(() => {
      this.renderGenericForms = true;
    }, 20);
  }

  getTimestampFromDateAndTime(date: string, time: string): number {
    return new Date(`${date} ${time}`).getTime();
  }

  createReferralFields(): void {
    this.referralFields = [
      new Dropdown({
        id: "isReferred",
        key: "isReferred",
        label: "Referred?",
        required: true,
        options: [
          {
            key: "YES",
            label: "YES",
            name: "YES",
            value: "YES",
          },
          {
            key: "NO",
            label: "NO",
            name: "NO",
            value: "NO",
          },
        ],
      }),
      new Textbox({
        id: "referralReason",
        key: "referralReason",
        label: "Referral reason",
      }),
    ];
  }

  onGetReferralData(formValue: FormValue): void {
    const values = formValue.getValues();
    if (values["isReferred"]?.value === "YES") {
      this.referralData = {
        status: "REFERRED SAMPLE",
        category: "SAMPLE_REFERRAL",
        remarks: values?.referralReason?.value
          ? values?.referralReason?.value
          : "Referred",
      };
    }
  }

  getSelectedReceivedOnTime(event: Event): void {
    this.receivedOnTime = (event.target as any)?.value;
    this.receivedOnTimeValid = this.isValidTime(
      this.receivedOnTime,
      this.receivedOnDateLatestValue
        ? this.receivedOnDateLatestValue
        : this.maximumDate
    );
    if (this.collectedOnTime || this.broughtOnTime) {
      let valid1 = this.isValidTime(
        this.broughtOnTime ? this.broughtOnTime : this.collectedOnTime,
        this.broughtOnDateLatestValue
          ? this.broughtOnDateLatestValue
          : this?.collectedOnDateLatestValue
          ? this?.collectedOnDateLatestValue
          : this.maximumDate,
        this.receivedOnTime,
        this.receivedOnDateLatestValue
          ? this.receivedOnDateLatestValue
          : this.maximumDate
      );

      let valid2 = (this.receivedOnTimeValid = this.isValidTime(
        this.receivedOnTime,
        this.receivedOnDateLatestValue
          ? this.receivedOnDateLatestValue
          : this.maximumDate
      ));
      this.receivedOnTimeValid = valid1 && valid2 ? true : false;
    }
    this.formData = {
      ...this.formData,
      receivedAt: {
        value: (event.target as any)?.value,
        id: "receivedAt",
        key: "receivedAt",
      },
    };
  }

  getSelectedRCollectedOnTime(event: Event): void {
    this.collectedOnTime = (event.target as any)?.value;
    this.collectedOnTimeValid = this.isValidTime(
      this.collectedOnTime,
      this.collectedOnDateLatestValue
        ? this.collectedOnDateLatestValue
        : this.maximumDate
    );
    if (this.broughtOnTime || this.receivedOnTime) {
      this.collectedOnTimeValid = this.isValidTime(
        this.collectedOnTime,
        this.collectedOnDateLatestValue
          ? this.collectedOnDateLatestValue
          : this.maximumDate,
        this.broughtOnTime ? this.broughtOnTime : this.receivedOnTime,
        this.broughtOnDateLatestValue
          ? this.broughtOnDateLatestValue
          : this?.receivedOnDateLatestValue
      );
    }
    this.formData = {
      ...this.formData,
      collectedAt: {
        value: (event.target as any)?.value,
        id: "collectedAt",
        key: "collectedAt",
      },
    };
  }

  getSelectedBroughtOnTime(event: Event): void {
    this.broughtOnTime = (event.target as any)?.value;
    let valid1: boolean = true;
    let valid2: boolean = true;
    let valid3: boolean = true;
    let valid4: boolean = true;
    valid1 = this.isValidTime(
      this.broughtOnTime,
      this.broughtOnDateLatestValue
        ? this.broughtOnDateLatestValue
        : this.maximumDate
    );

    if (this.receivedOnTime) {
      valid2 = this.isValidTime(
        this.broughtOnTime,
        this.broughtOnDateLatestValue
          ? this.broughtOnDateLatestValue
          : this.maximumDate,
        this.receivedOnTime,
        this.receivedOnDateLatestValue
          ? this.receivedOnDateLatestValue
          : this.maximumDate
      );
      valid3 = valid1 && valid2 ? true : false;
    }
    if (this.collectedOnTime) {
      valid4 = this.isValidTime(
        this.collectedOnTime,
        this.collectedOnDateLatestValue
          ? this.collectedOnDateLatestValue
          : this.maximumDate,
        this.broughtOnTime,
        this.broughtOnDateLatestValue
          ? this.broughtOnDateLatestValue
          : this.maximumDate
      );
    }
    this.broughtOnTimeValid = valid1 && valid2 && valid3 && valid4;
    this.formData = {
      ...this.formData,
      broughtAt: {
        value: (event.target as any)?.value,
        id: "broughtAt",
        key: "broughtAt",
      },
    };
  }

  onGetDateTime(e: any) {
    console.log("==> Date time: ", e);
  }

  onFormUpdate(formValues: FormValue, itemKey?: string): void {
    //Validate Date fields
    this.formData = { ...this.formData, ...formValues.getValues() };
    if (formValues.getValues()?.collectedOn?.value.toString()?.length > 0) {
      let collected_on_date;
      collected_on_date = this.getDateStringFromDate(
        new Date(formValues.getValues()?.collectedOn?.value)
      );
      this.collectedOnDateLatestValue = collected_on_date;
      this.collectedOnTimeValid = this.isValidTime(
        this.collectedOnTime,
        this.collectedOnDateLatestValue
          ? this.collectedOnDateLatestValue
          : this.maximumDate
      );
    }
    if (formValues.getValues()?.receivedOn?.value?.toString()?.length > 0) {
      let received_on_date;
      received_on_date = this.getDateStringFromDate(
        new Date(formValues.getValues()?.receivedOn?.value)
      );
      this.receivedOnDateLatestValue = received_on_date;
      this.receivedOnTimeValid = this.isValidTime(
        this.receivedOnTime,
        this.receivedOnDateLatestValue
          ? this.receivedOnDateLatestValue
          : this.maximumDate
      );
    }
    if (formValues.getValues()?.broughtOn?.value.toString()?.length > 0) {
      let brought_on_date;
      brought_on_date = this.getDateStringFromDate(
        new Date(formValues.getValues()?.broughtOn?.value)
      );
      this.broughtOnDateLatestValue = brought_on_date;
      this.broughtOnTimeValid = this.isValidTime(
        this.broughtOnTime,
        this.broughtOnDateLatestValue
          ? this.broughtOnDateLatestValue
          : this.maximumDate
      );
    }

    this.minForReceivedOn = false;
    this.receivedOnField.min = this.broughtOnDateLatestValue
      ? this.broughtOnDateLatestValue
      : this.collectedOnDateLatestValue;
    this.broughtOnField.min = this.collectedOnDateLatestValue
      ? this.collectedOnDateLatestValue
      : "";
    this.minForReceivedOn = true;

    this.maxForCollectedOn = false;
    this.sampleColectionDateField.max = this.broughtOnDateLatestValue
      ? this.broughtOnDateLatestValue
      : this.receivedOnDateLatestValue
      ? this.receivedOnDateLatestValue
      : this.maximumDate;
    this.broughtOnField.max = this.receivedOnDateLatestValue
      ? this.receivedOnDateLatestValue
      : this.maximumDate;
    this.maxForCollectedOn = true;

    // this.getDateStringFromMoment_i();
    // if (
    //   itemKey &&
    //   itemKey === "specimenDetails" &&
    //   this.selectedSpecimenUuid !== this.formData["specimen"]?.value
    // ) {
    //   this.selectedSpecimenUuid = this.formData["specimen"]?.value;
    //   this.testsUnderSpecimen$ =
    //     this.labTestsService.getSetMembersByConceptUuid(
    //       this.selectedSpecimenUuid
    //     );
    // }
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

  onGetPersonDetails(personDetails: any): void {
    this.personDetailsData =
      this.registrationCategory?.refKey !== "non-clinical"
        ? personDetails
        : NON_CLINICAL_PERSON_DATA;
    if (this.fromExternalSystem && this.selectedSystem) {
      // console.log(
      //   "this.testsFromExternalSystemsConfigs",
      //   this.testsFromExternalSystemsConfigs
      // );
      // console.log(this.selectedSystem);
      // console.log(
      //   this.testsFromExternalSystemsConfigs.filter(
      //     (testConfigs) =>
      //       testConfigs?.referenceKeyPart ===
      //       this.selectedSystem?.testsSearchingKey
      //   ) || []
      // );
      const uuid = (this.testsFromExternalSystemsConfigs.filter(
        (testConfigs) =>
          testConfigs?.referenceKeyPart ===
          this.selectedSystem?.testsSearchingKey
      ) || [])[0]?.value;
      this.testsUnderSpecimen$ = this.conceptService
        .getConceptDetailsByUuid(uuid, "custom:(uuid,display)")
        .pipe(map((response) => [response]));
    }
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

  onSave(event: Event, forRejection?: boolean, labLocations?: any[]): void {
    event.stopPropagation();
    if (labLocations?.length === 1) {
      this.currentLabLocation = labLocations[0];
    } else {
      this.currentLabLocation = null;
      // Then user should define the lab
    }
    let confirmationDialogue = this.dialog.open(SharedConfirmationComponent, {
      minWidth: "25%",
      data: {
        modalTitle: forRejection ? `Save to reject sample` : `Save sample`,
        modalMessage: forRejection
          ? `You are about to register to reject the current sample. Proceed?`
          : `Proceed with saving sample?`,
        showRemarksInput: false,
        confirmationButtonText: "Proceed",
      },
    });

    confirmationDialogue.afterClosed().subscribe((closingObject) => {
      if (closingObject?.confirmed) {
        // Identify if tests ordered are well configured

        // Identify referring doctor fields entered values
        let attributeMissingOnDoctorsAttributes;
        this.sampleLabelsUsedDetails = [];
        const doctorsAttributesWithValues =
          this.referringDoctorAttributes.filter(
            (attribute) => this.formData["attribute-" + attribute?.value]?.value
          ) || [];
        if (
          doctorsAttributesWithValues?.length !=
          this.referringDoctorAttributes?.length
        ) {
          attributeMissingOnDoctorsAttributes = true;
          this.referringDoctorAttributes.forEach((attribute) => {
            if (!this.formData["attribute-" + attribute?.value]?.value) {
              this.formData["attribute-" + attribute?.value] = {
                id: "attribute-" + attribute?.value,
                value: "NONE",
              };
            }
          });
        }

        const testOrdersWithNoDepartments: any[] = flatten(
          this.groupedTestOrdersByDepartments
            ?.map((groupedTestOrdersByDepartment: any) => {
              if (
                (
                  groupedTestOrdersByDepartment?.filter(
                    (testOrder: any) => !testOrder?.departmentUuid
                  ) || []
                )?.length > 0
              ) {
                return (
                  groupedTestOrdersByDepartment?.filter(
                    (testOrder: any) => !testOrder?.departmentUuid
                  ) || []
                );
              }
            })
            ?.filter(
              (testOrdersWithNoDepartment: any) => testOrdersWithNoDepartment
            )
        );
        this.personDetailsData =
          this.registrationCategory?.refKey !== "non-clinical"
            ? this.personDetailsData
            : NON_CLINICAL_PERSON_DATA;
        if (this.testOrders?.length === 0) {
          this.errorMessage = "No test has been selected";
        } else if (testOrdersWithNoDepartments.length > 0) {
          this.errorMessage = `Test${
            testOrdersWithNoDepartments.length > 1 ? "s" : ""
          }s
            ${(
              testOrdersWithNoDepartments?.map(
                (testOrderWithNoDept: any) => testOrderWithNoDept?.display
              ) || []
            ).join(", ")}
            " ${
              testOrdersWithNoDepartments?.length > 1 ? " have " : " has "
            } no departments set, Contact IT for support`;
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
                3. Create sample
                */

                          this.patientPayload = {
                            person: {
                              names: [
                                {
                                  givenName: this.personDetailsData?.firstName,
                                  familyName: this.personDetailsData?.lastName,
                                  familyName2:
                                    this.personDetailsData?.middleName,
                                },
                              ],
                              gender:
                                this.personDetailsData?.gender.length > 0
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
                              ]?.filter(
                                (personAttribute: any) => personAttribute?.value
                              ),
                            },
                            identifiers:
                              this.registrationCategory?.refKey !==
                              "non-clinical"
                                ? (patientIdentifierTypes || [])
                                    .map((personIdentifierType) => {
                                      if (
                                        personIdentifierType.id ===
                                        this.preferredPersonIdentifier
                                      ) {
                                        return {
                                          identifier: this.personDetailsData[
                                            "mrn"
                                          ]
                                            ? this.personDetailsData["mrn"]
                                            : this.personDetailsData[
                                                personIdentifierType.id
                                              ],
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

                                if (
                                  this.registrationCategory?.refKey !==
                                  "non-clinical"
                                ) {
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
                                        ...this.groupedTestOrdersByDepartments?.map(
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
                                            let encounterObjects = [
                                              {
                                                visit: visitResponse?.uuid,
                                                patient: patientResponse?.uuid,
                                                encounterType:
                                                  "9b46d3fe-1c3e-4836-a760-f38d286b578b",
                                                location:
                                                  this.currentLocation?.uuid,
                                                orders,
                                                obs:
                                                  obs?.filter(
                                                    (observation) =>
                                                      observation?.value
                                                  ) || [],
                                                encounterProviders: [
                                                  {
                                                    provider:
                                                      this.provider?.uuid,
                                                    encounterRole:
                                                      ICARE_CONFIG.encounterRole,
                                                  },
                                                ],
                                              },
                                            ];
                                            encounterObjects = [
                                              ...encounterObjects,
                                              ...Object.keys(
                                                this.generalObservationsData
                                              ).map((key) => {
                                                return {
                                                  visit: visitResponse?.uuid,
                                                  patient:
                                                    patientResponse?.uuid,
                                                  encounterType:
                                                    "9b46d3fe-1c3e-4836-a760-f38d286b578b",
                                                  location:
                                                    this.currentLocation?.uuid,
                                                  orders: [],
                                                  obs: (
                                                    this.generalObservationsData[
                                                      key
                                                    ]?.map((obs) =>
                                                      omit(obs, "form")
                                                    ) || []
                                                  )
                                                    .filter((obs) => obs?.value)
                                                    .map((obsValue) => {
                                                      return {
                                                        ...obsValue,
                                                        value:
                                                          obsValue?.value?.indexOf(
                                                            "GMT+"
                                                          ) === -1
                                                            ? obsValue?.value
                                                            : formatDateToYYMMDD(
                                                                new Date(
                                                                  obsValue?.value
                                                                )
                                                              ) +
                                                              " " +
                                                              this.formatDimeChars(
                                                                new Date(
                                                                  obsValue?.value
                                                                )
                                                                  .getHours()
                                                                  .toString()
                                                              ) +
                                                              ":" +
                                                              this.formatDimeChars(
                                                                new Date(
                                                                  obsValue?.value
                                                                )
                                                                  .getMinutes()
                                                                  .toString()
                                                              ),
                                                      };
                                                    }),
                                                  encounterProviders: [
                                                    {
                                                      provider:
                                                        this.provider?.uuid,
                                                      encounterRole:
                                                        ICARE_CONFIG.encounterRole,
                                                    },
                                                  ],
                                                  form: key,
                                                };
                                              }),
                                            ];
                                            return zip(
                                              ...encounterObjects.map(
                                                (encounterObject) =>
                                                  this.labOrdersService.createLabOrdersViaEncounter(
                                                    encounterObject
                                                  )
                                              )
                                            ).pipe(
                                              map((responses) => {
                                                return responses[0];
                                              })
                                            );
                                          }
                                        )
                                      ).subscribe((responses: any[]) => {
                                        if (responses) {
                                          // console.log(
                                          //   "responsesjsjsj",
                                          //   flatten(responses)
                                          // );
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
                                                        this.samplesService
                                                          .getIncreamentalSampleLabel()
                                                          .subscribe(
                                                            (sampleLabel) => {
                                                              if (sampleLabel) {
                                                                const sample = {
                                                                  visit: {
                                                                    uuid: visitResponse?.uuid,
                                                                  },
                                                                  label:
                                                                    sampleLabel,
                                                                  concept: {
                                                                    uuid: (this.groupedTestOrdersByDepartments[
                                                                      index
                                                                    ]?.filter(
                                                                      (dpt) =>
                                                                        dpt?.systemName?.indexOf(
                                                                          "LAB_DEPARTMENT:"
                                                                        ) > -1
                                                                    ) || [])[0]
                                                                      ?.uuid,
                                                                  },
                                                                  specimenSource:
                                                                    {
                                                                      uuid: this
                                                                        .selectedSpecimenUuid,
                                                                    },
                                                                  location: {
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
                                                                            ?.value
                                                                            ? true
                                                                            : false;
                                                                        let statuses =
                                                                          [];
                                                                        if (
                                                                          this
                                                                            .formData[
                                                                            "agency"
                                                                          ]
                                                                            ?.value
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
                                                                                  ?.value,
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
                                                                                this.registrationCategory?.refKey?.toUpperCase(),
                                                                            },
                                                                          ];

                                                                        if (
                                                                          this
                                                                            .referralData
                                                                        ) {
                                                                          statuses =
                                                                            [
                                                                              ...statuses,
                                                                              {
                                                                                ...this
                                                                                  .referralData,
                                                                                sample:
                                                                                  {
                                                                                    uuid: sampleResponse?.uuid,
                                                                                  },
                                                                                user: {
                                                                                  uuid: localStorage.getItem(
                                                                                    "userUuid"
                                                                                  ),
                                                                                },
                                                                              },
                                                                            ];
                                                                        }

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
                                                                              remarks:
                                                                                "Sample collection",
                                                                              category:
                                                                                "COLLECTED",
                                                                              status:
                                                                                "COLLECTED",
                                                                            },
                                                                          ];

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
                                                                                        forRejection
                                                                                          ? "200px"
                                                                                          : "100px",
                                                                                      width:
                                                                                        "30%",
                                                                                      data: {
                                                                                        ...data,
                                                                                        forRejection:
                                                                                          forRejection,
                                                                                        popupHeader:
                                                                                          forRejection
                                                                                            ? "Sample Rejection"
                                                                                            : "Sample Saved",
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

  toggleFieldSet(fieldName: string) {
    switch (fieldName) {
      case "sampleInformation":
        this.sampleInformation = !this.sampleInformation;
        break;
      case "clinicalData":
        this.clinicalData = !this.clinicalData;
        break;
      case "referingDoctor":
        this.referingDoctor = !this.referingDoctor;
        break;
      case "broughtBy":
        this.broughtBy = !this.broughtBy;
        break;
      case "tests":
        this.tests = !this.tests;
        break;
      case "referralData":
        this.showReferralDataFields = !this.showReferralDataFields;
        break;
      default:
        break;
    }
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
              order?.order?.shortName?.replace("TEST_ORDERS:")?.join(""),
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

  onGetIsDataFromExternalSystem(fromExternalSystem: boolean): void {
    this.fromExternalSystem = fromExternalSystem;
    this.testsUnderSpecimen$ = of(null);
  }

  onGetSelectedSystem(system): void {
    this.selectedSystem = system;
  }

  createLabRequestPayload(data): any {
    // TODO:Softcode program stage ID
    this.labRequestPayload = {
      program: data?.program,
      programStage: "emVt37lHjub",
      orgUnit: data?.orgUnit,
      trackedEntityInstance: data?.trackedEntityInstance,
      enrollment: data?.enrollment,
      dataValues: [
        {
          dataElement: "Q98LhagGLFj",
          value: this.formatDateAndTime(
            new Date(
              this.getTimestampFromDateAndTime(
                this.receivedOnDateLatestValue,
                this.receivedOnTime
              )
            )
          ),
        },
        { dataElement: "D0RBm3alWd9", value: "RT - PCR" },
        {
          dataElement: "RfWBPHo9MnC",
          value: this.formatDateAndTime(
            new Date(
              this.getTimestampFromDateAndTime(
                this.receivedOnDateLatestValue,
                this.receivedOnTime
              )
            )
          ),
        },
        { dataElement: "HTBFvtjeztu", value: true },
        { dataElement: "xzuzLYN1f0J", value: true },
      ],
      eventDate: new Date(
        this.getTimestampFromDateAndTime(
          this.receivedOnDateLatestValue,
          this.receivedOnTime
        )
      ),
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
}
