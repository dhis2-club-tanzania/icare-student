import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { MatRadioChange } from "@angular/material/radio";
import { RegistrationService } from "src/app/modules/registration/services/registration.services";
import { FieldComponent } from "src/app/shared/modules/form/components/field/field.component";
import { FormComponent } from "src/app/shared/modules/form/components/form/form.component";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import * as moment from "moment";
import { PersonService } from "src/app/core/services/person.service";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { PatientService } from "src/app/shared/services/patient.service";

@Component({
  selector: "app-person-details",
  templateUrl: "./person-details.component.html",
  styleUrls: ["./person-details.component.scss"],
})
export class PersonDetailsComponent implements OnInit {
  @Input() referFromFacilityVisitAttribute: string;
  @Input() maximumDate: string;
  @Input() allRegistrationFields: any;

  @Input() personEmailAttributeTypeUuid: string;
  @Input() personPhoneAttributeTypeUuid: string;
  @Input() labTestRequestProgramStageId: string;

  patientIdentifierTypes: any[];
  @Output() personDetails: EventEmitter<any> = new EventEmitter<any>();
  personDetailsCategory: string = "new";
  personDetailsData: any = {};
  personFields: any[];
  personAgeField: any[];
  personDOBField: any[];
  personFieldsGroupThree: any[];
  identifiersFields: any[];
  primaryIdentifierFields: any[];
  showOtherIdentifiers: boolean = false;
  patientUuid: string;
  identifierTypes: any[] = [];
  age: number = 0;
  month: number = 0;
  searchByIdentifier: boolean = false;

  selectedClientData: any;

  @ViewChild(FormComponent, { static: false })
  formComponent: FormComponent;

  @ViewChildren("fieldItem")
  fieldItems: QueryList<FieldComponent>;

  pinnedCategory: string;
  @Output() selectedSystem: EventEmitter<any> = new EventEmitter<any>();

  @Output() fromExternalSystem: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  existingPersons$: Observable<any>;
  showSearchedDetails: boolean = false;
  lastIdentifier: string;

  constructor(
    private registrationService: RegistrationService,
    private personService: PersonService,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.pinnedCategory = localStorage.getItem("pinnedCategory");
    this.personDetailsCategory = this.pinnedCategory
      ? this.pinnedCategory
      : this.personDetailsCategory;
    this.registrationService
      .getPatientIdentifierTypes()
      .subscribe((response) => {
        if (response) {
          this.identifierTypes = response;
          this.setIdentifierFields(this.identifierTypes);
        }
      });
    this.setPersonDetails();
  }

  onPinThis(event: Event, category: string): void {
    event.stopPropagation();
    this.personDetailsCategory = category;
    this.pinnedCategory = category;
    const storedCategory = localStorage.getItem("pinnedCategory");
    if (storedCategory != this.pinnedCategory) {
      localStorage.setItem("pinnedCategory", category);
    } else {
      this.pinnedCategory = null;
      localStorage.removeItem("pinnedCategory");
    }
  }

  setIdentifierFields(
    identifierTypes: any[],
    personDetails?: any,
    patientIdentifier?: string
  ): void {
    this.primaryIdentifierFields = Object.keys(
      this.allRegistrationFields?.primaryIdentifierFields
    ).map((key) => {
      return {
        ...this.allRegistrationFields?.primaryIdentifierFields[key],
        value: patientIdentifier
          ? patientIdentifier
          : personDetails && personDetails?.identifiers?.length > 0
          ? (personDetails?.identifiers?.filter(
              (identifier) =>
                identifier?.identifierType?.uuid ===
                this.allRegistrationFields?.primaryIdentifierFields[key]?.id
            ) || [])[0]?.identifier
          : null,
      };
    });

    this.identifiersFields = Object.keys(
      this.allRegistrationFields?.otherIdentifiersFields
    ).map((key) => {
      return {
        ...this.allRegistrationFields?.otherIdentifiersFields[key],
        value: patientIdentifier
          ? patientIdentifier
          : personDetails && personDetails?.identifiers?.length > 0
          ? (personDetails?.identifiers?.filter(
              (identifier) =>
                identifier?.identifierType?.uuid ===
                this.allRegistrationFields?.otherIdentifiersFields[key]?.id
            ) || [])[0]?.identifier
          : null,
      };
    });
  }

