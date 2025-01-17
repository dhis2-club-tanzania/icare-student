import { createSelector } from "@ngrx/store";
import { FormConfig } from "src/app/shared/modules/form/models/form-config.model";
import { ICAREForm } from "src/app/shared/modules/form/models/form.model";
import { AppState, getRootState } from "../reducers";
import { formAdapter, FormState } from "../states/form.state";
import { filter } from "lodash";

const getFormState = createSelector(
  getRootState,
  (state: AppState) => state.form
);

export const { selectEntities: getFormsEntities, selectAll: getAllForms } =
  formAdapter.getSelectors(getFormState);

export const getFormsByNames = (formConfigs: FormConfig[]) =>
  createSelector(getAllForms, (forms: ICAREForm[]) =>
    (forms || []).filter((form) =>
      (formConfigs || []).some((formConfig) => formConfig.name === form.name)
    )
  );

export const getOpenMRSForms = createSelector(getAllForms, (forms) => {
  return forms.filter((form: any) => form?.isForm) || [];
});

export const getFormEntitiesByNames = (formConfigs: FormConfig[]) =>
  createSelector(getFormsByNames(formConfigs), (forms: ICAREForm[]) => {
    const formEntities = {};
    forms.forEach((form) => {
      formEntities[form.name] = form;
    });
    return formEntities;
  });

export const getFormsLoadingState = createSelector(
  getFormState,
  (formState: FormState) => formState.loading
);

export const getCustomOpenMRSFormById = createSelector(
  getFormsEntities,
  (formEntities, props) => formEntities[props?.id] || null
);

export const getCustomOpenMRSFormsByIds = (formUUids: string[]) =>
  createSelector(getAllForms, (allForms) =>
    filter(allForms, (form) => {
      if (formUUids.indexOf(form.uuid) > -1) {
        return form;
      }
    })
  );
