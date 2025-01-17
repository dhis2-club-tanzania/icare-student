import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { from, of } from "rxjs";
import { concatMap, map, switchMap, tap, withLatestFrom } from "rxjs/operators";
import { ICAREForm } from "src/app/shared/modules/form/models/form.model";
import { FormService } from "src/app/shared/modules/form/services";
import {
  initiateFormLoadingState,
  loadCustomOpenMRSForm,
  loadCustomOpenMRSForms,
  loadForms,
  loadFormsFailed,
  upsertForms,
} from "../actions";
import { AppState } from "../reducers";
import { getFormsByNames, getFormsEntities } from "../selectors/form.selectors";
import {
  NotificationService,
  Notification,
} from "src/app/shared/services/notification.service";

import * as _ from "lodash";
import { getSanitizedFormObject } from "src/app/shared/modules/form/helpers/get-sanitized-form-object.helper";

@Injectable()
export class FormEffects {
  loadForms$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadForms),
        concatMap((action) =>
          of(action).pipe(
            withLatestFrom(
              this.store.pipe(select(getFormsByNames(action.formConfigs)))
            )
          )
        ),
        tap(([{ formConfigs }, formFromStore]) => {
          if (formFromStore.length === 0) {
            this.notificationService.show(
              new Notification({
                message: "Loading Consultation forms",
                type: "LOADING",
              })
            );

            this.store.dispatch(initiateFormLoadingState());
            this.formService.getForms(formConfigs).subscribe(
              (forms: ICAREForm[]) => {
                this.notificationService.show(
                  new Notification({
                    message: "Consultation forms successfully loaded",
                    type: "SUCCESS",
                  })
                );

                this.store.dispatch(upsertForms({ forms }));
              },
              (error) => {
                this.notificationService.show(
                  new Notification({
                    message: "Error loading consultation forms",
                    type: "ERROR",
                  })
                );

                this.store.dispatch(loadFormsFailed({ error }));
              }
            );
          }
        })
      ),
    { dispatch: false }
  );

  customOpenMRSForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCustomOpenMRSForm),
      withLatestFrom(this.store.select(getFormsEntities)),
      switchMap(([action, formsEntities]: [any, any]) => {
        if (formsEntities && formsEntities[action.formUuid]) {
          return from([]);
        } else {
          return this.formService.getCustomeOpenMRSForm(action.formUuid).pipe(
            map((formResponse) => {
              const formattedFormFields = _.orderBy(
                _.map(formResponse?.formFields, (formField) => {
                  return getSanitizedFormObject(
                    formField?.field?.concept,
                    formField,
                    action?.causesOfDeathConcepts,
                    formResponse?.conceptSourceUuid
                  );
                }),
                ["fieldNumber"],
                ["asc"]
              );

              const keyedGroups =
                formattedFormFields && formattedFormFields?.length > 0
                  ? _.groupBy(formattedFormFields, "fieldPart") || []
                  : null;
              const formattedForm = {
                id: formResponse?.uuid,
                ...formResponse,
                formFields: formattedFormFields,
                groupedFields: keyedGroups
                  ? Object.keys(keyedGroups)?.map((key) =>
                      keyedGroups[key]?.map((fieldItem) =>
                        fieldItem?.formField
                          ? fieldItem?.formField
                          : fieldItem?.formFiels
                      )
                    )
                  : null,
                unGroupedFields:
                  formattedFormFields?.filter(
                    (formField: any) => !formField?.formField
                  ) || [],
                isForm: true,
              };
              return upsertForms({ forms: [formattedForm] });
            })
          );
        }
      })
    )
  );

  customOpenMRSForms$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCustomOpenMRSForms),
      withLatestFrom(this.store.select(getFormsEntities)),
      switchMap(([action, formsEntities]: [any, any]) => {
        const loadedFormsIds = Object.keys(formsEntities);
        const missingIds = _.difference(action.formUuids, loadedFormsIds) || [];
        if (missingIds.length > 0) {
          return this.formService.getCustomeOpenMRSForms(missingIds).pipe(
            map((formsResponse) => {
              let forms = [];
              _.map(formsResponse, (formResponse) => {
                let formattedFormFields = [];

                _.map(formResponse?.formFields, (formField) => {
                  if (formField.fieldNumber) {
                    formattedFormFields = _.orderBy(
                      [
                        ...formattedFormFields,
                        getSanitizedFormObject(
                          formField?.field?.concept,
                          formField,
                          action.causesOfDeathConcepts,
                          formResponse?.conceptSourceUuid
                        ),
                      ],
                      ["fieldNumber", "fieldPart"],
                      ["asc", "asc"]
                    );
                  }
                });

                const keyedGroups =
                  formattedFormFields && formattedFormFields?.length > 0
                    ? _.groupBy(formattedFormFields, "fieldPart") || []
                    : null;

                forms = [
                  ...forms,
                  {
                    id: formResponse?.uuid,
                    ...formResponse,
                    formFields: formattedFormFields,
                    groupedFields: keyedGroups
                      ? Object.keys(keyedGroups)?.map((key) =>
                          keyedGroups[key]?.map((fieldItem) =>
                            fieldItem?.formField
                              ? fieldItem?.formField
                              : fieldItem
                          )
                        )
                      : null,
                    isForm: true,
                  },
                ];
              });
              return upsertForms({ forms: forms });
            })
          );
        } else {
          return from([]);
        }
      })
    )
  );

  constructor(
    private actions$: Actions,
    private formService: FormService,
    private store: Store<AppState>,
    private notificationService: NotificationService
  ) {}
}
