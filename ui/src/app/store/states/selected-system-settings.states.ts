import { BaseState, initialBaseState } from "./base.state";

export interface SelectedSystemSettingsState extends BaseState {
  systemSettings: any[];
}

export const initialSelectedSystemSettingsState: SelectedSystemSettingsState = {
  ...initialBaseState,
  systemSettings: null,
};
