import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loadCustomOpenMRSForm, transferPatient } from 'src/app/store/actions';
import { AppState } from 'src/app/store/reducers';
import { getLocationsByTagName } from 'src/app/store/selectors';
import {
  getTransferLoadingState,
  getTransferStatusOfCurrentPatient,
} from 'src/app/store/selectors/current-patient.selectors';
import { getProviderDetails } from 'src/app/store/selectors/current-user.selectors';
import {
  getCustomOpenMRSFormById,
  getFormsLoadingState,
} from 'src/app/store/selectors/form.selectors';
import { getActiveVisit } from 'src/app/store/selectors/visit.selectors';
import { OpenMRSForm } from '../../modules/form/models/custom-openmrs-form.model';
import { FormValue } from '../../modules/form/models/form-value.model';
import { Patient } from '../../resources/patient/models/patient.model';
import { Visit } from '../../resources/visits/models/visit.model';

@Component({
  selector: 'app-transfer-patient-outside',
  templateUrl: './transfer-patient-outside.component.html',
  styleUrls: ['./transfer-patient-outside.component.scss'],
})
export class TransferPatientOutsideComponent implements OnInit {
  patient: Patient;
  formLoadingState$: Observable<boolean>;
  form$: Observable<OpenMRSForm>;
  formUuid: string;
  locations$: Observable<any[]>;
  provider$: Observable<any>;
  transferTo: any;
  currentVisit$: Observable<Visit>;
  transferLoadingState$: Observable<boolean>;
  transferStatus$: Observable<boolean>;
  locationType: string;
  path: string;
  params: any;
  isFormValid: boolean = false;
  obs: any[] = [];

  constructor(
    private store: Store<AppState>,
    private dialogRef: MatDialogRef<TransferPatientOutsideComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.patient = data?.patient?.patient;
    this.locationType = data?.form?.locationType;
    this.path = data?.path;
    this.params = data?.params;

    this.formUuid = data?.form?.formUuid;
    if (this.formUuid) {
      this.store.dispatch(
        loadCustomOpenMRSForm({ formUuid: data?.form?.formUuid })
      );
    }
  }

  ngOnInit(): void {
    this.formLoadingState$ = this.store.select(getFormsLoadingState);
    this.form$ = this.store.select(getCustomOpenMRSFormById, {
      id: this.formUuid,
    });
    this.transferStatus$ = this.store.select(getTransferStatusOfCurrentPatient);
    this.provider$ = this.store.select(getProviderDetails);
    this.locations$ = this.store.select(getLocationsByTagName, {
      tagName: this.locationType,
    });
    this.currentVisit$ = this.store.select(getActiveVisit);
    this.transferLoadingState$ = this.store.select(getTransferLoadingState);
  }

  onSaveForm(e, provider, visit, obs, encounterType) {
    e.stopPropagation();
    const data = {
      patient: this.patient['uuid'],
      location: this.transferTo?.uuid,
      encounterType: encounterType?.uuid,
      form: this.formUuid,
      obs: obs,
      visit: visit?.uuid,
      provider: provider?.uuid,
    };
    this.store.dispatch(
      transferPatient({
        transferDetails: data,
        path: this.path,
        params: this.params,
        currentVisitLocation: visit?.location?.uuid,
      })
    );
  }

  onClose(e) {
    e.stopPropagation();
    this.dialogRef.close();
  }

  onFormUpdate(formValues: FormValue): void {
    this.isFormValid = formValues?.isValid;
    const values = formValues.getValues();
    this.obs = Object.keys(values).map((key) => {
      return {
        concept: key,
        value: values[key]?.value,
      };
    });
  }
}
