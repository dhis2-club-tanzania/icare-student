import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/store/reducers';
import { getCurrentUserPrivileges } from 'src/app/store/selectors/current-user.selectors';
import { getDateDifferenceYearsMonthsDays } from '../../helpers/date.helpers';
import { Patient } from '../../resources/patient/models/patient.model';

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.scss'],
})
export class PatientProfileComponent implements OnInit {
  @Input() patient: Patient;
  privileges$: Observable<any>;
  constructor(private store: Store<AppState>) {}

  ageObject: any;

  ngOnInit() {
    this.privileges$ = this.store.select(getCurrentUserPrivileges);

    

  }

  getAge(){

    let ageObj = getDateDifferenceYearsMonthsDays(
      new Date(this.patient.dob),
      new Date()
    );

    return ageObj?.years > 0? ageObj?.years+' years': ageObj?.months > 0? ageObj?.months+' months': ageObj?.days?.toFixed(0)+' days'

  }

  
}
