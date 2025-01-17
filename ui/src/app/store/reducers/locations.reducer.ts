import { createReducer, on } from "@ngrx/store";
import { initialLocationsState, locationsAdapter } from "../states";
import {
  loadLocationsByTagName,
  loadingLocationsFails,
  setCurrentUserCurrentLocation,
  loadLoginLocations,
  loadLocationById,
  addLoadedLocations,
  upsertLocation,
  loadingLocationByTagNameFails,
  clearLocations,
  updateCurrentLocationStatus,
  upsertLocations,
  loadLocationByIds,
  setAllUserAssignedLocationsLoadedState,
} from "../actions";
import {
  loadingBaseState,
  loadedBaseState,
  errorBaseState,
} from "../states/base.state";

const reducer = createReducer(
  initialLocationsState,
  on(loadLoginLocations, (state) => ({
    ...state,
    ...loadingBaseState,
  })),
  on(addLoadedLocations, (state, { locations }) =>
    locationsAdapter.addMany(locations, {
      ...state,
      ...loadedBaseState,
      loadingByTagName: false,
      loadedByTagName: true,
      errorLoadingByTagName: null,
      loadingLocationById: false,
    })
  ),
  on(loadingLocationsFails, (state, { error }) => ({
    ...state,
    error,
    ...errorBaseState,
  })),
  on(setCurrentUserCurrentLocation, (state, { location }) => ({
    ...state,
    currentUserCurrentLocation: location,
    settingLocation: true,
  })),
  on(loadLocationById, (state) => ({
    ...state,
    loadingLocationById: true,
  })),
  on(loadLocationByIds, (state) => {
    return {
      ...state,
      loadingLocationById: true,
    };
  }),
  on(upsertLocation, (state, { location }) =>
    locationsAdapter.upsertOne(location, { ...state })
  ),
  on(upsertLocations, (state, { locations }) => {
    return locationsAdapter.upsertMany(locations, { ...state });
  }),
  on(loadLocationsByTagName, (state) => ({
    ...state,
    loadingByTagName: true,
    loadedByTagName: false,
    errorLoadingByTagName: null,
  })),
  on(loadingLocationByTagNameFails, (state, { error }) => ({
    ...state,
    loadingByTagName: false,
    loadedByTagName: true,
    errorLoadingByTagName: error,
  })),
  on(clearLocations, (state) =>
    locationsAdapter.removeAll({ ...state, currentUserCurrentLocation: null })
  ),
  on(updateCurrentLocationStatus, (state, { settingLocation }) => ({
    ...state,
    settingLocation,
  })),
  on(setAllUserAssignedLocationsLoadedState, (state, { allLoadedState }) => {
    return {
      ...state,
      allUserAssignedLocationsLoadedState: allLoadedState,
    };
  })
);

export function locationsReducer(state, action) {
  return reducer(state, action);
}
