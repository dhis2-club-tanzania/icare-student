import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ICAREForm } from 'src/app/shared/modules/form/models/form.model';
import { FormService } from 'src/app/shared/modules/form/services';
import { formatDiagnosisFormObject } from 'src/app/shared/resources/diagnosis/helpers';

import { map, filter } from 'lodash';
import { Patient } from 'src/app/shared/resources/patient/models/patient.model';
import { FormComponent } from 'src/app/shared/modules/form/components/form/form.component';
import { PatientdiagnosesCreate } from 'src/app/shared/resources/openmrs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { saveDiagnosis } from 'src/app/store/actions/diagnosis.actions';
import { Observable } from 'rxjs';
import { DiagnosisObject } from 'src/app/shared/resources/diagnosis/models/diagnosis-object.model';
import { getAllDiagnoses, getSavingDiagnosisState } from 'src/app/store/selectors';
import { FormValue } from 'src/app/shared/modules/form/models/form-value.model';
import { VisitObject } from 'src/app/shared/resources/visits/models/visit-object.model';

@Component({
  selector: 'app-diagnosis',
  templateUrl: './diagnosis.component.html',
  styleUrls: ['./diagnosis.component.scss'],
})
export class DiagnosisComponent implements OnInit {
  @ViewChild(FormComponent) formComponent: FormComponent;
  @Input() patient: Patient;
  diagnosisForm: ICAREForm;
  @Input() diagnosisFormDetails: ICAREForm;
  @Input() visit: VisitObject;
  diagnosesData: PatientdiagnosesCreate = {};
  diagnoses$: Observable<DiagnosisObject[]>;
  savingDiagnosisState$: Observable<boolean>;
  isFormValid: boolean = false;
  currentFormState: FormValue
  constructor(private store: Store<AppState>) {
    this.diagnoses$ = this.store.select(getAllDiagnoses);
  }
  ngOnInit(): void {
    this.diagnosisForm = formatDiagnosisFormObject(this.diagnosisFormDetails);
  }

  onFormUpdate(formValueObject: FormValue): void {
    this.currentFormState = formValueObject
    this.isFormValid = formValueObject.isValid
    const formValue = formValueObject.getValues();
    map(Object.keys(formValue), (key) => {
      if (formValue[key] && formValue[key].value) {
        if (key === 'diagnosis') {
          this.diagnosesData[key] = {
            coded:
              formValue[key].options && formValue[key].options.length > 0
                ? (filter(formValue[key].options, {
                    value: formValue[key].value,
                  }) || [])[0].key
                : formValue[key].value,
            nonCoded: null,
            specificName: null,
          };
        } else if (key === 'certainty') {
          this.diagnosesData[key] = formValue[key].value.toUpperCase();
        } else if (key === 'rank') {
          this.diagnosesData[key] =
            formValue[key].value === 'Secondary' ? 1 : 0;
        } else {
          this.diagnosesData[key] = formValue[key].value;
        }
      }
    });
    this.diagnosesData = {
      ...this.diagnosesData,
      patient: this.patient.id,
    };

    this.diagnosesData = {
      ...this.diagnosesData,
      encounter: this.visit?.encounterUuid
    };
  }

  addDiagnis(e) {
    e.stopPropagation()
    this.savingDiagnosisState$ = this.store.select(getSavingDiagnosisState)
    // this.diagonsisService.addDiagnosis(this.diagnosesData);
    this.store.dispatch(saveDiagnosis({ diagnosis: this.diagnosesData }));
    this.diagnoses$ = this.store.select(getAllDiagnoses);
    this.currentFormState.clear()
  }
}
