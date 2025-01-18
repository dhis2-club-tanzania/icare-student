import { createSelector } from '@ngrx/store';
import { getUrl } from './router.selectors';
import { flatten } from 'lodash';
import { ICARE_APPS } from 'src/app/core/containers/modules/modules.constants';

export const showSearchPatientOnMenu = createSelector(getUrl, (url) => {
  const appModules = flatten(
    (ICARE_APPS || []).map((app) => app?.modules).filter((module) => module)
  );

  return url
    ? !appModules.some(
        (module) => module.path === url && module.hidePatientSearch
      )
    : false;
});
