import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';

import * as _ from 'lodash';
import { signOffLabTestResult } from '../../store/actions';
import { Observable } from 'rxjs';
import { getLabResultsSavingApprovalState } from '../../store/selectors/samples.selectors';

@Component({
  selector: 'app-capture-lab-results-approval',
  templateUrl: './capture-lab-results-approval.component.html',
  styleUrls: ['./capture-lab-results-approval.component.scss'],
})
export class CaptureLabResultsApprovalComponent implements OnInit {
  @Input() testOrder: any;
  @Input() orderableConcept: any;
  @Input() specimenSourceName: string;
  @Input() signOff: number;
  @Input() currentUser: any;
  conceptsToCaptureData: any[];
  currentTestAllocation: any;
  container: any;
  storedResults: any = {};
  countOfConceptsWithResults = 0;

  labResultsSavingApprovalState$: Observable<boolean>;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.currentTestAllocation = this.testOrder?.testAllocations[0];
    _.each(this.currentTestAllocation?.results, (result) => {
      this.storedResults[result?.concept?.uuid] = result?.valueNumeric
        ? result?.valueNumeric
        : result?.valueText
        ? result?.valueText
        : null;
    });
    _.each(Object.keys(this.storedResults), (key) => {
      if (this.storedResults[key]) {
        this.countOfConceptsWithResults++;
      }
    });
    this.container = {
      id: this.currentTestAllocation?.container?.uuid,
      name: this.currentTestAllocation?.container?.display,
      label: this.currentTestAllocation?.label,
    };
    this.conceptsToCaptureData =
      this.orderableConcept?.setMembers &&
      this.orderableConcept?.setMembers?.length > 0
        ? this.orderableConcept?.setMembers
        : [this.orderableConcept];
    this.labResultsSavingApprovalState$ = this.store.select(
      getLabResultsSavingApprovalState
    );
  }

  onApprove(e, testOrder) {
    e.stopPropagation();
    this.store.dispatch(
      signOffLabTestResult({
        sample: testOrder?.sample,
        signOffDetails: {
          status: 'APPROVED',
          remarks: '',
          user: {
            uuid: this.currentUser?.uuid,
          },
          testAllocation: {
            uuid: this.currentTestAllocation?.uuid,
          },
        },
        allocationUuid: this.currentTestAllocation?.uuid,
      })
    );
  }
}
