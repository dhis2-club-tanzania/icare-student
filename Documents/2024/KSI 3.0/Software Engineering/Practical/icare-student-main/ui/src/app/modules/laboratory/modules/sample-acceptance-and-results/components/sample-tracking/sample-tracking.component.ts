import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { SampleTrackingModalComponent } from '../sample-tracking-modal/sample-tracking-modal.component';
import { AppState } from 'src/app/store/reducers';
import { groupLabOrdersBySpecimenSources } from 'src/app/shared/helpers/sample-types.helper';
import { loadActiveVisitsForSampleManagement, setLoadedSamples, setSampleStatus } from 'src/app/store/actions';
import { getAllRejectedLabSamples, getAllRejectedLabSamplesAndMarkedForReCollection, getLabSamplesForShowingTrackingDetails, getMarkingForReCollectionState, getSamplesLoadedState } from 'src/app/store/selectors';

@Component({
  selector: 'app-sample-tracking',
  templateUrl: './sample-tracking.component.html',
  styleUrls: ['./sample-tracking.component.scss'],
})
export class SampleTrackingComponent implements OnInit {
  @Input() visits: any;
  @Input() sampleTypes: any;
  @Input() labOrdersBillingInfo: any;
  @Input() labConfigs: any;

  @Input() labOrdersGroupedByPatients: any;
  @Input() collectedLabOrders: any;
  @Input() sampleIdentifierDetails: any;
  @Input() acceptedLabOrders: any;
  @Input() rejectedLabOrders: any;
  @Input() labOrdersWithIntermediateResults: any;
  @Input() labOrdersWithFirstSignOff: any;
  @Input() labOrdersWithSecondSignOff: any;
  @Input() visitReferences: any;

  @Input() testsContainers: any;
  @Input() sampleContainers: any;

  @Input() privileges: any;

  @Input() codedSampleRejectionReasons: any;
  @Input() labDepartments: any[];

  samplesLoadedState$: Observable<boolean>;
  samples: any[];
  samplesRejected: any[];
  samplesToFeedResults: any[];
  itemsToFeedResults: any = {};
  samplesReadyForAction: any = {};
  currentSample: any;
  values: any = {};
  savedData: any = {};
  searchingText: string = '';

  selected = new FormControl(0);
  // New
  samplesToBeTracked$: Observable<any[]>;
  rejectedSamples$: Observable<any[]>;
  labSamplesForTrackingDetails$: Observable<any>;
  markingForReCollectState$: Observable<any>;
  savingMessage = {};
  /** TODO: Check how to handle this in a best way */
  userUuid = JSON.parse(sessionStorage.getItem('sessionInfo'))['user']['uuid'];

  samplesMarkedForReCollection$: Observable<any>;
  constructor(private store: Store<AppState>, private dialog: MatDialog) {}

  ngOnInit(): void {
    if (
      this.privileges &&
      !this.privileges['Sample Collection'] &&
      !this.privileges['Sample Tracking'] &&
      !this.privileges['Laboratory Reports'] &&
      !this.privileges['Sample Acceptance and Results'] &&
      !this.privileges['Tests Settings']
    ) {
      window.location.replace('../../../bahmni/home/index.html#/dashboard');
    }
    const formattedLabSamples = groupLabOrdersBySpecimenSources(
      this.labOrdersGroupedByPatients,
      this.sampleTypes,
      this.collectedLabOrders,
      this.testsContainers,
      this.sampleContainers,
      this.visitReferences,
      this.codedSampleRejectionReasons,
      this.labConfigs,
      this.labDepartments
    );
    this.store.dispatch(setLoadedSamples({ labSamples: formattedLabSamples }));
    // this.store.dispatch(loadActiveVisitsForSampleManagement());
    this.store.dispatch(
      loadActiveVisitsForSampleManagement({
        visits: this.visits,
        sampleTypes: this.sampleTypes,
        billingInfo: null,
      })
    );
    this.samplesLoadedState$ = this.store.select(getSamplesLoadedState);
    // this.samples = getPatientsCollectedSamples(
    //   this.visits,
    //   this.sampleTypes,
    //   this.labOrdersBillingInfo
    // );

    this.labSamplesForTrackingDetails$ = this.store.select(
      getLabSamplesForShowingTrackingDetails,
      { searchingText: this.searchingText }
    );

    this.rejectedSamples$ = this.store.select(getAllRejectedLabSamples, {
      searchingText: this.searchingText,
    });

    this.samplesMarkedForReCollection$ = this.store.select(
      getAllRejectedLabSamplesAndMarkedForReCollection,
      { searchingText: this.searchingText }
    );

    this.markingForReCollectState$ = this.store.select(
      getMarkingForReCollectionState
    );

    // this.samplesRejected = _.filter(formatSamplesToFeedResults(this.samples), {
    //   rejected: true,
    // });

    // _.each(this.samplesRejected, (sample) => {
    //   this.samplesReadyForAction[
    //     sample.sampleUniquIdentification + '-tab1'
    //   ] = false;
    // });
  }

  setViewItems(e, sample) {
    e.stopPropagation();
    this.dialog.open(SampleTrackingModalComponent, {
      width: '70%',
      height: '500px',
      disableClose: false,
      data: sample,
      panelClass: 'custom-dialog-container',
    });
  }

  onSearch(e) {
    e.stopPropagation();

    this.labSamplesForTrackingDetails$ = this.store.select(
      getLabSamplesForShowingTrackingDetails,
      { searchingText: this.searchingText }
    );

    this.rejectedSamples$ = this.store.select(getAllRejectedLabSamples, {
      searchingText: this.searchingText,
    });

    this.samplesMarkedForReCollection$ = this.store.select(
      getAllRejectedLabSamplesAndMarkedForReCollection,
      { searchingText: this.searchingText }
    );
  }

  onOpenNewTab(e) {
    this.searchingText = '';

    this.labSamplesForTrackingDetails$ = this.store.select(
      getLabSamplesForShowingTrackingDetails,
      { searchingText: this.searchingText }
    );

    this.rejectedSamples$ = this.store.select(getAllRejectedLabSamples, {
      searchingText: this.searchingText,
    });

    this.samplesMarkedForReCollection$ = this.store.select(
      getAllRejectedLabSamplesAndMarkedForReCollection,
      { searchingText: this.searchingText }
    );
  }

  unSetSampleToView(sample, addedKey) {
    this.samplesReadyForAction[
      sample.sampleUniquIdentification + '-' + addedKey
    ] = false;
  }

  changeTab(val) {
    this.selected.setValue(val);
  }

  onReCollect(e, sample) {
    e.stopPropagation();
    
    const reCollectingStatus = {
      sample: {
        uuid: sample?.sampleUuid,
      },
      user: {
        uuid: this.userUuid,
      },
      remarks: 'For re-collecting',
      status: 'RECOLLECT',
    };
    this.store.dispatch(
      setSampleStatus({ status: reCollectingStatus, details: sample })
    );
  }
}
