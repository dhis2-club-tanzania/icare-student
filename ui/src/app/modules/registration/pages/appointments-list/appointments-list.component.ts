// app/appointments-list/appointments-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'; // Import MatDialog

import { Schedules } from 'src/app/shared/dialogs/appointment-form/schedules.model';
import { SchedulesService } from 'src/app/shared/dialogs/appointment-form/schedules.service';
import { go } from 'src/app/store/actions';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AppState } from 'src/app/store/reducers';
import { EditFormComponent } from 'src/app/shared/dialogs/edit-form/edit-form.component';

@Component({
  selector: 'app-appointments-list',
  templateUrl: './appointments-list.component.html',
  styleUrls: ['./appointments-list.component.scss'],
})
export class AppointmentsListComponent implements OnInit {
  public dataSource: any = [];
  searchTerm: Date;
  public filtered: Array<Schedules | null> = [];

  displayedColumns = [
    'name',
    'date',
    'message',
    'phoneNumber',
    'status',
    'appointmentType',
    'actions', // Add a column for the edit button
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private store: Store<AppState>,
    private schedulesService: SchedulesService,
    private dialog: MatDialog // Inject MatDialog
  ) {}

  ngOnInit(): void {
    this.getSchedules();
  }

  applyFilter() {
    this.filtered = this.schedules.filter(
      (item: Schedules) =>
        new Date(item.scheduledSendTime.replace(/-/g, '/')).getTime() ===
        this.searchTerm?.getTime()
    );
    this.dataSource = new MatTableDataSource<Schedules>(this.filtered);
    this.dataSource.paginator = this.paginator;
  }

  onBack(e: Event) {
    e.stopPropagation();
    this.store.dispatch(go({ path: ['/registration/home'] }));
  }

  schedules: Schedules[];

  getSchedules() {
    this.schedulesService.getSchedules().subscribe(
      (data: Schedules[]) => {
        this.schedules = data;
        this.filtered = data;
        this.dataSource = new MatTableDataSource<Schedules>(this.filtered);
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.log('Error retrieving schedules: ', error);
      }
    );
  }

  openEditDialog(element: Schedules) {
    
  
      this.dialog.open(EditFormComponent, {
        width: "55%",
        data: {
          id:element.id,
          phoneNumber: element.phoneNumber,
          patient: element.mother,
          location: null,
          visit: null,
        }
       
      });
    }
   }


