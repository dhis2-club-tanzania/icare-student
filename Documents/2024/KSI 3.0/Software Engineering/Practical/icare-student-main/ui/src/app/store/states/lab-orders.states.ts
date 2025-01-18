import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { LabOrder } from "src/app/shared/resources/visits/models/lab-order.model";
import { BaseState, initialBaseState } from "./base.state";

export interface LabOrdersState extends EntityState<any>, BaseState {
  creatingLabOrder: boolean;
  creatingLabOrderSuccess: boolean;
  creatingLabOrderFails: boolean;
  creatingLabOrderError: any;
  collectedLabOrders: any;
  sampleIdentifierDetails: any;
  acceptedLabOrders: any;
  rejectedLabOrders: any;
  failedOrders: LabOrder[];
  labOrdersWithIntermediateResults: any;
  labOrdersWithFirstSignOff: any;
  labOrdersWithSecondSignOff: any;
  voidingOrder: boolean;
  voidedOrder: boolean;
  testContainers: any;
  sampleContainers: any;
  codedSampleRejectionReasons: any[];
  labDepartments: any[];
}

export const labOrderAdapter: EntityAdapter<any> = createEntityAdapter<any>();

export const initialLabOrdersState = labOrderAdapter.getInitialState({
  ...initialBaseState,
  creatingLabOrder: false,
  creatingLabOrderSuccess: false,
  creatingLabOrderFails: false,
  creatingLabOrderError: {},
  collectedLabOrders: {},
  sampleIdentifierDetails: {},
  acceptedLabOrders: {},
  rejectedLabOrders: {},
  failedOrders: [],
  labOrdersWithIntermediateResults: {},
  labOrdersWithFirstSignOff: {},
  labOrdersWithSecondSignOff: {},
  voidingOrder: false,
  voidedOrder: false,
  sampleContainers: null,
  testContainers: null,
  codedSampleRejectionReasons: null,
  labDepartments: null,
});
