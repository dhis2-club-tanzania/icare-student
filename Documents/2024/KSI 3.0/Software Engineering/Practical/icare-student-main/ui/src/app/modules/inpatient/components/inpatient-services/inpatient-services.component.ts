import { Component, Input, OnInit } from '@angular/core';
import { Visit } from 'src/app/shared/resources/visits/models/visit.model';

@Component({
  selector: 'app-inpatient-services',
  templateUrl: './inpatient-services.component.html',
  styleUrls: ['./inpatient-services.component.scss'],
})
export class InpatientServicesComponent implements OnInit {
  @Input() visit: Visit;
  @Input() currentBedOrder: any;
  constructor() {}

  ngOnInit(): void {}
}
