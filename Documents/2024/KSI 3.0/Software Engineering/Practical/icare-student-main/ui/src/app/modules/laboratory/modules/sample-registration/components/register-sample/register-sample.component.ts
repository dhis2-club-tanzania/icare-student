import { Component, Input, OnInit } from "@angular/core";
import { MatRadioChange } from "@angular/material/radio";
import { Store } from "@ngrx/store";
import { Observable, zip } from "rxjs";
import { map, take, tap, withLatestFrom } from "rxjs/operators";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { LabSampleModel } from "src/app/modules/laboratory/resources/models";
import { LISConfigurationsModel } from "src/app/modules/laboratory/resources/models/lis-configurations.model";
import { RegistrationService } from "src/app/modules/registration/services/registration.services";
import { DateField } from "src/app/shared/modules/form/models/date-field.model";
import { DateTimeField } from "src/app/shared/modules/form/models/date-time-field.model";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { PhoneNumber } from "src/app/shared/modules/form/models/phone-number.model";
import { TextArea } from "src/app/shared/modules/form/models/text-area.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";
import { ConceptGetFull } from "src/app/shared/resources/openmrs";
import { SamplesService } from "src/app/shared/services/samples.service";
import {
  loadConceptByUuid,
  loadLocationsByTagName,
  loadLocationsByTagNames,
} from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import { getConceptById } from "src/app/store/selectors";
import { getCurrentUserDetails } from "src/app/store/selectors/current-user.selectors";

@Component({
  selector: "app-register-sample",
  templateUrl: "./register-sample.component.html",
  styleUrls: ["./register-sample.component.scss"],
})
export class RegisterSampleComponent implements OnInit {
  @Input() provider: any;
  @Input() LISConfigurations: LISConfigurationsModel;
  @Input() labSections: ConceptGetFull[];
  @Input() fromMaintenance: boolean;
  @Input() specimenSources: ConceptGetFull[]
  registrationCategory: string = "single";
  currentUser$: Observable<any>;

  labSamples$: Observable<{ pager: any; results: LabSampleModel[] }>;
  mrnGeneratorSourceUuid$: Observable<string>;
  preferredPersonIdentifier$: Observable<string>;

  agencyConceptConfigs$: Observable<any>;
  agencyConceptConfigs: any;
  referFromFacilityVisitAttribute$: Observable<string>;

  referringDoctorAttributes$: Observable<any>;
  labNumberCharactersCount$: Observable<string>;
  testsFromExternalSystemsConfigs$: Observable<any[]>;
  labLocations$: Observable<any>;

  selectedTabGroup: string = "NEW";
  referringDoctorAttributes: any;
  referringDoctorFields: any;
  specimenDetailsFields: any;
  receivedOnField: DateField;
  agencyFormField: Dropdown;
  transportCondition: Dropdown;
  transportationTemperature: Dropdown;
  personDetailsData: any;
  primaryIdentifierFields: any;
  referFromFacilityVisitAttribute: string;
  personAgeField: any;
  personDOBField: any;
  personFieldsGroupThree: any;
  personFields: any;
  patientAgeFields: any;
  allRegistrationFields: any;
  clinicalFormFields: any;
  manyObservables$: Observable<any>;
  identifierTypes$: Observable<any>;
  batchRegistrationFields: any;
  batchsets$: Observable<any>;
  batches$: Observable<any>;
  testFields: any;
  barcodeSettings$: Observable<any>;
  errors: any[] = [];

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

  constructor(
    private samplesService: SamplesService,
    private systemSettingsService: SystemSettingsService,
    private store: Store<AppState>,
    private registrationService: RegistrationService
  ) {}

