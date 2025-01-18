import { Component, OnInit, Input } from '@angular/core';
import { SampleObject } from '../../resources/models';

import { TestContainer } from '../../resources/models/test-containers.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { setContainerForLabTest } from '../../store/actions';

import * as _ from 'lodash';
import { Observable, of } from 'rxjs';
import {
  getLabSamplesGroupedBymrNoAndFilteredByStatus,
  getLabSampleById,
  getAllLabTestsAssignedOrActedByToCurrentUser,
} from '../../store/selectors/samples.selectors';
import { UserGetFull } from 'src/app/shared/resources/openmrs';

@Component({
  selector: 'app-technician-worklist',
  templateUrl: './technician-worklist.component.html',
  styleUrls: ['./technician-worklist.component.scss'],
})
export class TechnicianWorklistComponent implements OnInit {
  samplesGroupedBymrNo$: Observable<SampleObject[]>;
  expandedRow: number;
  currentSample$: Observable<SampleObject>;
  containerToTestOrder = {};
  labTests$: Observable<any>;
  @Input() testContainers: TestContainer[];
  @Input() currentUser: UserGetFull;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.labTests$ = this.store.select(
      getAllLabTestsAssignedOrActedByToCurrentUser,
      { user: this.currentUser }
    );
  }

  getContainerValue(testContainer, testOrder) {
    this.containerToTestOrder[testOrder.orderNumber] = testContainer;
  }

  setContainer(e, testOrder) {
    e.stopPropagation();
    this.store.dispatch(
      setContainerForLabTest({
        sample: testOrder?.sample,
        testToContainerDetails: {
          testOrder: testOrder,
          allocation: {
            order: {
              uuid: testOrder?.uuid,
            },
            container: {
              uuid: this.containerToTestOrder[testOrder.orderNumber],
            },
            sample: {
              uuid: testOrder?.sampleUuid,
            },
            label: testOrder?.orderNumber,
          },
        },
      })
    );
  }
}