  getAge(event: any): void {
    event.stopPropagation();
    this.personDetailsData["age"] = this.age;
    this.personDetailsData["month"] = this.month;
    this.personDOBField = [this.allRegistrationFields?.patientAgeFields?.dob];
    if (this.personDetailsData["age"] || this.personDetailsData["month"]) {
      let monthDate = this.personDetailsData["month"]
        ? new Date().getMonth() - Number(this.personDetailsData["month"])
        : new Date().getMonth();
      this.personDetailsData["dob"] = new Date(
        new Date().getFullYear() - Number(this.personDetailsData["age"]),
        monthDate,
        new Date().getDate()
      );
      this.personDOBField[0].value = this.personDetailsData
        ? this.personDetailsData?.dob
        : null;
    } else {
      this.personDOBField[0].value = null;
    }
  }

  onFormUpdate(formValues: FormValue): void {
    const values = formValues.getValues();
    Object.keys(values).forEach((key) => {
      this.personDetailsData[key] = values[key]?.value;
    });
    if (values["dob"]?.value) {
      const dob = moment(new Date(values["dob"]?.value));
      const today = moment(new Date());
      this.age = today.diff(dob, "years");
      this.month = Number(today.diff(dob, "months")) % 12;
      this.personDetailsData["age"] = this.age.toString();
      this.personAgeField = [
        {
          ...this.allRegistrationFields?.patientAgeFields?.age,
          value: this.personDetailsData ? this.personDetailsData?.age : null,
        },
      ];
    }

    this.personDetails.emit({
      ...this.personDetailsData,
      isNewPatient: this.personDetailsCategory === "new",
      patientUuid: this.patientUuid,
      pimaCOVIDLinkDetails: !this.selectedClientData?.hasResults
        ? this.selectedClientData
        : null,
    });
  }

  onUpdatePrimaryIdentifierForm(formValues: FormValue): void {
    const values = formValues.getValues();
    let identifier;
    Object.keys(values).forEach((key) => {
      this.personDetailsData[key] = values[key]?.value;
      identifier = values[key]?.value;
      this.lastIdentifier = key;
    });
    this.personDetails.emit({
      ...this.personDetailsData,
      isNewPatient: this.personDetailsCategory === "new",
      patientUuid: this.patientUuid,
      pimaCOVIDLinkDetails: !this.selectedClientData?.hasResults
        ? this.selectedClientData
        : null,
    });
    this.searchByIdentifier = true;
    this.showSearchedDetails = true;
    this.existingPersons$ = this.personService
      .getPatientsByIdentifier(identifier)
      .pipe(
        tap((response) => {
          this.searchByIdentifier = false;
          if (response.length > 0) {
            response.forEach((patient) => {
              let incomingIdentifier = patient?.identifiers?.filter((id) => {
                if (id.identifier === identifier) {
                  return id;
                }
              })[0]?.identifier;
              if (!incomingIdentifier) {
                this.patientUuid = undefined;
              }
            });
          }
        })
      );
  }

  onShowSearchedDetails(e: Event) {
    e.stopPropagation();
    this.showSearchedDetails = false;
  }

  onUpdateIdentifierForm(formValues: FormValue): void {
    const values = formValues.getValues();
    Object.keys(values).forEach((key) => {
      this.personDetailsData[key] = values[key]?.value;
    });
    this.personDetails.emit({
      ...this.personDetailsData,
      isNewPatient: this.personDetailsCategory === "new",
      patientUuid: this.patientUuid,
      pimaCOVIDLinkDetails: !this.selectedClientData?.hasResults
        ? this.selectedClientData
        : null,
    });
  }

