import { DispensingFormComponent } from "./dispension-form/dispension-form.component";
import { GeneralDispensingFormComponent } from "./general-dispension-form/general-dispension-form.component";
import { PatientHistoryDialogComponent } from "./patient-history-dialog/patient-history-dialog.component";
import { ManageSystemSettingComponent } from "./manage-system-setting/manage-system-setting.component";
import { ManageUserProfileModalComponent } from "./manage-user-profile-modal/manage-user-profile-modal.component";
import { PatientListDialogComponent } from "./patient-list-dialog/patient-list-dialog.component";
import { SharedSamplesVerificationIntegratedComponent } from "./shared-samples-verification-integrated/shared-samples-verification-integrated.component";
import { ShortMessageConstructionComponent } from "./short-message-construction/short-message-construction.component";
import { VisitConsultationStatusModalComponent } from "./visit-consultation-status-modal/visit-consultation-status-modal.component";
import { SharedPdfPreviewComponent } from "./shared-pdf-preview/shared-pdf-preview.component";
import { ManageReportsModalComponent } from "./manage-reports-modal/manage-reports-modal.component";

export const sharedDialogs: any[] = [
  PatientListDialogComponent,
  DispensingFormComponent,
  ShortMessageConstructionComponent,
  GeneralDispensingFormComponent,
  VisitConsultationStatusModalComponent,
  ManageSystemSettingComponent,
  ManageUserProfileModalComponent,
  SharedSamplesVerificationIntegratedComponent,
  PatientHistoryDialogComponent,
  SharedPdfPreviewComponent,
  ManageReportsModalComponent,
];
export {
  PatientListDialogComponent,
  DispensingFormComponent,
  ShortMessageConstructionComponent,
};
