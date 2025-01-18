import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TestService } from 'src/app/shared/services/test.service';
import { AppState } from 'src/app/store/reducers';
import { getLabDepartments } from 'src/app/store/selectors';

@Component({
  selector: 'app-test-settings',
  templateUrl: './test-settings.component.html',
  styleUrls: ['./test-settings.component.scss']
})
export class TestSettingsComponent implements OnInit {


  departments$: Observable<any>;
  testTimeConfigs$: Observable<any>;
  testRangeConfigs$: Observable<any>;

  test: any;
  

  constructor(private store: Store<AppState>, private testService: TestService) { }

  ngOnInit(): void {

    this.departments$ = this.store.select(getLabDepartments);
  }

  onSetLabTest(eventData){

    this.test = eventData;

    this.testTimeConfigs$ = this.testService.getTestTimeSettingByTestConcept(eventData?.uuid)

    this.testRangeConfigs$ = this.testService.getTestValueRangesByTestConcept(eventData?.uuid);

   

  }

  resetConfigsSide(){
    this.test = null;
  }

}
