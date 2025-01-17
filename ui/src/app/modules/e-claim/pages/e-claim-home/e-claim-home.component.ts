import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TableConfig } from 'src/app/shared/models/table-config.model';
import { Visit } from 'src/app/shared/resources/visits/models/visit.model';
import { VisitsService } from 'src/app/shared/resources/visits/services';
import {
  clearCurrentPatient,
  go,
  loadCurrentPatient,
  updateCurrentPatient,
} from 'src/app/store/actions';
import { loadActiveVisit } from 'src/app/store/actions/visit.actions';
import { AppState } from 'src/app/store/reducers';

@Component({
  selector: 'app-e-claim-home',
  templateUrl: './e-claim-home.component.html',
  styleUrls: ['./e-claim-home.component.scss'],
})
export class EClaimHomeComponent implements OnInit {
  visits$: Observable<Visit[]>;
  visitColumns: any[];
  dataSource: any;
  loadingData: boolean;
  loadedData: boolean = false;
  loadingDataError: string;
  registrationTableConfig: TableConfig;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private store: Store<AppState>,
    private visitService: VisitsService,
    private dialog: MatDialog
  ) {}

  get displayedColumns(): string[] {
    return this.visitColumns.map((visitColumn) => visitColumn.id);
  }

  ngOnInit() {
    this.loadingData = true;
    this.visitColumns = [
      { id: 'index', label: '#' },
      { id: 'patientName', label: 'Name' },
      { id: 'patientGender', label: 'Gender' },
      { id: 'patientAge', label: 'Age' },
      { id: 'locationName', label: 'Location' },
      { id: 'visitTypeName', label: 'Visit type' },
      { id: 'visitStartTime', label: 'Visit date' },
      { id: 'paymentType', label: 'Payment Type' },
    ];

    this.registrationTableConfig = new TableConfig({
      noDataLabel: 'No Registered patients',
    });
  }

  ngAfterViewInit() {
    this.getAllActiveVisits();
  }

  getAllActiveVisits() {
    this.loadedData = false;
    this.visitService.getAllVisits(null, null, true).subscribe(
      (visits) => {
        this.dataSource = new MatTableDataSource(visits);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loadingData = false;
        this.loadedData = true;
      },
      (error) => {
        this.loadingData = false;
        this.loadedData = true;
        this.loadingDataError = error;
      }
    );
  }

  onSelectPatient(patient) {
    event.stopPropagation();
    this.store.dispatch(updateCurrentPatient({ patient }));
    this.store.dispatch(
      go({
        path: [`/e-claim/${patient?.patient?.uuid}/submit`],
      })
    );
  }

  onBack(e: Event) {
    e.stopPropagation();
    this.store.dispatch(go({ path: ['/'] }));
  }
}
