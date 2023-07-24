import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { go } from 'src/app/store/actions';
import { AppState } from 'src/app/store/reducers';

@Component({
  selector: 'app-appointments-list',
  templateUrl: './appointments-list.component.html',
  styleUrls: ['./appointments-list.component.scss']
})
export class AppointmentsListComponent implements OnInit {

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
  }

  onBack(e: Event) {
    e.stopPropagation();
    this.store.dispatch(go({ path: ["/registration/home"] }));
  }

  onSelectPatient(patientData) {
     console.log(patientData)
    this.store.dispatch(
      go({
        path: [`/clinic/patient-dashboard/${patientData?.visit.appointment.patient?.uuid}`],
        query: { queryParams: { patient: patientData?.visit.appointment.patient?.uuid } },
      })
    );
  }
}
