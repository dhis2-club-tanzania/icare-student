import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { OpenmrsHttpClientService } from "../../modules/openmrs-http-client/services/openmrs-http-client.service";

@Component({
  selector: "app-confirm-saving-order-observation-modal",
  templateUrl: "./confirm-saving-order-observation-modal.component.html",
  styleUrls: ["./confirm-saving-order-observation-modal.component.scss"],
})
export class ConfirmSavingOrderObservationModalComponent implements OnInit {
  dialogData: any;
  matchedEncounter: any;
  savingData: boolean = false;
  constructor(
    private httpClient: OpenmrsHttpClientService,
    private dialogRef: MatDialogRef<ConfirmSavingOrderObservationModalComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.dialogData = data;
  }

  ngOnInit(): void {
    this.matchedEncounter = (this.dialogData?.encounters.filter(
      (encounter) =>
        encounter?.orders?.length > 0 &&
        (
          encounter.orders.filter(
            (order) => order?.orderNumber === this.dialogData?.orderNumber
          ) || []
        )?.length > 0
    ) || [])[0];
  }

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogData.close();
  }

  onConfirm(event: Event, data: any): void {
    event.stopPropagation();
    this.savingData = true;
    const encounterData = {
      uuid: this.matchedEncounter?.uuid,
      obs: [
        {
          person: data?.patient?.patient?.person?.uuid,
          concept: data?.concept?.uuid,
          obsDatetime: new Date(),
          value: data?.value,
          comment: data?.comments,
          order: data?.uuid,
        },
      ],
    };

    this.httpClient
      .post(`encounter/${encounterData?.uuid}`, encounterData)
      .subscribe((response) => {
        this.savingData = false;
        if (response) {
          setTimeout(() => {
            setTimeout(() => {
              this.dialogRef.close(true);
            }, 500);
          }, 200);
        }
      });
  }
}
