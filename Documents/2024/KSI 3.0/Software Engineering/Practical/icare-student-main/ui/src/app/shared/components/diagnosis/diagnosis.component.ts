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
import {
  getAllDiagnoses,
  getSavingDiagnosisState,
} from 'src/app/store/selectors';
import { FormValue } from 'src/app/shared/modules/form/models/form-value.model';
import { VisitObject } from 'src/app/shared/resources/visits/models/visit-object.model';
import { MatDialog } from '@angular/material/dialog';
import { AddDiagnosisModalComponent } from '../add-diagnosis-modal/add-diagnosis-modal.component';

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
  diagnoses$: Observable<DiagnosisObject[]>;

  constructor(private store: Store<AppState>, private dialog: MatDialog) {}
  ngOnInit(): void {
    this.diagnosisForm = formatDiagnosisFormObject(this.diagnosisFormDetails);
    this.diagnoses$ = this.store.select(getAllDiagnoses);
  }

  onOpenNewDiagnosisModal(event: Event, patient, diagnosisForm, visit): void {
    event.stopPropagation();
    this.dialog.open(AddDiagnosisModalComponent, {
      width: '75%',
      data: {
        patient,
        diagnosisForm,
        visit,
      },
    });
  }
}
