import { BaseState, initialBaseState } from 'src/app/store/states/base.state';

export interface FormPrivilegesConfigsState extends BaseState {
  formPrivileges: any;
}

export const initialFormPrivilegesState = {
  ...initialBaseState,
  formPrivileges: null,
};
