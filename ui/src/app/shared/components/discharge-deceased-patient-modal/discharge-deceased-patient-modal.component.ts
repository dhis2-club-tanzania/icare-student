import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { go } from "src/app/store/actions";
import { updateVisit } from "src/app/store/actions/visit.actions";
import { AppState } from "src/app/store/reducers";
import { VisitsService } from "../../resources/visits/services";
import { Observable } from "rxjs";
import { getParentLocation } from "src/app/store/selectors";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { ObservationService } from "../../resources/observation/services";


@Component({
  selector: "app-discharge-deceased-patient-modal",
  templateUrl: "./discharge-deceased-patient-modal.component.html",
  styleUrls: ["./discharge-deceased-patient-modal.component.scss"],
})
export class DischargeDeceasedPatientModalComponent implements OnInit {
  visitDetails: any;
  dischargeObjects: any = {};
  savingData: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<DischargeDeceasedPatientModalComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private visitService: VisitsService,
    private store: Store<AppState>,
    private systemSettingsService: SystemSettingsService,
    private observationService: ObservationService
  ) {
    this.visitDetails = data;
  }

  ngOnInit(): void {
    this.dischargeObjects = {
      visitDetails: {
        location: "6351fcf4-e311-4a19-90f9-35667d99a8af",
        uuid: this.visitDetails?.visit?.uuid,
      },
      encounterDetails: {
        patient: this.visitDetails?.patient?.patient["uuid"],
        location: this.visitDetails?.visit?.location?.uuid,
        visit: this.visitDetails?.visit?.uuid,
        provider: this.visitDetails?.provider?.uuid,
        encounterType: "181820aa-88c9-479b-9077-af92f5364329",
      },
    };
  }




  onConfirm(event: Event, dischargeObjects) {
    event.stopPropagation();
    this.savingData = true;
    this.visitService
      .dischargePatient(dischargeObjects?.encounterDetails)
      .subscribe((response) => {
        if (response) {
          this.savingData = false;
          this.store.dispatch(
            updateVisit({
              details: dischargeObjects?.visitDetails,
              visitUuid: dischargeObjects.visitDetails?.uuid,
            })
          );
          setTimeout(() => {
            this.store.dispatch(go({ path: ["/mortuary"] }));
          }, 200);
        }
      });
    this.dialogRef.close(true);
  }

  
}
