import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PrintResultsModalComponent } from '../print-results-modal/print-results-modal.component';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { getAllFullCompletedLabSamplesGroupedByMRN } from 'src/app/store/selectors';

@Component({
  selector: 'app-results-to-print',
  templateUrl: './results-to-print.component.html',
  styleUrls: ['./results-to-print.component.scss'],
})
export class ResultsToPrintComponent implements OnInit {
  @Input() samplesFullCompleted: any[];
  @Input() authenticatedUser: any;
  @Input() labConfigs: any;
  @Input() visitsParams: any;

  patientMRNS: string[];
  samplesGroupedBymRNo: any[] = [];

  filteredSamplesMRN: any[];
  searchingText: string = '';

  labSamplesGroupedByMRN$: Observable<any>;

  constructor(private dialog: MatDialog, private store: Store<AppState>) {}

  ngOnInit(): void {
    // this.samplesGroupedBymRNo = _.groupBy(this.samplesFullCompleted, 'mrNo');

    this.patientMRNS = Object.keys(this.samplesGroupedBymRNo);
    this.labSamplesGroupedByMRN$ = this.store.select(
      getAllFullCompletedLabSamplesGroupedByMRN,
      { searchingText: this.searchingText }
    );
  }

  onSearch(e) {
    if (e) {
      e.stopPropagation();
    }
    this.labSamplesGroupedByMRN$ = this.store.select(
      getAllFullCompletedLabSamplesGroupedByMRN,
      { searchingText: this.searchingText }
    );
  }

  openPrintDialog(e, samples) {
    e.stopPropagation();

    this.dialog.open(PrintResultsModalComponent, {
      data: {
        samples: samples,
        user: this.authenticatedUser,
        labConfigs: this.labConfigs,
      },
      width: '60%',
      height: '810px',
      disableClose: false,
    });
  }
}
