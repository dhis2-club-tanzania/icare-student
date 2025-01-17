import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { formatDateToYYMMDD } from 'src/app/modules/laboratory/services/visits.service';
import { getVisitsLoadedState, getVisitsParameters, getAllConsultationVisits, getSampleTypesLoadedState, getAllSampleTypes, getLabOrdersBillingInfo, getLabConfigurations, getLabOrdersLoadedState, getLabOrders, getCollectedLabOrders, getSampleIdentifierDetails, getAcceptedLabOrders, getRejectedLabOrders, getLabOrdersWithIntermediateResults, getLabOrdersWithFirstSignOff, getLabOrdersWithSecondSignOff, getPatientsVisitsReferences, getAllCollectedSamplesFromAPI, getLabTestsContainers, getLabSampleContainers, getCodedSampleRejectionReassons, getLabDepartments } from 'src/app/modules/laboratory/store/selectors';
import { AppState } from 'src/app/store/reducers';
import { getCurrentUserPrivileges } from 'src/app/store/selectors/current-user.selectors';


@Component({
  selector: 'app-sample-collection-dashboard',
  templateUrl: './sample-collection-dashboard.component.html',
  styleUrls: ['./sample-collection-dashboard.component.scss'],
})
export class SampleCollectionDashboardComponent implements OnInit {
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
  collectedSamplesFromAPI$: Observable<any>;
  sampleContainers$: Observable<any>;
  testsContainers$: Observable<any>;
  privileges$: Observable<any>;
  codedSampleRejectionReasons$: Observable<any>;
  labDepartments$: Observable<any[]>;
  selectedDay: Date = new Date();
  parameters: any = {};
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {

    let today = formatDateToYYMMDD(new Date());

    this.parameters['startDate'] = formatDateToYYMMDD(
      new Date(
        Number(today.split('-')[0]),
        Number(today.split('-')[1]) - 1,
        Number(today.split('-')[2])

      )
    );
    this.parameters['endDate'] = formatDateToYYMMDD(
      new Date(
        Number(today.split('-')[0]),
        Number(today.split('-')[1]) - 1,
        Number(today.split('-')[2]) + 1
      )
    );

    this.visitsLoadedState$ = this.store.select(getVisitsLoadedState);
    this.visitsParameters$ = this.store.select(getVisitsParameters);
    this.visits$ = this.store.select(getAllConsultationVisits);
    this.sampleTypesLoadedState$ = this.store.select(getSampleTypesLoadedState);

    this.sampleTypes$ = this.store.select(getAllSampleTypes);
    this.labOrdersBillingInfo$ = this.store.select(getLabOrdersBillingInfo);
    this.labConfigs$ = this.store.select(getLabConfigurations);

    this.labOrdersLoadedState$ = this.store.select(getLabOrdersLoadedState);
    this.labOrdersGroupedByPatients$ = this.store.select(getLabOrders);

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
    this.visitReferences$ = this.store.select(getPatientsVisitsReferences);

    this.collectedSamplesFromAPI$ = this.store.select(
      getAllCollectedSamplesFromAPI
    );

    this.testsContainers$ = this.store.select(getLabTestsContainers);

    this.sampleContainers$ = this.store.select(getLabSampleContainers);

    this.privileges$ = this.store.select(getCurrentUserPrivileges);

    this.codedSampleRejectionReasons$ = this.store.select(
      getCodedSampleRejectionReassons
    );
    this.labDepartments$ = this.store.select(getLabDepartments);
  }

  refreshPage() {
    window.location.reload();
  }
}
