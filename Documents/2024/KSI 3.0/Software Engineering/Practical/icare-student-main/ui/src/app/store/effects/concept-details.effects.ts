import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ConceptsService } from 'src/app/shared/resources/concepts/services/concepts.service';
import {
  loadConcept,
  upsertLoadedConcept,
  loadingConceptFails,
  loadConceptByUuid,
} from '../actions';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { formatConceptResults } from 'src/app/shared/resources/concepts/helpers';

@Injectable()
export class ConceptEffects {
  constructor(
    private actions$: Actions,
    private conceptService: ConceptsService
  ) {}

  conceptDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadConcept),
      switchMap((action) =>
        this.conceptService.getConceptDetails(action.name, action.fields).pipe(
          map((conceptDetails) => {
            const results = conceptDetails?.results || [];
            return upsertLoadedConcept({
              concepts: formatConceptResults(results),
            });
          }),
          catchError((error) => of(loadingConceptFails({ error })))
        )
      )
    )
  );

  conceptDetailsByUuid$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadConceptByUuid),
      switchMap((action) =>
        this.conceptService
          .getConceptDetailsByUuid(action.uuid, action.fields)
          .pipe(
            map((conceptDetails) => {
              const results = [conceptDetails] || [];
              return upsertLoadedConcept({
                concepts: formatConceptResults(results),
              });
            }),
            catchError((error) => of(loadingConceptFails({ error })))
          )
      )
    )
  );
}
