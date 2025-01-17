import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { getCurrentUserPrivileges } from 'src/app/store/selectors/current-user.selectors';
import { getSampleTypesLoadedState, getVisitsLoadedState, getAllSampleTypes, getAllVisits, getLabConfigurations, getLabTestsContainers, getLabSampleContainers, getCodedSampleRejectionReassons, getLabDepartments, getLabOrdersWithFirstSignOff, getLabOrdersWithSecondSignOff, getAcceptedLabOrders, getLabOrdersWithIntermediateResults, getRejectedLabOrders, getSampleIdentifierDetails, getAllLabOrders, getCollectedLabOrders, getLabOrdersLoadedState } from 'src/app/store/selectors';


@Component({
  selector: 'app-sample-tracking-dashboard',
  templateUrl: './sample-tracking-dashboard.component.html',
  styleUrls: ['./sample-tracking-dashboard.component.scss'],
})
export class SampleTrackingDashboardComponent implements OnInit {
  visitsParameters$: Observable<any>;
  visits$: Observable<any>;
  sampleTypes$: Observable<any[]>;
  labOrdersBillingInfo$: Observable<any>;
  labConfigs$: Observable<any>;
  visitsLoadedState$: Observable<boolean>;
  sampleTypesLoadedState$: Observable<boolean>;
  labOrdersLoadedState$: Observable<boolean>;
  labOrdersGroupedByPatients$: Observable<any>;
  collectedLabOrders$: Observable<any>;
  sampleIdentifierDetails$: Observable<any>;
  acceptedLabOrders$: Observable<any>;
  rejectedLabOrders$: Observable<any>;
  labOrdersWithIntermediateResults$: Observable<any>;

  labOrdersWithFirstSignOff$: Observable<any>;
  labOrdersWithSecondSignOff$: Observable<any>;
  visitReferences$: Observable<any>;

  sampleContainers$: Observable<any>;
  testsContainers$: Observable<any>;
  privileges$: Observable<any>;
  codedSampleRejectionReasons$: Observable<any>;
  labDepartments$: Observable<any>;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    // this.visitsParameters$ = this.store.select(getVisitsParameters);
    this.sampleTypesLoadedState$ = this.store.select(getSampleTypesLoadedState);
    this.visitsLoadedState$ = this.store.select(getVisitsLoadedState);
    this.sampleTypes$ = this.store.select(getAllSampleTypes);
    this.visits$ = this.store.select(getAllVisits);
    this.labConfigs$ = this.store.select(getLabConfigurations);

    this.labOrdersLoadedState$ = this.store.select(getLabOrdersLoadedState);
    this.labOrdersGroupedByPatients$ = this.store.select(getAllLabOrders);

    this.collectedLabOrders$ = this.store.select(getCollectedLabOrders);
    this.sampleIdentifierDetails$ = this.store.select(
      getSampleIdentifierDetails
    );
    this.acceptedLabOrders$ = this.store.select(getAcceptedLabOrders);
    this.rejectedLabOrders$ = this.store.select(getRejectedLabOrders);
    this.labOrdersWithIntermediateResults$ = this.store.select(
      getLabOrdersWithIntermediateResults
    );
    this.labOrdersWithFirstSignOff$ = this.store.select(
      getLabOrdersWithFirstSignOff
    );
    this.labOrdersWithSecondSignOff$ = this.store.select(
      getLabOrdersWithSecondSignOff
    );

    this.testsContainers$ = this.store.select(getLabTestsContainers);

    this.sampleContainers$ = this.store.select(getLabSampleContainers);

    this.privileges$ = this.store.select(getCurrentUserPrivileges);

    this.codedSampleRejectionReasons$ = this.store.select(
      getCodedSampleRejectionReassons
    );
    this.labDepartments$ = this.store.select(getLabDepartments);
  }
}
