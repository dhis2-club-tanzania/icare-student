import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loadConceptByUuid } from 'src/app/store/actions';
import { AppState } from 'src/app/store/reducers';
import { getConceptById } from 'src/app/store/selectors';
import { ConceptGet } from '../../resources/openmrs';

@Component({
  selector: 'app-shared-concept-display',
  templateUrl: './shared-concept-display.component.html',
  styleUrls: ['./shared-concept-display.component.scss'],
})
export class SharedConceptDisplayComponent implements OnInit {
  @Input() attributeValue: string;
  @Input() attributeDisplay: string;

  conceptItem$: Observable<ConceptGet>;
  loading: Boolean = true;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.dispatch(
      loadConceptByUuid({
        uuid: this.attributeValue,
        fields: 'custom:(uuid,display)',
      })
    );
    this.conceptItem$ = this.store.select(getConceptById, {
      id: this.attributeValue,
    });
    this.loading = false;
  }
}
