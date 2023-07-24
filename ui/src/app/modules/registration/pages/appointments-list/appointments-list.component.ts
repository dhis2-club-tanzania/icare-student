import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';import { Store } from '@ngrx/store';
import { go } from 'src/app/store/actions';
import { AppState } from 'src/app/store/reducers';

@Component({
  selector: 'app-appointments-list',
  templateUrl: './appointments-list.component.html',
  styleUrls: ['./appointments-list.component.scss']
})
export class AppointmentsListComponent implements OnInit {

  constructor(private store: Store<AppState>, private location: Location) { }

  ngOnInit(): void {
  }

  onBack(e: Event) {
    e.stopPropagation();
    this.location.back()
  }

  onSelectAppointment({ appointment }) {
    console.log(appointment.patient.uuid)
    this.store.dispatch(
      go({
        path: [`/clinic/patient-dashboard/${appointment.patient.uuid}`],
        query: { queryParams: { patient: appointment.patient.uuid } },
      })
    );
  }
}
