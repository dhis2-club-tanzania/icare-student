import { OtherPatientDetailsComponent } from "./other-patient-details/other-patient-details.component";
import { StartVisitModelComponent } from "./start-visit-model/start-visit-model.component";
import { UpdateDoctorsRoomComponent } from "./update-doctors-room/update-doctors-room.component";
import { VisitClaimComponent } from "./visit-claim/visit-claim.component";
import { VisitStatusConfirmationModelComponent } from "./visit-status-confirmation-model/visit-status-confirmation-model.component";
import { VisitsHistoryForPatientComponent } from "./visits-history-for-patient/visits-history-for-patient.component";
import { DynamicRegFormComponent } from "./dynamic-reg-form/dynamic-reg-form.component";
import { RegistrationSummaryCardsComponent } from "./registration-summary-cards/registration-summary-cards/registration-summary-cards.component";

export const regComponents: any[] = [
  StartVisitModelComponent,
  VisitStatusConfirmationModelComponent,
  VisitClaimComponent,
  VisitsHistoryForPatientComponent,
  OtherPatientDetailsComponent,
  UpdateDoctorsRoomComponent,
  DynamicRegFormComponent,
  RegistrationSummaryCardsComponent,
];
export const entryRegComponents: any[] = [
  StartVisitModelComponent,
  VisitStatusConfirmationModelComponent,
  VisitClaimComponent,
];
