import { Component, Inject, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { SamplesService } from "src/app/shared/services/samples.service";
import { BarCodeModalComponent } from "../../../../../../shared/dialogs/bar-code-modal/bar-code-modal.component";

@Component({
  selector: "app-sample-registration-finalization",
  templateUrl: "./sample-registration-finalization.component.html",
  styleUrls: ["./sample-registration-finalization.component.scss"],
})
export class SampleRegistrationFinalizationComponent implements OnInit {
  dialogData: any;
  rejectionReasonField: any;
  rejectionReasons: any;
  isFormValid: boolean = false;
  saving: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<SampleRegistrationFinalizationComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data: any,
    private samplesService: SamplesService
  ) {
    this.dialogData = data;
  }

  ngOnInit(): void {
    this.rejectionReasonField = new Dropdown({
      id: "rejectionReasons",
      key: "rejectionReasons",
      label: "Reasons for Rejection",
      searchTerm: "SAMPLE_REJECTION_REASONS",
      required: true,
      multiple: true,
      options: [],
      conceptClass: "Misc",
      searchControlType: "concept",
      shouldHaveLiveSearchForDropDownFields: true,
    });
  }

  onFinalize(event: Event, actionType: string): void {
    event.stopPropagation();
    if (actionType == "reject") {
      const rejectionReasons = this.rejectionReasons?.map((reason) => {
        return {
          sample: {
            uuid: this.dialogData?.sample?.uuid,
          },
          user: {
            uuid: localStorage.getItem("userUuid"),
          },
          remarks: "None",
          category: "REJECTED_REGISTRATION",
          status: reason?.uuid,
        };
      });
      // const rejectionStatus = {
      //   sample: {
      //     uuid: this.dialogData?.sample?.uuid,
      //   },
      //   user: {
      //     uuid: localStorage.getItem("userUuid"),
      //   },
      //   remarks: this.rejectionReasons,
      //   status: "REJECTED",
      // };
      this.samplesService
        .setMultipleSampleStatuses(rejectionReasons)
        .subscribe((response) => {
          if (response) {
            this.dialogRef.close();
          }
        });
    } else {
      this.dialogRef.close();
    }
  }

  onFormUpdate(formValue: FormValue): void {
    // this.rejectionReason = formValue.getValues()["rejectionReason"]?.value;
    this.rejectionReasons = formValue.getValues()?.rejectionReasons?.value;
    this.isFormValid = formValue.isValid;
  }
}
