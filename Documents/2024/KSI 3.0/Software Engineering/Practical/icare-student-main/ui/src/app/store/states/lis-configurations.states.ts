import { BaseState, initialBaseState } from "src/app/store/states/base.state";

export interface LISConfigsState extends BaseState {
  LISConfigs: any;
}

export const initialLISConfigsState = {
  ...initialBaseState,
  LISConfigs: null,
};
