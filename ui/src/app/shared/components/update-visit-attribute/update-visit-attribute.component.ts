import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loadActiveVisit } from 'src/app/store/actions/visit.actions';
import { AppState } from 'src/app/store/reducers';
import {
  getActiveVisit,
  getActiveVisitAuthorizationNumberAttribute,
} from 'src/app/store/selectors/visit.selectors';
import { Visit } from '../../resources/visits/models/visit.model';
import { VisitsService } from '../../resources/visits/services';

@Component({
  selector: 'app-update-visit-attribute',
  templateUrl: './update-visit-attribute.component.html',
  styleUrls: ['./update-visit-attribute.component.scss'],
})
export class UpdateVisitAttributeComponent implements OnInit {
  @Input() patient: any;
  authNoAttribute$: Observable<any>;
  activeVisit$: Observable<Visit>;
  authorization: string;
  updatingAttribute: boolean = false;
  updatedAttribute: boolean = false;
  constructor(
    private store: Store<AppState>,
    private visitService: VisitsService
  ) {}

  ngOnInit(): void {
    this.authNoAttribute$ = this.store.select(
      getActiveVisitAuthorizationNumberAttribute
    );
    this.activeVisit$ = this.store.select(getActiveVisit);
  }

  saveAttribute(event: Event, attribute, visit): void {
    event.stopPropagation();
    const visitPayload = {
      uuid: visit?.uuid,
      attributes: [
        {
          ...attribute,
          value: this.authorization,
        },
      ],
    };
    this.updatingAttribute = true;
    this.updatedAttribute = false;
    this.visitService
      .updateVisitExisting(visitPayload)
      .subscribe((response) => {
        if (response) {
          this.updatingAttribute = false;
          this.updatedAttribute = true;
          this.store.dispatch(
            loadActiveVisit({ patientId: this.patient?.patient?.uuid })
          );
        }
      });
  }
}
