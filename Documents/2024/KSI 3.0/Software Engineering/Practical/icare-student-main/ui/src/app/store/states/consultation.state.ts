import { Consultation } from 'src/app/core/models';
import { BaseState, initialBaseState } from 'src/app/store/states/base.state';

export interface ConsultationState extends BaseState, Consultation {}

export const initialConsultationState: ConsultationState = {
  ...initialBaseState,
  encounterUuid: undefined,
  startDate: undefined,
  stopDate: undefined,
};
