import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { formatPatientNotes } from 'src/app/shared/helpers/patient.helper';
import { VisitsService } from 'src/app/shared/services/visits.service';
import {
  addLoadedPatientNotes,
  loadingPatientNotesFails,
  loadPatientNotes,
} from '../actions';

@Injectable()
export class patientNotesEffects {
  constructor(
    private actions$: Actions,
    private visitsService: VisitsService
  ) {}

  patientNotes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPatientNotes),
      switchMap((action) =>
        this.visitsService
          .getPatientsVisitsNotes(action.patientUuid, action.conceptUuid)
          .pipe(
            map((notesResponse) => {
              return addLoadedPatientNotes({
                patientNotes: formatPatientNotes(
                  notesResponse,
                  action.patientUuid,
                  action.conceptUuid
                ),
              });
            }),
            catchError((error) => of(loadingPatientNotesFails(error)))
          )
      )
    )
  );
}
