import { createAction, props } from "@ngrx/store";
import { SampleObject, SampleIdentifier } from "../../resources/models";
import { ErrorMessage } from "src/app/shared/modules/openmrs-http-client/models/error-message.model";
import { LabOrder } from "src/app/shared/resources/visits/models/lab-order.model";
import { Patient } from "src/app/shared/resources/patient/models/patient.model";

export const createSample = createAction(
  "[Sample] create sample",
  props<{ sample: SampleObject }>()
);

export const creatingSampleFails = createAction(
  "[Sample] creating samples fails",
  props<{ error: ErrorMessage }>()
);

export const requestSampleIdentifier = createAction(
  "[Sample] request sample id",
  props<{ specimenType: any }>()
);

export const upsertSampleIdentifierDetails = createAction(
  "[Sample] add sample identifier",
  props<{ sampleIdentifier: SampleIdentifier }>()
);

export const upsertSample = createAction(
  "[Sample] add sample",
  props<{ sample: SampleObject }>()
);

export const updateSampleOnStore = createAction(
  "[Sample] update sample",
  props<{ sample: any }>()
);

export const upsertSamples = createAction(
  "[Sample] add samples",
  props<{ samples: SampleObject[] }>()
);

export const loadAllLabSamples = createAction("[Sample] load all lab samples");

export const loadSamplesByVisit = createAction(
  "[Sample] load samples by visit",
  props<{
    visitUuid: string;
    orderedLabOrders: LabOrder[];
    specimenSources: any[];
    containers: any[];
    labDepartments: any[];
    patient: Patient;
    paidItems: any;
    isAdmitted: boolean;
    visit: any;
  }>()
);

export const upsertSamplesToCollect = createAction(
  "[Sample] upsert samples to collect",
  props<{ samplesToCollect: SampleObject[] }>()
);

export const setSampleStatus = createAction(
  "[Sample] set sample status",
  props<{ sample: SampleObject; sampleStatusDetails: any }>()
);

export const allocateTechnicianToLabTest = createAction(
  "[Sample] allocated technician to a test",
  props<{ sample: SampleObject; orderWithAssignedPerson: any }>()
);

export const setContainerForLabTest = createAction(
  "[Sample] set container for the lab test",
  props<{ sample: SampleObject; testToContainerDetails: any }>()
);

export const addLabTestResults = createAction(
  "[Sample] add results",
  props<{ sample: SampleObject; labResultsDetails: any }>()
);

export const signOffLabTestResult = createAction(
  "[Sample] sign off a lab result",
  props<{ sample: SampleObject; signOffDetails: any; allocationUuid: string }>()
);

export const clearSamples = createAction("[Sample] clear samples");

export const clearSamplesToCollect = createAction(
  "[Sample] clear samples to collect"
);

export const markSampleCollected = createAction(
  "[Samples] mark sample as collected",
  props<{ sample: any }>()
);

export const removeCollectedSampleFromSamplesToCollect = createAction(
  "[Samples] remove collected sample from samples to collect",
  props<{ referenceId: string }>()
);
