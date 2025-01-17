import { createReducer, on } from '@ngrx/store';
import { initialPatientState, patientAdapter } from '../states';
import {
  loadPatientsDetails,
  addLoadedPatientsDetails,
  loadingPatientsFail,
  addCollectedSample,
  clearLoadedPatients,
  addPatientSamples,
  clearPatientSamples,
  setLabSampleStatus,
  updatePatientLabSample,
} from '../actions';
import {
  loadingBaseState,
  loadedBaseState,
  errorBaseState,
} from '../states/base.state';

import * as _ from 'lodash';

const reducer = createReducer(
  initialPatientState,
  on(loadPatientsDetails, (state) =>
    patientAdapter.removeAll({
      ...state,
      ...loadingBaseState,
      samples: [],
    })
  ),
  on(addLoadedPatientsDetails, (state, { patient }) =>
    patientAdapter.addOne(patient, { ...state, ...loadedBaseState })
  ),
  on(loadingPatientsFail, (state, { error }) => ({
    ...state,
    error,
    ...errorBaseState,
    ...loadedBaseState,
  })),
  on(addPatientSamples, (state, { samples }) => ({
    ...state,
    samples: [...state.samples, ...samples],
  })),
  on(addCollectedSample, (state, { sample }) => ({
    ...state,
    samples: [...state.samples, sample],
  })),
  on(clearPatientSamples, (state) => ({
    ...state,
    samples: [],
  })),
  on(setLabSampleStatus, (state, { sample }) => ({
    ...state,
  })),
  on(updatePatientLabSample, (state, { sample }) => ({
    ...state,
    samples: [
      ...(_.filter(state.samples, (labSample) => {
        if (labSample.id !== sample?.id) {
          return labSample;
        }
      }) || []),
      sample,
    ],
  })),
  on(clearLoadedPatients, (state) =>
    patientAdapter.removeAll({
      ...state,
      samples: [],
    })
  )
);

export function patientReducer(state, action) {
  return reducer(state, action);
}
