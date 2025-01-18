import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loadConfigsForLabOrdersManagement } from 'src/app/store/actions';
import { AppState } from 'src/app/store/reducers';
import { getAllSampleTypes, getSampleTypesLoadedState, getSetMembersGrouped } from 'src/app/store/selectors';
import { getCurrentUserPrivileges } from 'src/app/store/selectors/current-user.selectors';

@Component({
  selector: 'app-lab-orders-management-dashboard',
  templateUrl: './lab-orders-management-dashboard.component.html',
  styleUrls: ['./lab-orders-management-dashboard.component.scss'],
})
export class LabOrdersManagementDashboardComponent implements OnInit {
  @Input() sampleTypes: any[];
  @Input() labConfigs: any;

  test$: Observable<any>;
  sampleTypes$: Observable<any>;
  loadedSampleTypesState$: Observable<any>;
  privileges$: Observable<any>;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(
      loadConfigsForLabOrdersManagement({ setMembers: this.sampleTypes })
    );
    this.loadedSampleTypesState$ = this.store.select(getSampleTypesLoadedState);
    this.test$ = this.store.select(getSetMembersGrouped);
    this.sampleTypes$ = this.store.select(getAllSampleTypes);

    this.privileges$ = this.store.select(getCurrentUserPrivileges);
  }
}
