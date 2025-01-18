import { Component, OnInit, Input } from '@angular/core';
import { SampleObject } from '../../resources/models';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { FormControl } from '@angular/forms';
import {
  getLabSamplesGroupedBymrNoAndFilteredByStatus,
  getLabSampleById,
  getAllLabTestsAssignedOrActedByToCurrentUser,
} from '../../store/selectors/samples.selectors';
import { Observable, of } from 'rxjs';
import { UserGetFull } from 'src/app/shared/resources/openmrs';
import { MatDialog } from '@angular/material/dialog';
import { ResultsAndSignOffsModalComponent } from '../results-and-sign-offs-modal/results-and-sign-offs-modal.component';
import { loadConcept } from 'src/app/store/actions';

@Component({
  selector: 'app-lab-results',
  templateUrl: './lab-results.component.html',
  styleUrls: ['./lab-results.component.scss'],
})
export class LabResultsComponent implements OnInit {
  expandedRow: number;
  samplesGroupedBymrNo$: Observable<SampleObject[]>;
  currentSample$: Observable<SampleObject>;
  selectedTab = new FormControl(0);
  testResultsObject = {};
  @Input() currentUser: UserGetFull;
  labTests$: Observable<any>;
  constructor(private store: Store<AppState>, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.labTests$ = this.store.select(
      getAllLabTestsAssignedOrActedByToCurrentUser,
      { user: this.currentUser }
    );
  }

  changeTab(val): void {
    this.selectedTab.setValue(val);
  }

  getResult(result, testOrder) {
    //console.log('resu', result);
    this.testResultsObject[testOrder.orderNumber] = result;
  }

  saveResult(e, testOrder, sample) {
    e.stopPropagation();
  }

  onGetModalForResultsApproval(e, testOrder) {
    e.stopPropagation();
    this.store.dispatch(
      loadConcept({
        name: testOrder?.concept?.display,
        fields:
          'custom:(uuid,display,conceptClass,datatype,hiNormal,hiAbsolute,hiCritical,lowNormal,lowAbsolute,lowCritical,units,numeric,descriptions,allowDecimal,displayPrecision,setMembers,answers)',
      })
    );
    this.dialog.open(ResultsAndSignOffsModalComponent, {
      width: '70%',
      height: '500px',
      disableClose: true,
      data: { testOrder: testOrder, user: this.currentUser },
      panelClass: 'custom-dialog-container',
    });
  }
}
