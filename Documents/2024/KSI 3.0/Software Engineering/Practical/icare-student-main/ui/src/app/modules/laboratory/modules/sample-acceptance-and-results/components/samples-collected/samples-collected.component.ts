import { Component, OnInit, Input } from '@angular/core';
import { getPatientsCollectedSamples } from 'src/app/shared/helpers/patient.helper';


@Component({
  selector: 'app-samples-collected',
  templateUrl: './samples-collected.component.html',
  styleUrls: ['./samples-collected.component.scss'],
})
export class SamplesCollectedComponent implements OnInit {
  @Input() visits: any;
  @Input() sampleTypes: any;
  @Input() labOrdersBillingInfo: any;
  samples: any[];
  searchingText: string = '';
  constructor() {}

  ngOnInit(): void {
    this.samples = getPatientsCollectedSamples(
      this.visits,
      this.sampleTypes,
      this.labOrdersBillingInfo
    );
  }
}
