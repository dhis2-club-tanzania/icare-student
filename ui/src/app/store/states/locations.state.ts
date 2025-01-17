import { BaseState, initialBaseState } from "./base.state";
import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";

export interface LocationsState extends BaseState, EntityState<any> {
  currentUserCurrentLocation: any;
  loadingByTagName: boolean;
  loadedByTagName: boolean;
  errorLoadingByTagName: any;
  settingLocation: boolean;
  loadingLocationById: boolean;
  allUserAssignedLocationsLoadedState: boolean;
}

export const locationsAdapter: EntityAdapter<any> = createEntityAdapter<any>();

export const initialLocationsState = locationsAdapter.getInitialState({
  ...initialBaseState,
  currentUserCurrentLocation: null,
  loadingByTagName: false,
  loadedByTagName: false,
  errorLoadingByTagName: null,
  settingLocation: false,
  loadingLocationById: true,
  allUserAssignedLocationsLoadedState: false,
});
