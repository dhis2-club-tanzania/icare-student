import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import * as _ from "lodash";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { TextArea } from "src/app/shared/modules/form/models/text-area.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";

@Component({
  selector: "app-rejection-reason",
  templateUrl: "./rejection-reason.component.html",
  styleUrls: ["./rejection-reason.component.scss"],
})
export class RejectionReasonComponent implements OnInit {
  codedSampleRejectionReasons: any[];
  rejectionFields: any[];
  rejectionReasons: any;
  rejectionRemarks: string;
  isFormValid: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<RejectionReasonComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.codedSampleRejectionReasons = data?.codedSampleRejectionReasons;
  }

  ngOnInit(): void {
    this.rejectionFields = [
      new Dropdown({
        id: "rejectionReason",
        key: "rejectionReason",
        label: "Reason for Rejection",
        searchTerm: "SAMPLE_REJECTION_REASONS",
        required: true,
        options: [],
        multiple: true,
        conceptClass: "Misc",
        searchControlType: "concept",
        shouldHaveLiveSearchForDropDownFields: true,
      }),
      new TextArea({
        id: "rejectionRemarks",
        key: "rejectionRemarks",
        label: "Remarks",
        required: false,
      }),
    ];
  }

  onFormUpdate(formValue: FormValue): void {
    const formData = formValue.getValues();
    this.rejectionReasons = formData?.rejectionReason?.value;
    this.rejectionRemarks = formData?.rejectionRemarks?.value;
    this.isFormValid = formValue.isValid;
  }

  saveReason(e) {
    e.stopPropagation();
    this.dialogRef.close({
      rejectionRemarks: this.rejectionRemarks,
      reasons: this.rejectionReasons,
    });
  }

  onCancel(e) {
    e.stopPropagation();
    this.dialogRef.close();
  }
}
