import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICARE_CONFIG } from '../../resources/config';
import { VisitsService } from '../../resources/visits/services';

@Component({
  selector: 'app-create-patient-bed-order-modal',
  templateUrl: './create-patient-bed-order-modal.component.html',
  styleUrls: ['./create-patient-bed-order-modal.component.scss'],
})
export class CreatePatientBedOrderModalComponent implements OnInit {
  visitDetails: any;
  encounterData: any;
  savingData: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<CreatePatientBedOrderModalComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private visitService: VisitsService
  ) {
    this.visitDetails = data;
  }

  ngOnInit(): void {
    console.log('lastBedOrder', this.visitDetails?.lastBedOrder);
    this.encounterData = {
      patient: this.visitDetails.patient['uuid'],
      location: this.visitDetails?.location?.uuid,
      visit: this.visitDetails?.uuid,
      orders: [
        {
          concept: this.visitDetails?.lastBedOrder?.concept?.uuid,
          orderType: this.visitDetails?.lastBedOrder?.orderType?.uuid,
          patient: this.visitDetails.patient['uuid'],
          careSetting: 'INPATIENT',
          type: 'order',
          orderer: this.visitDetails?.provider?.uuid,
          autoExpireDate: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
        },
      ],
      provider: this.visitDetails?.provider?.uuid,
      encounterType: ICARE_CONFIG.admission.encounterTypeUuid,
    };
  }

  onConfirm(event: Event, data) {
    event.stopPropagation();
    this.savingData = true;
    this.visitService.createBedOrder(data).subscribe((response) => {
      if (response) {
        this.savingData = false;
        setTimeout(() => {
          this.dialogRef.close();
        }, 200);
      }
    });
  }
}
