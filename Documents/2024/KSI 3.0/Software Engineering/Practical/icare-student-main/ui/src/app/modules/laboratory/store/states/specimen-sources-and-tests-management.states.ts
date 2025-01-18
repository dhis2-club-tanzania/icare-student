import { BaseState, initialBaseState } from 'src/app/store/states/base.state';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { SpecimenSourcesAndLabTestsModal } from '../../resources/models';

export interface SpecimenSourcesAndLabTestsState
  extends BaseState,
    EntityState<SpecimenSourcesAndLabTestsModal> {}

export const specimenSourcesAndLabTestsAdapter: EntityAdapter<SpecimenSourcesAndLabTestsModal> = createEntityAdapter<
  SpecimenSourcesAndLabTestsModal
>();

export const initialSpecimenSourcesAndLabTestsState = specimenSourcesAndLabTestsAdapter.getInitialState(
  {
    ...initialBaseState
  }
);
