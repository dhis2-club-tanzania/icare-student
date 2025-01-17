import { createAction, props } from "@ngrx/store";
import { ErrorMessage } from "src/app/shared/modules/openmrs-http-client/models/error-message.model";
import { OrderCreate } from "src/app/shared/resources/openmrs";
import { LabOrder } from "src/app/shared/resources/visits/models/lab-order.model";

export const createLabOrder = createAction(
  "[Lab order] create lab order",
  props<{ order: OrderCreate }>()
);

export const createLabOrders = createAction(
  "[Lab order] create lab orders",
  props<{ orders: any[]; patientId: string }>()
);

export const upsertLabOrder = createAction(
  "[Lab order] upsert lab order",
  props<{ labOrder: any }>()
);

export const upsertLabOrders = createAction(
  "[Lab order] upsert lab orders",
  props<{ labOrders: any[] }>()
);

export const addLabOrders = createAction(
  "[Lab order] add lab orders",
  props<{ labOrders: LabOrder[] }>()
);

export const voidOrder = createAction(
  "[Lab order] void lab order",
  props<{ order: any }>()
);

export const removeLabOrder = createAction(
  "[Lab order] remove lab order",
  props<{ orderUuid: string }>()
);

export const clearLabOrders = createAction("[Lab order] clear lab orders");

export const clearFailedOrders = createAction(
  "[Lab order] clear failed orders"
);

export const creatingLabOrdersFail = createAction(
  "[Lab orders] creating lab orders fails",
  props<{ error: ErrorMessage; failedOrder: any }>()
);

export const addLabOrdersFail = createAction(
  "[Lab orders] adding lab orders fails",
  props<{ error: ErrorMessage }>()
);

export const loadLabOrders = createAction(
  "[Laboratory orders] load lab orders",
  props<{ visitStartDate: Date; endDate: Date; configs: any }>()
);

export const loadLabOrdersMetaDataDependencies = createAction(
  "[Orders] load lab orders metadata dependencies",
  props<{ configs: any }>()
);

export const addLoadedLabOrdersInformation = createAction(
  "[Laboratory orders] add loaded lab orders",
  props<{ labOrders: any }>()
);

export const addCollectedLabOrders = createAction(
  "[Laboratory orders] add collected lab orders",
  props<{ collectedLabOrders: any }>()
);

export const addSampleRejectionCodesReasons = createAction(
  "[Sample] add sample rejection coded reasons",
  props<{ codedSampleRejectionReasons: any }>()
);

export const addLabDepartments = createAction(
  "[Samples] add lab departments",
  props<{ labDepartments: any }>()
);

export const loadingLabOrderInformationFails = createAction(
  "[Laboratory orders] loading lab order information fails",
  props<{ error: any }>()
);

export const reloadPatientsLabOrders = createAction(
  "[Orders] reload lab orders",
  props<{ visitStartDate: Date; endDate: Date; configs: any }>()
);

export const addSampleContainers = createAction(
  "[Samples] add sample containers",
  props<{ sampleContainers: any }>()
);

export const addTestContainers = createAction(
  "[Samples] add test containers",
  props<{ testContainers: any }>()
);

export const clearLoadedLabOrders = createAction(
  "[Orders] clear loaded Lab orders"
);

export const deleteLabOrder = createAction(
  "[Lab Orders] delete lab order",
  props<{ uuid: string }>()
);

export const voidLabOrder = createAction(
  "[Lab Orders] void lab order",
  props<{ uuid: string }>()
);
