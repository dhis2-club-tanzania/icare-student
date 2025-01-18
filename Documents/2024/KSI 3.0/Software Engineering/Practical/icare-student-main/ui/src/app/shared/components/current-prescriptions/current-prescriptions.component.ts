import { Component, EventEmitter, OnInit, Output, Input } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/reducers";
import { flatten, keyBy } from "lodash";
import { EncountersService } from "../../services/encounters.service";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { map, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { SharedConfirmationComponent } from "../shared-confirmation/shared-confirmation.component";
import { MatDialog } from "@angular/material/dialog";
import { getGenericDrugPrescriptionsFromVisit } from "../../helpers/visits.helper";

@Component({
  selector: "app-current-prescriptions",
  templateUrl: "./current-prescriptions.component.html",
  styleUrls: ["./current-prescriptions.component.scss"],
})
export class CurrentPrescriptionComponent implements OnInit {
  @Input() visit: any;
  @Input() genericPrescriptionOrderType: any;
  @Input() fromClinic: boolean;

  @Output() loadVisit: EventEmitter<any> = new EventEmitter();

  drugsPrescribed: any;
  errors: any[] = [];
  specificDrugConceptUuid$: Observable<any>;
  prescriptionArrangementFields$: Observable<any>;

  constructor(
    private systemSettingsService: SystemSettingsService,
    private encounterService: EncountersService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getDrugsPrescribed();
    this.specificDrugConceptUuid$ = this.systemSettingsService
      .getSystemSettingsByKey(
        "iCare.clinic.genericPrescription.specificDrugConceptUuid"
      )
      .pipe(
        tap((response) => {
          if (response === "none") {
            this.errors = [
              ...this.errors,
              {
                error: {
                  message:
                    "Generic Use Specific drug Concept config is missing, Set 'iCare.clinic.genericPrescription.specificDrugConceptUuid' or Contact IT (Close to continue)",
                },
                type: "warning",
              },
            ];
          }
        })
      );
    this.prescriptionArrangementFields$ = this.systemSettingsService
      .getSystemSettingsByKey("iCare.clinic.prescription.arrangement")
      .pipe(
        map((response) => {
          if (response === "none") {
            this.errors = [
              ...this.errors,
              {
                error: {
                  message:
                    "Arrangement setting isn't defined, Set 'iCare.clinic.prescription.arrangement' or Contact IT (Close to continue)",
                },
                type: "warning",
              },
            ];
          }
          if (response?.error) {
            this.errors = [...this.errors, response?.error];
          }
          return {
            ...response,
            keys: Object.keys(response).length,
          };
        })
      );
  }

  getDrugsPrescribed() {
    this.drugsPrescribed = getGenericDrugPrescriptionsFromVisit(
      this.visit,
      this.genericPrescriptionOrderType
    );
  }

  stopDrugOrder(e: Event, drugOrder: any, drugName: string) {
    const confirmDialog = this.dialog.open(SharedConfirmationComponent, {
      width: "25%",
      data: {
        modalTitle: `Stop Medicaton`,
        modalMessage: `You are about to stop ${drugName} for this patient, Click confirm to finish!`,
        showRemarksInput: true,
      },
      disableClose: false,
      panelClass: "custom-dialog-container",
    });

    confirmDialog.afterClosed().subscribe((confirmationObject) => {
      if (confirmationObject?.confirmed) {
        this.encounterService
          .voidEncounterWithReason({
            ...drugOrder?.encounter,
            voidReason: confirmationObject?.remarks || "",
          })
          .subscribe((response) => {
            if (!response?.error) {
              this.loadVisit.emit(this.visit);
            }
            if (response?.error) {
              this.errors = [...this.errors, response?.error];
            }
          });
      }
    });
  }
}
