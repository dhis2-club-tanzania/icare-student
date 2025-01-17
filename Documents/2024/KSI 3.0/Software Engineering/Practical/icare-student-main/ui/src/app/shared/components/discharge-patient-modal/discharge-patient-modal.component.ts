import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { go } from "src/app/store/actions";
import { updateVisit } from "src/app/store/actions/visit.actions";
import { AppState } from "src/app/store/reducers";
import { VisitsService } from "../../resources/visits/services";

@Component({
  selector: "app-discharge-patient-modal",
  templateUrl: "./discharge-patient-modal.component.html",
  styleUrls: ["./discharge-patient-modal.component.scss"],
})
export class DischargePatientModalComponent implements OnInit {
  visitDetails: any;
  dischargeObjects: any = {};
  savingData: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<DischargePatientModalComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private visitService: VisitsService,
    private store: Store<AppState>
  ) {
    this.visitDetails = data;
    console.log(data);
  }

  ngOnInit(): void {
    this.dischargeObjects = {
      visitDetails: {
        location: "6351fcf4-e311-4a19-90f9-35667d99a8af",
        uuid: this.visitDetails?.uuid,
      },
      encounterDetails: {
        patient: this.visitDetails?.patient["uuid"],
        location: this.visitDetails?.location?.uuid,
        visit: this.visitDetails?.uuid,
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
            this.store.dispatch(go({ path: ["/inpatient"] }));
          }, 200);
        }
      });
    this.dialogRef.close(true);
  }
}
