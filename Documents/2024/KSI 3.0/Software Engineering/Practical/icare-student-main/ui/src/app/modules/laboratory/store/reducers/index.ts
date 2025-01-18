import { StoreModule } from "@ngrx/store";
import { samplesReducer } from "./samples.reducer";
import { specimenSourcesAndLabTestsReducer } from "./specimen-sources-and-tests-management.reducer";
import { usersReducer } from "./users.reducer";

export const labReducers: any[] = [
  StoreModule.forFeature("labSamples", samplesReducer),
  StoreModule.forFeature(
    "specimenSourcesAndLabTests",
    specimenSourcesAndLabTestsReducer
  ),
  StoreModule.forFeature("users", usersReducer),
];
