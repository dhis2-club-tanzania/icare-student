import { Action, createReducer, on } from '@ngrx/store';
import {
  loadedBaseState,
  loadingBaseState,
  errorBaseState
} from 'src/app/store/states/base.state';
import {
  finishConsultation,
  startConsultation,
  upsertConsultation,
  startConsultationError
} from '../actions/consultation.actions';
import {
  ConsultationState,
  initialConsultationState
} from '../states/consultation.state';

const reducer = createReducer(
  initialConsultationState,
  on(startConsultation, state => ({ ...state, ...loadingBaseState })),
  on(startConsultationError, state => ({ ...state, ...errorBaseState })),
  on(upsertConsultation, (state, { consultation }) => ({
    ...state,
    ...consultation,
    ...loadedBaseState
  })),
  on(finishConsultation, state => ({
    ...state,
    encounterUuid: undefined,
    startDate: undefined,
    stopDate: undefined
  }))
);

export function consultationReducer(
  state: ConsultationState,
  action: Action
): ConsultationState {
  return reducer(state, action);
}
