import { createSelector } from '@ngrx/store';
import { AppState, getRootState } from '../reducers';
import { SetMembersState, setMembersAdapter } from '../states';
import * as _ from 'lodash';

const getSetMembersState = createSelector(
  getRootState,
  (state: AppState) => state.setMembers
);

export const getSetMembersLoadedState = createSelector(
  getSetMembersState,
  (state: SetMembersState) => state.loaded
);

export const getSetMemberUuid = createSelector(
  getSetMembersState,
  (state: SetMembersState) => state.setMemberUuid
);

export const {
  selectAll: getAllSetMembers,
  selectEntities: getSetMembersEntities,
} = setMembersAdapter.getSelectors(getSetMembersState);

export const getSetMembersGrouped = createSelector(
  getAllSetMembers,
  (setMembers) =>
    _.map(Object.keys(_.groupBy(setMembers, 'sampletype')), (key) => {
      return {
        name: key,
        setMembers: _.groupBy(setMembers, 'sampletype')[key],
        searchingNames: _.groupBy(setMembers, 'sampletype')[key],
      };
    })
);

export const getSpecimenSourceByName = createSelector(
  getAllSetMembers,
  (setMembers, props) => {
    const specimenSources = _.map(
      Object.keys(_.groupBy(setMembers, 'sampletype')),
      (key) => {
        return {
          name: key,
          setMembers: _.groupBy(setMembers, 'sampletype')[key],
          searchingNames: _.groupBy(setMembers, 'sampletype')[key],
        };
      }
    );

    return (_.filter(specimenSources, { name: props?.name }) || [])[0];
  }
);
