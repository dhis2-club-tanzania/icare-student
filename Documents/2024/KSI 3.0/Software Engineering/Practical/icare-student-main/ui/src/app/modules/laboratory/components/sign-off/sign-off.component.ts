import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { SampleObject } from '../../resources/models';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import {
  getLabSampleById,
  getLabSampleWithLabTestsHavingFirstSignOff,
} from '../../store/selectors/samples.selectors';
import { signOffLabTestResult } from '../../store/actions';

@Component({
  selector: 'app-sign-off',
  templateUrl: './sign-off.component.html',
  styleUrls: ['./sign-off.component.scss'],
})
export class SignOffComponent implements OnInit, OnChanges {
  @Input() sample: SampleObject;
  @Input() signOff: string;
  updateSample$: Observable<SampleObject[]>;
  sampleForSecondSignOff$: Observable<SampleObject[]>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.updateSample$ = this.store.select(getLabSampleById, {
      id: this.sample?.id,
    });
  }

  ngOnChanges() {
    if (this.signOff != 'FIRST') {
      this.sampleForSecondSignOff$ = this.store.select(
        getLabSampleWithLabTestsHavingFirstSignOff,
        { id: this.sample?.id }
      );
    }
  }

  saveSignOff(e, testOrder, signOff, sample) {
    e.stopPropagation();
  }
}
