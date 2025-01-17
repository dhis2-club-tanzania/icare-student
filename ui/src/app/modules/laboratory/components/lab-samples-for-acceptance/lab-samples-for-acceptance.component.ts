import { Component, OnInit, Input } from '@angular/core';
import { SampleObject } from '../../resources/models';
import { groupSamplesBymRNo, formatLabSamples } from '../../resources/helpers';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import {
  getLabSamplesGroupedBymrNo,
  getLabSamplesFilteredByStatus,
  getLabSamplesGroupedBymrNoWithNoStatus,
} from '../../store/selectors/samples.selectors';
import { Observable } from 'rxjs';
import { loadAllLabSamples, setSampleStatus } from '../../store/actions';
import { MatDialog } from '@angular/material/dialog';
import { SampleRejectionReasonComponent } from '../sample-rejection-reason/sample-rejection-reason.component';
import { ProviderGet, UserGetFull } from 'src/app/shared/resources/openmrs';

@Component({
  selector: 'app-lab-samples-for-acceptance',
  templateUrl: './lab-samples-for-acceptance.component.html',
  styleUrls: ['./lab-samples-for-acceptance.component.scss'],
})
export class LabSamplesForAcceptanceComponent implements OnInit {
  @Input() provider: ProviderGet;
  @Input() currentUser: UserGetFull;
  samplesGroupedBymrNo$: Observable<SampleObject[]>;
  searchingText: string = '';
  constructor(private store: Store<AppState>, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.store.dispatch(loadAllLabSamples());
    this.samplesGroupedBymrNo$ = this.store.select(
      getLabSamplesGroupedBymrNoWithNoStatus
    );
  }

  setSampleStatus(e, sample, status) {
    e.stopPropagation();
    if (status == 'REJECTED') {
      const reasonDialog = this.dialog.open(SampleRejectionReasonComponent, {
        width: '35%',
        height: '170px',
        disableClose: true,
        panelClass: 'custom-dialog-container',
      });
      reasonDialog.afterClosed().subscribe((reason) => {
        this.store.dispatch(
          setSampleStatus({
            sample,
            sampleStatusDetails: {
              sampleId: sample?.id,
              status: status,
              user: this.currentUser,
              comments: reason,
            },
          })
        );
      });
    } else {
      this.store.dispatch(
        setSampleStatus({
          sample,
          sampleStatusDetails: {
            sampleId: sample?.id,
            status: status,
            user: this.currentUser,
          },
        })
      );
    }

    // this.samplesGroupedBymrNo$ = this.store.select(getLabSamplesGroupedBymrNo);
  }
}