  ngOnInit(): void {
    this.currentUser$ = this.store.select(getCurrentUserDetails);

    this.store.dispatch(
      loadLocationsByTagNames({ tagNames: ["Lab+Location"] })
    );

    this.mrnGeneratorSourceUuid$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "iCare.generateMRN.source"
      );
    this.preferredPersonIdentifier$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "iCare.preferredPersonIdentifier"
      );
    this.referFromFacilityVisitAttribute$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "lis.attribute.referFromFacility"
      );

    this.agencyConceptConfigs$ = this.store.select(getConceptById, {
      id: this.LISConfigurations?.agencyConceptUuid,
    });

    this.batchsets$ = this.samplesService.getBatchsets().pipe(
      map((response) => {
        if (!response?.error) {
          return response;
        }
      })
    );
    this.batches$ = this.samplesService.getBatches().pipe(
      map((response) => {
        if (!response?.error) {
          return response;
        }
      })
    );

    this.referringDoctorAttributes$ =
      this.systemSettingsService.getSystemSettingsMatchingAKey(
        "lis.attributes.referringDoctor"
      );

    this.barcodeSettings$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "iCare.laboratory.settings.print.barcodeFormat"
      ).pipe(tap((response) => {
        if(response === "none"){
          this.errors = [
            ...this.errors,
            {
              error: {
                message: "iCare.laboratory.settings.print.barcodeFormat is not set. You won't be able to print barcode."
              },
              type: "warning"
            },
          ]
        }
        if(response?.error){
           this.errors = [
            ...this.errors,
            response?.error
          ]
        }
      }));

    this.identifierTypes$ =
      this.registrationService.getPatientIdentifierTypes();

    this.testsFromExternalSystemsConfigs$ =
      this.systemSettingsService.getSystemSettingsMatchingAKey(
        `iCare.externalSystems.integrated.tests`
      );
    this.store.dispatch(
      loadConceptByUuid({
        uuid: this.LISConfigurations?.agencyConceptUuid,
        fields: "custom:(uuid,display,setMembers:(uuid,display))",
      })
    );

    this.labNumberCharactersCount$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "lis.settings.labNumber.charactersCount"
      );

    this.initializeRegistrationFields();
  }

  getSelection(event: MatRadioChange): void {
    this.registrationCategory = event?.value;
  }

  setTabGroup(event: Event, group: string): void {
    event.stopPropagation();
    this.selectedTabGroup = group;
  }

  onReloadRegisterSample(eventData: any) {
    this.ngOnInit();
    this.selectedTabGroup = eventData?.fromKey;
  }

  initializeRegistrationFields() {
    this.specimenDetailsFields = {
      specimen: new Dropdown({
        id: "specimen",
        key: "specimen",
        label: "Specimen",
        searchTerm: "SPECIMEN_SOURCE",
        options: [],
        conceptClass: "Specimen",
        searchControlType: "concept",
        shouldHaveLiveSearchForDropDownFields: true,
      }),
      condition: new Dropdown({
        id: "condition",
        key: "condition",
        label: "Condition",
        options: [],
        conceptClass: "condition",
        searchControlType: "concept",
        searchTerm: "SAMPLE_CONDITIONS",
        shouldHaveLiveSearchForDropDownFields: true,
      }),
      agency: new Dropdown({
        id: "agency",
        key: "agency",
        label: "Urgency/Priority",
        shouldHaveLiveSearchForDropDownFields: false,
      }),
      receivedBy: new Dropdown({
        id: "receivedBy",
        key: "receivedBy",
        label: "Received By",
        options: [],
        shouldHaveLiveSearchForDropDownFields: true,
        searchControlType: "user",
      }),
      receivedOn: new DateField({
        id: "receivedOn",
        key: "receivedOn",
        label: "Received On",
        allowCustomDateTime: true,
      }),
      transportCondition: new Dropdown({
        id: "transportCondition",
        key: "transportCondition",
        label: "Transport Condition",
        searchTerm: "SAMPLE_TRANSPORT_CONDITION",
        required: false,
        options: [],
        multiple: false,
        conceptClass: "Misc",
        searchControlType: "concept",
        shouldHaveLiveSearchForDropDownFields: true,
      }),
      transportationTemperature: new Dropdown({
        id: "transportationTemperature",
        key: "transportationTemperature",
        label: "Transportation Temperature",
        searchTerm: "SAMPLE_TRANSPORT_TEMPERATURE",
        required: false,
        options: [],
        multiple: false,
        conceptClass: "Misc",
        searchControlType: "concept",
        shouldHaveLiveSearchForDropDownFields: true,
      }),
      collectedOn: new DateField({
        id: "collectedOn",
        key: "collectedOn",
        label: "Collected On",
        allowCustomDateTime: true
      }),
      collectedBy: new Textbox({
        id: "collectedBy",
        key: "collectedBy",
        label: "Collected By",
      }),
      broughtOn: new DateField({
        id: "broughtOn",
        key: "broughtOn",
        label: "Delivered On",
        allowCustomDateTime: true,
      }),
      broughtBy: new Textbox({
        id: "broughtBy",
        key: "broughtBy",
        label: "Delivered By",
      }),
    };
    this.clinicalFormFields = {
      icd10: new Dropdown({
        id: "icd10",
        key: "icd10",
        label: "ICD 10",
        options: [],
        conceptClass: "Diagnosis",
        shouldHaveLiveSearchForDropDownFields: true,
      }),
      notes: new TextArea({
        id: "notes",
        key: "notes",
        label: "Clinical Information / History",
        type: "text",
      }),
      diagnosis: new Textbox({
        id: "diagnosis",
        key: "diagnosis",
        label: "Diagnosis - Clinical",
        type: "text",
      }),
    };
    this.personFields = {
      firstName: new Textbox({
        id: "firstName",
        key: "firstName",
        label: "First name",
        required: true,
        type: "text",
      }),
      middleName: new Textbox({
        id: "middleName",
        key: "middleName",
        label: "Middle name",
        type: "text",
      }),
      lastName: new Textbox({
        id: "lastName",
        key: "lastName",
        label: "Last name",
        required: true,
        type: "text",
      }),
      gender: new Dropdown({
        id: "gender",
        key: "gender",
        label: "Gender",
        required: false,
        type: "text",
        options: [
          {
            key: "Male",
            label: "Male",
            value: "M",
          },
          {
            key: "Female",
            label: "Female",
            value: "F",
          },
        ],
        shouldHaveLiveSearchForDropDownFields: false,
      }),
    };
    this.patientAgeFields = {
      age: new Textbox({
        id: "age",
        key: "age",
        label: "Age",
        required: false,
        type: "number",
        min: 0,
        max: 150,
      }),
      dob: new DateField({
        id: "dob",
        key: "dob",
        label: "Date of birth",
        required: true,
        type: "date",
        max: this.maximumDate,
      }),
    };
    this.personFieldsGroupThree = {
      mobileNumber: new PhoneNumber({
        id: "mobileNumber",
        key: "mobileNumber",
        label: "Mobile number",
        required: false,
        type: "number",
        min: 0,
        placeholder: "Mobile number",
        category: "phoneNumber",
      }),
      email: new Textbox({
        id: "email",
        key: "email",
        label: "Email",
        required: false,
        type: "text",
        placeholder: "Email",
        category: "email",
      }),
      address: new TextArea({
        id: "address",
        key: "address",
        label: "Address",
        required: false,
        type: "text",
      }),
    };

    this.batchRegistrationFields = {
      addFixedField: new Dropdown({
        id: "addFixedField",
        key: "addFixedField",
        label: "Select fixed field(s)",
        shouldHaveLiveSearchForDropDownFields: false,
        multiple: true,
      }),
      addStaticField: new Dropdown({
        id: "addStaticField",
        key: "addStaticField",
        label: "Select static field(s)",
        shouldHaveLiveSearchForDropDownFields: false,
        multiple: true,
      }),
      addDynamicField: new Dropdown({
        id: "addDynamicField",
        key: "addDynamicField",
        label: "Select dynamic field(s)",
        shouldHaveLiveSearchForDropDownFields: false,
        multiple: true,
      }),
      existingBatchField: new Dropdown({
        id: "existingBatch",
        key: "existingBatch",
        label: "Select exising batch",
        shouldHaveLiveSearchForDropDownFields: false,
      }),
      batchNameField: new Textbox({
        id: "batchName",
        key: "batchName",
        label: "Type Batch Name",
      }),
      batchDescriptionField: new TextArea({
        id: "batchDescription",
        key: "batchDescription",
        label: "Batch Description",
      }),
      existingBatchsetField: new Dropdown({
        id: "existingBatchset",
        key: "existingBatchset",
        label: "Select exising batch set",
        shouldHaveLiveSearchForDropDownFields: false,
      }),
      batchsetNameField: new Textbox({
        id: "batchsetName",
        key: "batchsetName",
        label: "Type Batchset Name",
      }),
      batchsetDescriptionField: new TextArea({
        id: "batchsetDescription",
        key: "batchsetDescription",
        label: "Batchset Description",
      }),
    };

    this.testFields = {
      testorders: new Dropdown({
        id: "testorders",
        key: "testorders",
        label: "Select Test Orders",
        required: true,
        options: [],
        searchControlType: "concept",
        searchTerm: "TEST_ORDERS",
        conceptClass: "Test",
        multiple: true,
        shouldHaveLiveSearchForDropDownFields: true,
      }),
    };

    this.allRegistrationFields = {
      batchRegistrationFields: this.batchRegistrationFields,
      specimenDetailFields: this.specimenDetailsFields,
      personFields: this.personFields,
      patientAgeFields: this.patientAgeFields,
      personFieldsGroupThree: this.personFieldsGroupThree,
      clinicalFormFields: this.clinicalFormFields,
      testFields: this.testFields,
    };
  }
}
