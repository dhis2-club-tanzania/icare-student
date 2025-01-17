import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormValue } from '../../modules/form/models/form-value.model';
import { PatientdiagnosesCreate } from '../../resources/openmrs';

import { map, filter, keyBy } from 'lodash';
import { Patient } from '../../resources/patient/models/patient.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import {
  getAllDiagnoses,
  getSavingDiagnosisState,
} from 'src/app/store/selectors';
import { saveDiagnosis } from 'src/app/store/actions/diagnosis.actions';
import { VisitObject } from '../../resources/visits/models/visit-object.model';

@Component({
  selector: 'app-add-diagnosis-modal',
  templateUrl: './add-diagnosis-modal.component.html',
  styleUrls: ['./add-diagnosis-modal.component.scss'],
})
export class AddDiagnosisModalComponent implements OnInit {
  diagnosesData: PatientdiagnosesCreate = {};
  savingDiagnosisState$: Observable<boolean>;
  isFormValid: boolean = false;
  patient: Patient;
  currentFormState: FormValue;
  diagnosisForm: any;
  diagnoses$: Observable<any[]>;
  visit: VisitObject;
  edit: boolean;
  currentDiagnosisUuid: string;
  constructor(
    private dialogRef: MatDialogRef<AddDiagnosisModalComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private store: Store<AppState>
  ) {
    this.patient = data?.patient;
    this.diagnosisForm = data?.diagnosisForm;
    this.visit = data?.visit;
    this.edit = data?.edit;
    this.currentDiagnosisUuid = data?.currentDiagnosisUuid;
  }

  ngOnInit(): void {}

  onFormUpdate(formValueObject: FormValue): void {
    this.currentFormState = formValueObject;
    this.isFormValid = formValueObject.isValid;
    const formValue = formValueObject.getValues();
    map(Object.keys(formValue), (key) => {
      if (formValue[key] && formValue[key].value) {
        if (key === 'diagnosis') {
          this.diagnosesData[key] = {
            coded: formValue[key].value,
            nonCoded: null,
            specificName: null,
          };
        } else if (key === 'certainty') {
          this.diagnosesData[key] = (filter(formValue[key].options, {
            key: formValue[key].value,
          }) || [])[0].value
            .toUpperCase()
            .split(' ')[0];
        } else if (key === 'rank') {
          const options = formValue[key]?.options || [];
          const keyedOptions = keyBy(options, 'key');
          this.diagnosesData[key] =
            keyedOptions[formValue[key].value]?.value === 'Secondary' ? 1 : 0;
        } else if (key == 'diagnosis-non-coded') {
          this.diagnosesData['diagnosis']['nonCoded'] = formValue[key].value;
        } else {
          this.diagnosesData[key] = formValue[key].value;
        }
      }
    });
    this.diagnosesData = {
      ...this.diagnosesData,
      condition: this.diagnosesData?.condition
        ? this.diagnosesData?.condition
        : null,
      patient: this.patient.id,
    };

    this.diagnosesData = {
      ...this.diagnosesData,
      encounter: JSON.parse(localStorage.getItem('patientConsultation'))[
        'encounterUuid'
      ],
    };
  }

  addDiagnis(e: Event, currentDiagnosisUuid: string, diagnosesData: any): void {
    e.stopPropagation();
    this.savingDiagnosisState$ = this.store.select(getSavingDiagnosisState);
    this.store.dispatch(
      saveDiagnosis({ diagnosis: diagnosesData, currentDiagnosisUuid })
    );
    this.diagnoses$ = this.store.select(getAllDiagnoses);
    this.currentFormState.clear();
  }
}
