import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Patient } from 'src/app/shared/resources/patient/models/patient.model';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { getCurrentPatient } from 'src/app/store/selectors/current-patient.selectors';
import { take } from 'rxjs/operators';
import { go } from 'src/app/store/actions';

@Component({
  selector: 'app-dispensing-home',
  templateUrl: './dispensing-home.component.html',
  styleUrls: ['./dispensing-home.component.scss'],
})
export class DispensingHomeComponent implements OnInit {
  currentPatient$: Observable<Patient>;
  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.currentPatient$ = this.store.pipe(select(getCurrentPatient));

    this.currentPatient$.pipe(take(1)).subscribe((currentPatient) => {
      if (!currentPatient) {
        // this.store.dispatch(go({ path: ['/dispensing'] }));
      }
    });
  }
}