  toggleIdentifiers(event: Event): void {
    event.stopPropagation();
    this.showOtherIdentifiers = !this.showOtherIdentifiers;
  }

  onSelectExisting(e: Event, person: any) {
    e.stopPropagation();
    this.patientService
      .getPatientsDetails(person?.uuid)
      .pipe(
        tap((personDetails) => {
          if (!personDetails?.error) {
            this.patientUuid = personDetails?.uuid;
            const phoneNumber = personDetails?.person?.attributes?.filter(
              (attribute) => {
                if (
                  attribute?.attributeType?.uuid ===
                  "aeb3a16c-f5b6-4848-aa51-d7e3146886d6"
                ) {
                  //TODO: Find a way to softcode this
                  return attribute;
                }
              }
            )[0]?.value;
            const person = {
              ...personDetails?.person,
              identifiers: personDetails?.identifiers,
              phoneNumber: phoneNumber,
            };
            this.setPersonDetails(person);
            this.showSearchedDetails = false;
          }
          if (personDetails?.error) {
            // console.log("==> Error when trying to get details: ");
          }
        })
      )
      .subscribe();
  }

  setPersonDetails(personDetails?: any): void {
    this.patientUuid = personDetails?.uuid;

    this.personFields = Object.keys(
      this.allRegistrationFields?.personFields
    ).map((key) => {
      if (personDetails) {
        personDetails = {
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
        };
      }
      return {
        ...this.allRegistrationFields?.personFields[key],
        value: personDetails ? personDetails[key] : null,
      };
    });
    this.personDOBField = [
      {
        ...this.allRegistrationFields?.patientAgeFields?.dob,
        value:
          personDetails && personDetails?.birthdate
            ? new Date(personDetails?.birthdate)
            : null,
      },
    ];
    this.personFieldsGroupThree = Object.keys(
      this.allRegistrationFields?.personFieldsGroupThree
    ).map((key) => {
      return {
        ...this.allRegistrationFields?.personFieldsGroupThree[key],
        value: personDetails ? personDetails[key] : null,
      };
    });
    if (personDetails) {
      this.setIdentifierFields(this.identifierTypes, personDetails);
      this.personDetails.emit({
        ...this.personDetailsData,
        isNewPatient: this.personDetailsCategory === "new",
        patientUuid: this.patientUuid,
        pimaCOVIDLinkDetails: !this.selectedClientData?.hasResults
          ? this.selectedClientData
          : null,
      });
    }
  }

  onGetPersonDetails(personDetails: any): void {
    this.setPersonDetails(personDetails);
  }

  getSelection(event: MatRadioChange): void {
    this.personDetailsCategory = event?.value;
    this.fromExternalSystem.emit(
      this.personDetailsCategory === "other" ? true : false
    );

    this.personDetails.emit({
      ...this.personDetailsData,
      isNewPatient: this.personDetailsCategory === "new",
      patientUuid: this.patientUuid,
      pimaCOVIDLinkDetails: !this.selectedClientData?.hasResults
        ? this.selectedClientData
        : null,
    });
    if (this.personDetailsCategory === "new") {
      this.setPersonDetails();
    }
  }

  onGetSelectedSystem(system: any): void {
    this.fromExternalSystem.emit(true);
    this.selectedSystem.emit(system);
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
            this.setIdentifierFields(this.identifierTypes, response[0]);
          } else {
            const personDetailsData = {
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

            this.setPersonDetails(personDetailsData);
            const today = moment(new Date());
            this.age = today.diff(clientRequest?.dob, "years");
            this.month = Number(today.diff(clientRequest?.dob, "months")) % 12;
            this.setIdentifierFields(
              this.identifierTypes,
              personDetailsData,
              clientRequest?.passportNumber
            );
          }
        }
      });
  }
}
