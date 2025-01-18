import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getAllSampleTypes, getLabConfigurations, getSampleTypesLoadedState, getSetMembersGrouped } from 'src/app/store/selectors';

@Component({
  selector: 'app-lab-orders-management',
  templateUrl: './lab-orders-management.component.html',
  styleUrls: ['./lab-orders-management.component.scss'],
})
export class LabOrdersManagementComponent implements OnInit {
  SampleTypes$: Observable<any>;
  test$: Observable<any>;
  labConfigs$: Observable<any>;
  sampleTypesLoadedState$: Observable<boolean>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.SampleTypes$ = this.store.select(getAllSampleTypes);
    this.sampleTypesLoadedState$ = this.store.select(getSampleTypesLoadedState);
    this.test$ = this.store.select(getSetMembersGrouped);
    this.labConfigs$ = this.store.select(getLabConfigurations);
  }
}
