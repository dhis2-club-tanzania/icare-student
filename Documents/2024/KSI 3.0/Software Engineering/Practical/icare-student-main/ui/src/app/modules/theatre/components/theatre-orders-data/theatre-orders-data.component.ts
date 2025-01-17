import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { OpenMRSForm } from 'src/app/shared/modules/form/models/custom-openmrs-form.model';
import { Patient } from 'src/app/shared/resources/patient/models/patient.model';
import { VisitObject } from 'src/app/shared/resources/visits/models/visit-object.model';
import { AppState } from 'src/app/store/reducers';
import {
  getAllRadiologyOrders,
  getOrdersByOrderType,
} from 'src/app/store/selectors';

@Component({
  selector: 'app-theatre-orders-data',
  templateUrl: './theatre-orders-data.component.html',
  styleUrls: ['./theatre-orders-data.component.scss'],
})
export class TheatreOrdersDataComponent implements OnInit {
  @Input() patient: Patient;
  @Input() location: any;
  @Input() visit: VisitObject;
  @Input() provider: any;
  @Input() forms: OpenMRSForm[];
  @Input() observations: any;
  @Input() vitalSignObservations: any;

  radilogyOrders$: Observable<any[]>;
  procedureOrders$: Observable<any[]>;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.radilogyOrders$ = this.store.select(getOrdersByOrderType, {
      orderType: 'Radiology Order',
    });

    this.procedureOrders$ = this.store.select(getOrdersByOrderType, {
      orderType: 'Procedure Order',
    });
  }
}
