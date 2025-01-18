import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TableColumn } from '../../models/table-column.model';
import { TableConfig } from '../../models/table-config.model';
import { Patient } from '../../resources/patient/models/patient.model';
import { PatientService } from '../../resources/patient/services/patients.service';

@Component({
  selector: 'app-patient-list-dialog',
  templateUrl: './patient-list-dialog.component.html',
  styleUrls: ['./patient-list-dialog.component.scss'],
})
export class PatientListDialogComponent implements OnInit, OnDestroy {
  private _patients$: Subject<any> = new Subject<any>();
  patients$: Observable<any>;
  searching: boolean;
  searchingError: string;
  patientListColumns: TableColumn[];
  tableConfig: TableConfig;
  patientSearchSubscription: Subscription;

  constructor(
    private patientService: PatientService,
    private dialogRef: MatDialogRef<PatientListDialogComponent>
  ) {
    this.patients$ = this._patients$.asObservable();
  }

  ngOnInit() {
    this.patientListColumns = [
      { id: 'identifier', label: 'ID' },
      { id: 'name', label: 'Name' },
      { id: 'gender', label: 'Gender' },
      { id: 'age', label: 'Age' },
    ];

    this.tableConfig = new TableConfig({ noDataLabel: 'Search Patients' });
  }

  ngOnDestroy() {
    this.patientSearchSubscription.unsubscribe();
  }

  onSearchPatients(e): void {
    e.stopPropagation();
    this.searching = true;
    const searchTerm = e.target.value;
    this.patientSearchSubscription = this.patientService
      .getPatients(e?.target?.value)

      .subscribe(
        (patients: any[]) => {
          this.searching = false;
          this._patients$.next(new MatTableDataSource(patients));
          if (patients.length === 0 && searchTerm?.length === 0) {
            this.tableConfig = new TableConfig({
              noDataLabel: `No patient found for the keyword ${searchTerm}`,
            });
          } else {
            this.tableConfig = new TableConfig({
              noDataLabel: 'Search Patient',
            });
          }
        },
        (error) => {
          this.searching = false;
          this.searchingError = error.message;
        }
      );
  }

  onSelectPatient(patient: Patient) {
    this.dialogRef.close({ action: 'PATIENT_SELECT', patient });
  }
}
