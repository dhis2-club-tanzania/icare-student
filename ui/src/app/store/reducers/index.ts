import { routerReducer, RouterReducerState } from "@ngrx/router-store";
import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { storeFreeze } from "ngrx-store-freeze";
import { environment } from "../../../environments/environment";
import {
  CurrentUserState,
  DiagnosisState,
  DrugOrdersState,
  LabOrdersState,
  ConceptState,
  OrderTypesState,
  LocationsState,
  StockState,
  RadiologyOrdersState,
  SampleTypesState,
  SetMembersState,
  LabOrdersBillingInfoState,
  PatientState,
  PatientNotesState,
  LabSamplesState,
  NewLabSamplesState,
  VisitsState,
  DHIS2ReportsState,
  SelectedSystemSettingsState,
  DataValueState,
} from "../states";
import { BillItemState } from "../states/bill-item.state";
import { BillState, PendingBillState } from "../states/bill.state";
import { CurrentPatientState } from "../states/current-patient.state";
import { EncounterTypeState } from "../states/encounter-type.state";
import { FormState } from "../states/form.state";
import { ObservationState } from "../states/observation.state";
import { PaymentState } from "../states/payment.state";
import { VisitState } from "../states/visit.state";
import { billItemReducer } from "./bill-item.reducer";
import { billReducer } from "./bill.reducer";
import { currentPatientReducer } from "./current-patient.reducer";
import { currentUserReducer } from "./current-user.reducers";
import { diagnosisReducer } from "./diagnosis.reducer";
import { drugOrdersReducer } from "./drug-orders.reducer";
import { encounterTypeReducer } from "./encounter-type.reducer";
import { formReducer } from "./form.reducer";
import { labOrderReducer } from "./lab-orders.reducer";
import { conceptReducer } from "./concept-details.reducer";
import { orderTypesReducers } from "./order-types.reducer";
import { PaymentTypeState } from "../states/payment-type.state";
import { locationsReducer } from "./locations.reducer";
import { observationReducer } from "./observation.reducer";
import { paymentTypeReducer } from "./payment-type.reducer";
import { paymentReducer } from "./payment.reducer";
import { pendingBillReducer } from "./pending-bill.reducer";
import { visitReducer } from "./visit.reducer";
import { stockReducer } from "./stock.reducer";
import { RequisitionState } from "../states/requisition.state";
import { requisitionReducer } from "./requisition.reducer";
import { IssuingState } from "../states/issuing.state";
import { issuingReducer } from "./issuing.reducer";
import { LedgerTypeState } from "../states/ledger-type.state";
import { ledgerTypeReducer } from "./ledger-type.reducer";
import { pricingItemReducer } from "./pricing-item.reducer";
import { itemPriceReducer } from "./item-price.reducer";
import { PricingItemState } from "../states/pricing-item.state";
import { ItemPriceState } from "../states/item-price.state";
import { StockMetricsState } from "../states/stock-metrics.state";
import { currentStockMetricsReducer } from "./stock-metrics.reducer";
import { radiologyOrdersReducer } from "./radiology-orders.reducer";
import { sampleTypesReducer } from "./sample-types.reducer";
import { setMembersReducer } from "./test-by-sample-type.reducer";
import { labOrdersBillingInfoReducer } from "./lab-orders-billing-info.reducer";
import { visitsReducer } from "./visits.reducer";
import { patientReducer } from "./patient.reducer";
import { patientNotesReducer } from "./patient-notes.reducer";
import { newLabSamplesReducer } from "./lab-samples.reducer";
import { DHIS2ReportsReducer } from "./dhis2-reports.reducer";
import { FormPrivilegesConfigsState } from "../states/form-privileges-configs.state";
import { formPrivilegesReducer } from "./form-privileges-configs.reducer";
import { consultationReducer } from "./consultation.reducer";
import { ConsultationState } from "../states/consultation.state";
import { LISConfigsReducer } from "./lis-configurations.reducer";
import { LISConfigsState } from "../states/lis-configurations.states";
import { systemSettingsReducer } from "./selected-system-settings.reducer";
import { dataValuesReducer } from "./datavalues.reducer";

export interface AppState {
  router: RouterReducerState;
  currentUser: CurrentUserState;
  locations: LocationsState;
  currentPatient: CurrentPatientState;
  drugOrders: DrugOrdersState;
  visit: VisitState;
  visits: VisitsState;
  observation: ObservationState;
  diagnosis: DiagnosisState;
  form: FormState;
  encounterType: EncounterTypeState;
  labOrders: LabOrdersState;
  concept: ConceptState;
  orderTypes: OrderTypesState;
  paymentType: PaymentTypeState;
  bill: BillState;
  billItem: BillItemState;
  pendingBill: PendingBillState;
  payment: PaymentState;
  stock: StockState;
  requisition: RequisitionState;
  issuing: IssuingState;
  ledgerType: LedgerTypeState;
  pricingItem: PricingItemState;
  itemPrice: ItemPriceState;
  stockMetrics: StockMetricsState;
  radiologyOrders: RadiologyOrdersState;
  sampleTypes: SampleTypesState;
  setMembers: SetMembersState;
  labOrdersBillingInfo: LabOrdersBillingInfoState;
  visitsDetails: VisitsState;
  patient: PatientState;
  patientNotes: PatientNotesState;
  labSamples: LabSamplesState;
  samples: NewLabSamplesState;
  DHIS2Reports: DHIS2ReportsState;
  formPrivileges: FormPrivilegesConfigsState;
  consultation: ConsultationState;
  lisConfigs: LISConfigsState;
  systemSettings: SelectedSystemSettingsState;
  dataValues: DataValueState;
}

export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer,
  currentUser: currentUserReducer,
  locations: locationsReducer,
  currentPatient: currentPatientReducer,
  drugOrders: drugOrdersReducer,
  visit: visitReducer,
  visits: visitsReducer,
  observation: observationReducer,
  diagnosis: diagnosisReducer,
  form: formReducer,
  encounterType: encounterTypeReducer,
  labOrders: labOrderReducer,
  concept: conceptReducer,
  orderTypes: orderTypesReducers,
  paymentType: paymentTypeReducer,
  bill: billReducer,
  billItem: billItemReducer,
  pendingBill: pendingBillReducer,
  payment: paymentReducer,
  stock: stockReducer,
  requisition: requisitionReducer,
  issuing: issuingReducer,
  ledgerType: ledgerTypeReducer,
  pricingItem: pricingItemReducer,
  itemPrice: itemPriceReducer,
  stockMetrics: currentStockMetricsReducer,
  radiologyOrders: radiologyOrdersReducer,
  sampleTypes: sampleTypesReducer,
  setMembers: setMembersReducer,
  labOrdersBillingInfo: labOrdersBillingInfoReducer,
  visitsDetails: visitsReducer,
  patient: patientReducer,
  patientNotes: patientNotesReducer,
  labSamples: newLabSamplesReducer,
  samples: newLabSamplesReducer,
  DHIS2Reports: DHIS2ReportsReducer,
  formPrivileges: formPrivilegesReducer,
  consultation: consultationReducer,
  lisConfigs: LISConfigsReducer,
  systemSettings: systemSettingsReducer,
  dataValues: dataValuesReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? [storeFreeze]
  : [];

/**
 * Root state selector
 */
export const getRootState = (state: AppState) => state;
