import { BaseState, initialBaseState } from './base.state';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ConceptGetFull } from 'src/app/shared/resources/openmrs';

export interface ConceptState extends BaseState, EntityState<ConceptGetFull> {}

export const conceptAdapter: EntityAdapter<ConceptGetFull> = createEntityAdapter<
  ConceptGetFull
>();

export const initialConceptState = conceptAdapter.getInitialState({
  ...initialBaseState
});
