import { BaseState, initialBaseState } from './base.state';

export interface LabOrdersBillingInfoState extends BaseState {
  labOrdersBillingInfo: any;
}

export const initialLabOrdersBillingInfo = {
  labOrdersBillingInfo: null,
  ...initialBaseState
};
