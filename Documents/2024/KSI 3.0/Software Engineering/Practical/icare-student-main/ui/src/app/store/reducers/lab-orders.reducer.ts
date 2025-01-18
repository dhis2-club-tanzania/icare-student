import { createReducer, on } from "@ngrx/store";
import { initialLabOrdersState, labOrderAdapter } from "../states";
import {
  createLabOrder,
  upsertLabOrder,
  clearLabOrders,
  addLabOrders,
  removeLabOrder,
  creatingLabOrdersFail,
  voidOrder,
  clearFailedOrders,
  addLoadedLabOrdersInformation,
  addCollectedLabOrders,
  addSampleRejectionCodesReasons,
  addLabDepartments,
  createLabOrders,
  addSampleContainers,
  addTestContainers,
  clearLoadedLabOrders,
  deleteLabOrder,
  voidLabOrder,
  upsertLabOrders,
} from "../actions";

const reducer = createReducer(
  initialLabOrdersState,
  on(addLabOrders, (state, { labOrders }) =>
    labOrderAdapter.addMany(labOrders, { ...state })
  ),
  on(addLoadedLabOrdersInformation, (state, { labOrders }) => {
    return labOrderAdapter.addMany(labOrders, {
      ...state,
    });
  }),
  on(addTestContainers, (state, { testContainers }) => ({
    ...state,
    testContainers,
  })),
  on(addSampleContainers, (state, { sampleContainers }) => ({
    ...state,
    sampleContainers,
  })),
  on(addLabDepartments, (state, { labDepartments }) => ({
    ...state,
    labDepartments,
  })),
  on(
    addSampleRejectionCodesReasons,
    (state, { codedSampleRejectionReasons }) => ({
      ...state,
      codedSampleRejectionReasons,
    })
  ),
  on(addCollectedLabOrders, (state, { collectedLabOrders }) => ({
    ...state,
    collectedLabOrders,
  })),
  on(createLabOrder, (state) => ({
    ...state,
    creatingLabOrder: true,
    creatingLabOrderSuccess: false,
    creatingLabOrderFails: false,
  })),
  on(createLabOrders, (state) => ({
    ...state,
    creatingLabOrder: true,
    creatingLabOrderSuccess: false,
    creatingLabOrderFails: false,
  })),
  on(upsertLabOrder, (state, { labOrder }) =>
    labOrderAdapter.upsertOne(labOrder, {
      ...state,
      creatingLabOrderSuccess: true,
      creatingLabOrder: false,
      creatingLabOrderFails: false,
    })
  ),
  on(upsertLabOrders, (state, { labOrders }) =>
    labOrderAdapter.upsertMany(labOrders, {
      ...state,
      creatingLabOrderSuccess: true,
      creatingLabOrder: false,
      creatingLabOrderFails: false,
    })
  ),
  on(clearLoadedLabOrders, (state) =>
    labOrderAdapter.removeAll({
      ...state,
      testContainers: null,
      collectedLabOrders: null,
      sampleContainers: null,
      codedSampleRejectionReasons: null,
      visitsDetails: null,
      labDepartments: [],
    })
  ),
  on(creatingLabOrdersFail, (state, { error, failedOrder }) => {
    return {
      ...state,
      creatingLabOrderFails: true,
      creatingLabOrder: false,
      creatingLabOrderError: error,
      creatingLabOrderSuccess: false,
      failedOrders: [...state.failedOrders, ...failedOrder],
    };
  }),
  on(voidOrder, (state) => ({
    ...state,
    voidingOrder: true,
  })),
  on(removeLabOrder, (state, { orderUuid }) =>
    labOrderAdapter.removeOne(orderUuid, { ...state, voidingOrder: false })
  ),
  on(clearFailedOrders, (state) => ({
    ...state,
    failedOrders: [],
  })),
  on(clearLabOrders, (state) => labOrderAdapter.removeAll({ ...state })),
  on(deleteLabOrder, (state) => ({
    ...state,
    voidingOrder: true,
    voidedOrder: false,
  })),
  on(voidLabOrder, (state, { uuid }) => {
    const matchedOrder = { ...state.entities[uuid], voided: true };
    return labOrderAdapter.upsertOne(matchedOrder, {
      ...state,
      voidingOrder: false,
      voidedOrder: true,
    });
  })
);

export function labOrderReducer(state, action) {
  return reducer(state, action);
}
