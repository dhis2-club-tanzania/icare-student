import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { addCurrentPatient } from 'src/app/store/actions';

export interface Patient {
  name: string;
  dob: string;
  age: string;
  gender: string;
  number: string;
}

@Component({
  selector: 'app-registration-search',
  templateUrl: './registration-search.component.html',
  styleUrls: ['./registration-search.component.scss'],
})
export class RegistrationSearchComponent implements OnInit {
  constructor(private router: Router, private store: Store) {}

  ngOnInit(): void {}

  viewPatient(patient) {
    this.store.dispatch(
      addCurrentPatient({
        patient: patient['patient'],
        isRegistrationPage: true,
      })
    );

    this.router.navigate(['registration', 'patient']);
  }
}
