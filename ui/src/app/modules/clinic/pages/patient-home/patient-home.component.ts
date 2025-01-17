import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';

@Component({
  selector: 'app-patient-home',
  templateUrl: './patient-home.component.html',
  styleUrls: ['./patient-home.component.scss'],
})
export class PatientHomeComponent implements OnInit {
  constructor(private store: Store<AppState>) {}

  ngOnInit() {}
}
