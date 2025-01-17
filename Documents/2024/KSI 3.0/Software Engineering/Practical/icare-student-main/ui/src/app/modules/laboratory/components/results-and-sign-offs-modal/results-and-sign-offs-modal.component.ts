import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ConceptGetFull, UserGetFull } from 'src/app/shared/resources/openmrs';
import { loadConcept, loadConceptByUuid } from 'src/app/store/actions';
import { AppState } from 'src/app/store/reducers';
import { getConceptDetailsByName } from 'src/app/store/selectors';
import { addLabTestResults, signOffLabTestResult } from '../../store/actions';
import { getTestOrderDetails } from '../../store/selectors/samples.selectors';

import * as _ from 'lodash';

@Component({
  selector: 'app-results-and-sign-offs-modal',
  templateUrl: './results-and-sign-offs-modal.component.html',
  styleUrls: ['./results-and-sign-offs-modal.component.scss'],
})
export class ResultsAndSignOffsModalComponent implements OnInit {
  testOrder: any;
  testConceptDetails$: Observable<ConceptGetFull>;
  result: any;
  orderResults: any;
  notInRangeIsSet: boolean = false;
  currentUser: UserGetFull;
  approvalCount: number = 0;
  currentTestOrderDetails$: Observable<any>;

  conceptForDataEntry$: Observable<any>;

  multipleResults = {};

  constructor(
    private store: Store<AppState>,
    private dialogRef: MatDialogRef<ResultsAndSignOffsModalComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.testOrder = data?.testOrder;
    this.currentUser = data?.user;
    this.orderResults = this.testOrder?.testAllocations[0]?.results[0]?.valueNumeric;
    this.approvalCount = this.testOrder?.testAllocations[0]?.statuses?.length;
  }

  ngOnInit(): void {
    // console.log('testOrder', this.testOrder);
    // this.store.dispatch(
    //   loadConceptByUuid({
    //     uuid: this.testOrder?.concept?.uuid,
    //     fields:
    //       'custom:(uuid,name,answers:(uuid,display),setMembers(uuid,display))',
    //   })
    // );
    /** TODO: add selector for the current test order */
    this.testConceptDetails$ = this.store.select(getConceptDetailsByName, {
      name: this.testOrder?.concept?.display,
    });
    this.currentTestOrderDetails$ = this.store.select(getTestOrderDetails, {
      orderUuid: this.testOrder?.uuid,
      sampleId: this.testOrder?.sampleId,
    });
  }

  setValue(val) {
    this.result = val;
  }

  onComplete(e, testOrder, currentDetails) {
    e.stopPropagation();
    /**TODO: add support for different data types */
    if (this.result) {
      this.store.dispatch(
        addLabTestResults({
          sample: testOrder?.sample,
          labResultsDetails: {
            concept: {
              uuid: currentDetails?.concept?.uuid,
            },
            testAllocation: {
              uuid: (currentDetails?.testAllocations || [])[0]?.uuid,
            },
            valueNumeric: this.result,
          },
        })
      );
    } else {
      _.each(Object.keys(this.multipleResults), (key) => {
        this.store.dispatch(
          addLabTestResults({
            sample: testOrder?.sample,
            labResultsDetails: {
              concept: {
                uuid: key,
              },
              testAllocation: {
                uuid: (currentDetails?.testAllocations || [])[0]?.uuid,
              },
              valueNumeric: this.multipleResults[key],
            },
          })
        );
      });
    }
  }

  onToggleFreeEntry(e) {
    e.stopPropagation();
    this.notInRangeIsSet = !this.notInRangeIsSet;
  }

  onApprove(e, testOrder, currentDetails) {
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
            uuid: (currentDetails?.testAllocations || [])[0]?.uuid,
          },
        },
        allocationUuid: (currentDetails?.testAllocations || [])[0]?.uuid,
      })
    );
  }

  onClose(e) {
    e.stopPropagation();
    this.dialogRef.close();
  }
}
