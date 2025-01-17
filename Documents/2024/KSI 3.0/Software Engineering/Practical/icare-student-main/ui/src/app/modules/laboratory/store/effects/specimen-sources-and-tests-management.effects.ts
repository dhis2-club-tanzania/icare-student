import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { SpecimenSourcesService } from "../../resources/services/specimen-sources.service";
import {
  loadSpecimenSources,
  addLoadedSpecimenSources,
  loadingSpecimenSourcesFails,
} from "../actions/specimen-sources-and-tests-management.actions";
import { switchMap, map, catchError } from "rxjs/operators";
import { of } from "rxjs";
import { formatConceptResults } from "src/app/shared/resources/concepts/helpers";

@Injectable()
export class SpecimenSourcesAndLabTestsConceptsEffects {
  constructor(
    private actions$: Actions,
    private specimenSourcesService: SpecimenSourcesService
  ) {}

  specimenSources$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSpecimenSources),
      switchMap(() =>
        this.specimenSourcesService
          .getSpecimenSources({
            name: "Specimen sources",
            fields:
              "custom:(uuid,name,setMembers:(uuid,display,setMembers:(uuid,display,datatype,mappings:(uuid,display,conceptReferenceTerm:(name,code)),hiNormal,lowNormal,units,numeric,answers)))",
          })
          .pipe(
            map((specimenSourcesResponse) => {
              const results = specimenSourcesResponse?.results || [];
              return addLoadedSpecimenSources({
                specimenSources: formatConceptResults(results),
              });
            }),
            catchError((error) => {
              return of(loadingSpecimenSourcesFails({ error }));
            })
          )
      )
    )
  );
}
