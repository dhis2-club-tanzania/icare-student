import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { TextArea } from "src/app/shared/modules/form/models/text-area.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";

@Component({
  selector: "app-shared-remarks-entry",
  templateUrl: "./shared-remarks-entry.component.html",
  styleUrls: ["./shared-remarks-entry.component.scss"],
})
export class SharedRemarksEntryComponent implements OnInit {
  @Input() order: any;
  @Input() disabled: boolean;
  remarksField: any;
  @Output() remarks: EventEmitter<string> = new EventEmitter<string>();
  result: any;
  savedRemarksData: any;
  allocation: any;
  constructor() {}

  ngOnInit(): void {
    this.allocation =
      this.order?.allocations?.length > 0 ? this.order?.allocations[0] : null;
    this.result =
      this.allocation && this.allocation?.finalResult
        ? this.order?.allocations[0]?.finalResult?.groups?.length > 0 &&
          this.order?.allocations[0]?.finalResult?.groups[0]?.results?.length >
            0
          ? this.order?.allocations[0]?.finalResult?.groups[0]?.results[0]
          : this.order?.allocations[0]?.finalResult
        : null;
    this.savedRemarksData =
      this.result && this.allocation && this.allocation?.statuses?.length > 0
        ? (this.allocation?.statuses?.filter(
            (status) => status?.result?.uuid === this.result?.uuid
          ) || [])[0]
        : null;
    this.remarksField = new TextArea({
      id: "remarks",
      key: "remarks",
      label: "Remarks",
      required: false,
      value: this.savedRemarksData ? this.savedRemarksData?.remarks : "",
      rows: 1,
      disabled: this.disabled,
    });
  }

  onFormUpdate(formValue: FormValue): void {
    this.remarks.emit(formValue.getValues()?.remarks?.value);
  }
}
