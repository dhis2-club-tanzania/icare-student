import { RouterEffects } from "./router.effects";
import { CurrentUserEffects } from "./current-user.effects";
import { LocationsEffects } from "./locations.effects";
import { AuthEffects } from "./auth.effects";
import { VisitEffects } from "./visit.effects";
import { PatientEffects } from "./patient.effects";
import { DrugOrdersEffects } from "./drug-orders.effects";
import { ObservationEffects } from "./observation.effects";
import { FormEffects } from "./form.effects";
import { EncounterTypeEffects } from "./encounter-type.effects";
import { DiagnosisEffects } from "./diagnosis.effects";
import { LabOrdersEffects } from "./lab-orders.effects";
import { ConceptEffects } from "./concept-details.effects";
import { OrderTypesEffects } from "./order-types.effects";
import { PaymentTypeEffects } from "./payment-type.effects";
import { PaymentEffects } from "./payment.effects";
import { BillEffects } from "./bill.effects";
import { StockEffects } from "./stock.effects";
import { RequisitionEffects } from "./requisition.effects";
import { IssuingEffects } from "./issuing.effects";
import { LedgerTypeEffects } from "./ledger-type.effects";
import { PricingItemEffects } from "./pricing-item.effects";
import { StockMetricsEffects } from "./stock-metrics.effects";
import { LabOrdersBillingInfoEffects } from "./lab-orders-billing-info.effects";
import { patientNotesEffects } from "./patent-notes.effects";
import { PatientsEffects } from "./patients.effects";
import { SamplesEffects } from "./samples.effects";
import { SampleTypesEffects } from "./sample-types.effects";
import { VisitsEffects } from "./visits.effects";
import { DHIS2ReportsEffects } from "./dhis2-reports.effects";
import { LabSamplesEffects } from "./lab-samples.effects";
import { FormPrivilegesConfigsEffects } from "./form-privileges-configs.effects";
import { ConsultationEffects } from "./consultation.effects";
import { LISEffects } from "./lis-configurations.effects";
import { SystemSettingsEffect } from "./selected-system-settings.effects";

export const effects: any[] = [
  RouterEffects,
  LocationsEffects,
  AuthEffects,
  CurrentUserEffects,
  VisitEffects,
  PatientEffects,
  DrugOrdersEffects,
  ObservationEffects,
  FormEffects,
  EncounterTypeEffects,
  DiagnosisEffects,
  LabOrdersEffects,
  ConceptEffects,
  OrderTypesEffects,
  PaymentTypeEffects,
  BillEffects,
  PaymentEffects,
  StockEffects,
  RequisitionEffects,
  IssuingEffects,
  LedgerTypeEffects,
  PricingItemEffects,
  StockMetricsEffects,
  LabOrdersBillingInfoEffects,
  patientNotesEffects,
  PatientsEffects,
  SamplesEffects,
  SampleTypesEffects,
  VisitsEffects,
  DHIS2ReportsEffects,
  LabSamplesEffects,
  FormPrivilegesConfigsEffects,
  ConsultationEffects,
  LISEffects,
  SystemSettingsEffect,
];
