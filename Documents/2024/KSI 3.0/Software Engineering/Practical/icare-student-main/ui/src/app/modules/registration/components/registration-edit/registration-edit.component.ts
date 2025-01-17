import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, zip } from 'rxjs';
import { LocationService } from 'src/app/core/services';
import { getDateDifferenceYearsMonthsDays } from 'src/app/shared/helpers/date.helpers';
import { PatientGetFull } from 'src/app/shared/resources/openmrs';
import { Patient } from 'src/app/shared/resources/patient/models/patient.model';
import { VisitsService } from 'src/app/shared/resources/visits/services';
import {
  addCurrentPatient,
  go,
  loadCurrentPatient,
  updateCurrentPatient,
} from 'src/app/store/actions';
import { RegistrationService } from '../../services/registration.services';
import { tail, filter } from 'lodash';
import {
  Notification,
  NotificationService,
} from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-registration-edit',
  templateUrl: './registration-edit.component.html',
  styleUrls: ['./registration-edit.component.scss'],
})
export class RegistrationEditComponent implements OnInit {
  @Input() patientDetails: Patient;

  showOtherIdentifcation: boolean;
  showOtherBirthDetails: boolean;
  showMoreContactDetails: boolean;

  educationDetails: string[] = [
    'none',
    'Primary Level',
    'Secondary Level',
    'Primary Level',
    'College Level',
    'University Level',
    'Graduate and above',
  ];
  maritalStatusDetails: string[] = [
    'Single',
    'Married',
    'Cohabiting',
    'Separated/ Divorced',
    'Widow/ Widowed',
  ];
  Occupations: string[] = [
    'Unemployed',
    'Student',
    'Government',
    'Business',
    'Housewife',
    'Labour',
  ];

  newPatientOptions: string[] = ['Yes', 'No'];

  relationshipTypeOptions: string[] = ['Sibling', 'Parent', 'Supervisor'];

  constructor(
    private _snackBar: MatSnackBar,
    private router: Router,
    private registrationService: RegistrationService,
    private store: Store,
    private visitService: VisitsService,
    private locationService: LocationService,
    private notificationService: NotificationService
  ) {}

  get mandatoryFieldsMissing(): boolean {
    return this.patient.fname &&
      this.patient.lname &&
      this.patient.dob &&
      this.patient.gender
      ? false
      : true;
  }

  addingPatient: boolean = false;
  patientAdded: boolean = false;
  errorAddingPatient: boolean = false;
  shouldShowMoreInfoForm: boolean = true;
  emergencyRegistration: boolean = false;
  ShowFieldsError = false;
  selectedIdentifierType: any;

  currentLocation: any = null;
  currentLocation$: Observable<any>;
  patientIdentifierTypes: any;
  otherPatientIdentifierTypes: any;
  personAttributeTypes: any;
  patient: any;

  dateSet() {
    let ageObject = getDateDifferenceYearsMonthsDays(
      this.patient.dob,
      new Date()
    );

    this.patient.age = {
      ...this.patient.age,
      years: ageObject.years,
      months: ageObject.months,
      days: ageObject.days.toFixed(0),
    };
  }

  ngOnInit(): void {
    zip(
      this.registrationService.getPatientIdentifierTypes(),
      this.locationService.getFacilityCode(),
      this.registrationService.getAutoFilledPatientIdentifierType()
    ).subscribe((results) => {
      const patientIdentifierTypes = results[0];
      const facilityCode = results[1];
      const autoFilledIdentifier = results[2];
      this.patientIdentifierTypes = filter(
        patientIdentifierTypes.map((identifierType) => {
          // TODO: Need to find best way to autofill identifier through regex
          const isAutoFilled = identifierType.id === autoFilledIdentifier;
          if (isAutoFilled) {
            this.patient[identifierType.id] = this.patientDetails?.MRN;
          } else {
            this.patient[identifierType.id] = null;
          }

          return { ...identifierType, disabled: isAutoFilled };
        }),
        (idType) => {
          ///// console.log("idtype :: ",idType)
          return (
            idType?.id != '8d79403a-c2cc-11de-8d13-0010c6dffd0f' &&
            idType?.id != 'a5d38e09-efcb-4d91-a526-50ce1ba5011a' &&
            idType?.id != '05a29f94-c0ed-11e2-94be-8c13b969e334' &&
            idType?.id != '8d793bee-c2cc-11de-8d13-0010c6dffd0f'
          );
        }
      );

      this.otherPatientIdentifierTypes = tail(this.patientIdentifierTypes);
    });

    this.registrationService
      .getPersonAttributeTypes()
      .subscribe((personAttributeTypes) => {
        this.personAttributeTypes = personAttributeTypes;
      });

    this.patient = {
      fname: this.patientDetails?.fname ? this.patientDetails?.fname : '',
      mname: this.patientDetails?.mname,
      lname: this.patientDetails?.lname ? this.patientDetails?.lname : '',
      age: {
        years: this.patientDetails?.patientFull?.person?.age,
        months: null,
        days: null,
      },
      dob: this.patientDetails?.patientFull?.person?.birthdate?.split('T')[0],
      birthplace: this.patientDetails?.birthplace,
      gender: this.patientDetails?.patientFull?.person?.gender,
      phone: this.patientDetails?.phone,
      cityVillage: this.patientDetails?.cityVillage,
      village: this.patientDetails?.street,
      district: this.patientDetails?.district,
      region: this.patientDetails?.region,
      council: this.patientDetails?.council,
      referredFrom: null,
      tribe: this.patientDetails?.tribe,
      maritalStatus: this.patientDetails?.maritalStatus,
      occupation: this.patientDetails?.occupation,
      education: this.patientDetails?.education,
      nationalId: null,
      nationalIdType: null,
      kinFname: this.patientDetails?.kinFname,
      kinLName: this.patientDetails?.kinLName,
      kinRelationship: this.patientDetails?.kinRelationship,
      kinPhone: this.patientDetails?.kinPhone,
      areaLeader: this.patientDetails?.areaLeader,
      areaLeaderNumber: this.patientDetails?.areaLeaderNumber,
      religion: this?.patientDetails?.religion,
      newPatient: this.patientDetails?.isNew,
      RelationshipType: this.patientDetails?.relationshipType,
      Id: this.patientDetails?.relatedPersonId,
    };
  }

