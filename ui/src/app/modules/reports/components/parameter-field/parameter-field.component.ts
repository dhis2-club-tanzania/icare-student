import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ICARE_CONFIG } from "src/app/shared/resources/config";
import { ReportParam } from "../../models/report-params.model";

@Component({
  selector: "app-parameter-field",
  templateUrl: "./parameter-field.component.html",
  styleUrls: ["./parameter-field.component.scss"],
})
export class ParameterFieldComponent implements OnInit {
  @Input() field: any;
  @Input() parameter: {
    order?: string;
    id: string;
    type: string;
    name: string;
    label: string;
    options?: any[];
    periodType?: any;
  };
  @Input() type: string;

  fieldId: string;
  fieldValue: any;
  selectedDateTime: any;

  @Output() parameterUpdate = new EventEmitter();
  periodTypes: any[] = ICARE_CONFIG.periodTypes;
  constructor() {}

  ngOnInit() {
    this.fieldId = !this.field?.periodType
      ? this.field?.id
      : this.field?.periodType?.id;
  }

  onParamChange(e, paramId, selectedDateTime?) {
    let value;
    if (paramId.toLowerCase() == "startdate") {
      value = `${e?.value?.getFullYear()}-${
        e?.value?.getMonth() + 1
      }-${e?.value?.getDate()}T${
        selectedDateTime ? new Date(selectedDateTime).getHours() : "00"
      }:${
        selectedDateTime ? new Date(selectedDateTime).getMinutes() : "00"
      }:00`;
    }

    if (paramId.toLowerCase() == "enddate") {
      value = `${e?.value?.getFullYear()}-${
        e?.value?.getMonth() + 1
      }-${e?.value?.getDate()}T${
        selectedDateTime ? new Date(selectedDateTime).getHours() : "23"
      }:${
        selectedDateTime ? new Date(selectedDateTime).getMinutes() : "59"
      }:59`;
    }
    this.parameterUpdate.emit({
      // [paramId]: getSanitizedParamValue(e.value || e.checked, this.field?.type),
      [paramId]:
        value || e?.target?.value || e?.value || e?.checked || this.fieldValue,
    });
  }

  onGetSelectedPeriods(periods: any[]): void {
    this.parameterUpdate.emit(periods);
  }
}
