import { getDateDifferenceYearsMonthsDays } from '../helpers/date.helpers';
import { PatientGetFull } from '../resources/openmrs';
import * as _ from 'lodash';

export class patientObj {
  private patient: PatientGetFull;

  constructor(patient: PatientGetFull) {
    this.patient = patient;
  }

  get name() {
    return this.patient.person?.display;
  }

  get MRN() {
    return _.filter(this.patient.identifiers, (identifier) => {
      return identifier && identifier.display.includes('MRN') ? true : false;
    })[0]?.display.split('=')[1];
  }

  get age() {
    return getDateDifferenceYearsMonthsDays(
      new Date(this.patient.person?.birthdate),
      new Date()
    );
  }

  get gender() {
    return this.patient.person?.gender == 'M'
      ? 'Male'
      : this.patient.person?.gender == 'F'
      ? 'Female'
      : '';
  }

  get uuid() {
    return this.patient.uuid;
  }
}
