import { Component, OnInit, Input } from '@angular/core';
import { DiagnosisObject } from 'src/app/shared/resources/diagnosis/models/diagnosis-object.model';
import { ICAREForm } from 'src/app/shared/modules/form/models/form.model';
import { formatDiagnosisFormObject } from 'src/app/shared/resources/diagnosis/helpers';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { map, filter } from 'lodash';
import { PatientdiagnosesCreate } from 'src/app/shared/resources/openmrs';
import { Patient } from 'src/app/shared/resources/patient/models/patient.model';
import { updateDiagnosis } from 'src/app/store/actions/diagnosis.actions';
import { FormValue } from 'src/app/shared/modules/form/models/form-value.model';
import { AddDiagnosisModalComponent } from '../add-diagnosis-modal/add-diagnosis-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDiagnosisModalComponent } from '../delete-diagnosis-modal/delete-diagnosis-modal.component';

@Component({
  selector: 'app-active-diagnoses',
  templateUrl: './active-diagnoses.component.html',
  styleUrls: ['./active-diagnoses.component.scss'],
})
export class ActiveDiagnosesComponent implements OnInit {
  @Input() diagnoses: DiagnosisObject[];
  @Input() diagnosisFormDetails: ICAREForm;
  @Input() patient: Patient;
  diagnosisForm: any;
  currentDiagnosis: PatientdiagnosesCreate = {};
  currentDiagnosisUuid: string;
  constructor(private store: Store<AppState>, private dialog: MatDialog) {}

  ngOnInit(): void {}

  onFormUpdate(formInfo) {
    // console.log('formData',formData.getValues())
    const formData = formInfo.getValues();
    map(Object.keys(formData), (key) => {
      if (formData[key] && formData[key]?.value) {
        if (key == 'diagnosis') {
          this.currentDiagnosisUuid = formData['diagnosis']?.id;
          this.currentDiagnosis[key] = {
            coded:
              formData[key].options && formData[key].options.length > 0
                ? (filter(formData[key].options, {
                    key: formData[key].value,
                  }) || [])[0].key
                : formData[key].value,
            nonCoded: null,
            specificName: null,
          };
        } else if (key == 'certainty') {
          this.currentDiagnosis[key] = (filter(formData[key].options, {
            key: formData[key].value,
          }) || [])[0].value.toUpperCase();
          // this.currentDiagnosis[key] = formData[key]?.value.toUpperCase();
        } else if (key == 'diagnosis-non-coded') {
          this.currentDiagnosis['diagnosis']['nonCoded'] = formData[key].value;
        } else if (key == 'rank') {
          this.currentDiagnosis[key] =
            formData[key].value === 'Secondary' ? 1 : 0;
        } else {
          this.currentDiagnosis[key] = formData[key]?.value;
        }
      }
    });
  }

  onEdit(e: Event, diagnosisData) {
    this.diagnosisForm = formatDiagnosisFormObject(
      this.diagnosisFormDetails,
      diagnosisData?.diagnosisDetails
        ? diagnosisData?.diagnosisDetails
        : diagnosisData
    );
    this.currentDiagnosisUuid = diagnosisData?.diagnosisDetails
      ? diagnosisData?.diagnosisDetails?.uuid
      : diagnosisData?.uuid;
    // e.stopPropagation();
    this.dialog.open(AddDiagnosisModalComponent, {
      width: '75%',
      data: {
        patient: this.patient,
        diagnosisForm: this.diagnosisForm,
        visit: null,
        edit: true,
        currentDiagnosisUuid: this.currentDiagnosisUuid,
      },
    });
  }

  onDelete(e: Event, diagnosisData) {
    // e.stopPropagation();
    this.dialog.open(DeleteDiagnosisModalComponent, {
      width: '25%',
      data: {
        patient: this.patient,
        diagnosis: diagnosisData?.diagnosisDetails
          ? diagnosisData?.diagnosisDetails
          : diagnosisData,
      },
    });
  }
}