  setRelationshipType(relationshipType) {
    this.patient.RelationshipType = relationshipType;
  }

  setNewPatient(option) {
    this.patient.newPatient = option;
  }

  setOccupation(occupation) {
    this.patient.occupation = occupation;
  }

  setMaritalStatus(status) {
    this.patient.maritalStatus = status;
  }

  setEducationDetails(education) {
    this.patient.education = education;
  }

  calculateDateOfBirth() {
    let currentDate = new Date();

    this.patient.dob = new Date(
      currentDate.getFullYear() - this.patient?.age?.years,
      6,
      1
    );

    //console.log(this.patient?.dob)
  }

  savePatient(e: Event) {
    e.stopPropagation();
    const { currentLocation } = {
      currentLocation: {
        uuid: '',
      },
    };
    //TODO: validate inputs
    this.ShowFieldsError = false;

    if (this.mandatoryFieldsMissing) {
      this.openSnackBar('Warning: Some mandatory fields are missing', null);
      this.ShowFieldsError = true;
    } else {
      if (currentLocation) {
        //current location exists
        this.addingPatient = true;
        this.patientAdded = false;

        let patientPayload = {
          // person: personResponse['uuid'],
          uuid: this.patientDetails?.id,
          person: {
            uuid: this.patientDetails?.patientFull?.person?.uuid,
            names: [
              {
                givenName: this.patient.fname,
                familyName2: this.patient.mname,
                familyName: this.patient.lname,
              },
            ],
            gender: this.patient.gender,
            birthdate: this.patient.dob,
            //TODO: fix address
            addresses: [
              {
                address1: this.patient['council'],
                cityVillage: this.patient['cityVillage'],
                address2: this.patient['district'],
                address3: this.patient['region'],
                postalCode: '',
              },
            ],
            attributes: this.personAttributeTypes
              .map((personAttributeType) => {
                return {
                  attributeType: personAttributeType.id,
                  value: this.patient[personAttributeType.name],
                };
              })
              .filter((attribute) => attribute.value),
          },
          identifiers: this.patientDetails?.patientFull?.identifiers,
        };

        this.registrationService
          .updatePatient(patientPayload, this.patientDetails?.id)
          .subscribe(
            (patientResponse) => {
              patientResponse = {
                ...patientResponse,
                person: {
                  ...patientResponse['person'],
                  preferredName: {
                    ...patientResponse['person']['preferredName'],
                    givenName: this.patient?.fname,
                    familyName: this.patient?.lname,
                  },
                },
              };

              let patient = new Patient(patientResponse);
              //console.log('patient created ::', {patient: {...patientResponse} as any}patientResponse);

              //patient added succesfully

              this.notificationService.show(
                new Notification({
                  message: 'Patient details updated succesfully',
                  type: 'SUCCESS',
                })
              );

              this.patientAdded = true;
              this.addingPatient = false;

              this.store.dispatch(
                loadCurrentPatient({
                  uuid: patient.patientFull?.uuid,
                  isRegistrationPage: true,
                })
              );

              this.store.dispatch(go({ path: ['/registration/home'] }));
            },
            (patientError) => {
              this.errorAddingPatient = true;
              this.patientAdded = false;
              this.addingPatient = false;

              this.openSnackBar('Error creating patient', null);
            }
          );
      } else {
        //current location not set

        this.openSnackBar('Error: location is not set', null);
      }
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  onToggleOtherIdentifiers(e) {
    e.stopPropagation();
    this.showOtherIdentifcation = !this.showOtherIdentifcation;
  }

  onToggleOtherBirthDetails(e) {
    e.stopPropagation();
    this.showOtherBirthDetails = !this.showOtherBirthDetails;
  }

  onToggleOtherContactDetails(e) {
    e.stopPropagation();
    this.showMoreContactDetails = !this.showMoreContactDetails;
  }

  showMoreInformation() {
    this.shouldShowMoreInfoForm = !this.shouldShowMoreInfoForm;
  }

  mandatoryFieldIsMissing(id) {
    return !this.patient[id] && this.ShowFieldsError ? true : false;
  }

  setRegistrationMode(emergency: boolean) {
    this.emergencyRegistration =
      this.emergencyRegistration != emergency
        ? emergency
        : this.emergencyRegistration;

    if (this.emergencyRegistration) {
      this.patient = {
        ...this.patient,
        birthPlace: null,
        gender: null,
        phone: null,
        village: null,
        council: null,
        referredFrom: null,
        tribe: null,
        maritalStatus: null,
        occupation: null,
        fileNo: null,
        education: null,
        nationalId: null,
        nationalIdType: null,
        kinFname: null,
        kinLName: null,
        kinRelationship: null,
        kinPhone: null,
      };
    }
  }

  onSelectOtherIdentifier(e: Event, identifier: any): void {
    e.stopPropagation();
    this.selectedIdentifierType = identifier;
    this.patient[identifier.id] = null;
  }
}
