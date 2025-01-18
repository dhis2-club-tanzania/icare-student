import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { addLabTestResults } from '../../store/actions';

import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { getLabResultsSavingState } from '../../store/selectors/samples.selectors';

@Component({
  selector: 'app-capture-lab-results',
  templateUrl: './capture-lab-results.component.html',
  styleUrls: ['./capture-lab-results.component.scss'],
})
export class CaptureLabResultsComponent implements OnInit {
  @Input() testOrder: any;
  @Input() orderableConcept: any;
  @Input() specimenSourceName: string;
  conceptsToCaptureData: any[];
  results: any = {};
  notInRangeIsSet: boolean = false;
  currentTestAllocation: any;
  container: any;
  storedResults: any = {};
  savingResultsState$: Observable<boolean>;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.currentTestAllocation = this.testOrder?.testAllocations[0];
    _.each(this.currentTestAllocation?.results, (result) => {
      this.storedResults[result?.concept?.uuid] = result?.valueNumeric
        ? result?.valueNumeric
        : result?.valueText
        ? result?.valueText
        : null;

      this.results[result?.concept?.uuid] = result?.valueNumeric
        ? result?.valueNumeric
        : result?.valueText
        ? result?.valueText
        : null;
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
    this.savingResultsState$ = this.store.select(getLabResultsSavingState);
  }

  onToggleFreeEntry(e) {
    e.stopPropagation();
    this.notInRangeIsSet = !this.notInRangeIsSet;
  }

  setValue(val, concept) {
    this.results[concept?.uuid] = val;
  }

  onComplete(e, testOrder, concept) {
    e.stopPropagation();
    /**TODO: add support for different data types */
    if (this.results[concept?.uuid]) {
      this.store.dispatch(
        addLabTestResults({
          sample: testOrder?.sample,
          labResultsDetails: {
            concept: {
              uuid: concept?.uuid,
            },
            testAllocation: {
              uuid: (testOrder?.testAllocations || [])[0]?.uuid,
            },
            valueNumeric: this.results[concept?.uuid],
          },
        })
      );
    }
  }
}
