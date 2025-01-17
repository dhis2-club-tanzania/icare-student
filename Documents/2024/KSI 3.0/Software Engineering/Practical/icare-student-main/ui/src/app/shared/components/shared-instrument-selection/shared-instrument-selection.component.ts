import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Dropdown } from "../../modules/form/models/dropdown.model";
import { FormValue } from "../../modules/form/models/form-value.model";

@Component({
  selector: "app-shared-instrument-selection",
  templateUrl: "./shared-instrument-selection.component.html",
  styleUrls: ["./shared-instrument-selection.component.scss"],
})
export class SharedInstrumentSelectionComponent implements OnInit {
  @Input() conceptReferenceTerm: string;
  @Input() order: any;
  instrumentFormField: any;
  @Output() selectedInstrument: EventEmitter<any> = new EventEmitter<any>();
  instrument: any;
  constructor() {}

  ngOnInit(): void {
    this.instrument = this.order?.allocations[0]?.finalResult
      ? this.order?.allocations[0]?.finalResult?.groups?.length > 0 &&
        this.order?.allocations[0]?.finalResult?.groups[0]?.results?.length > 0
        ? this.order?.allocations[0]?.finalResult?.groups[0]?.results[0]
            ?.instrument
        : this.order?.allocations[0]?.finalResult?.instrument
      : null;
    this.instrumentFormField = new Dropdown({
      id: "instrument",
      key: "instrument",
      label: "Instrument used",
      value: this.instrument?.uuid,
      options: [],
      conceptClass: "LIS instrument",
      searchControlType: "concept",
      searchTerm: "LIS_INSTRUMENT",
      shouldHaveLiveSearchForDropDownFields: true,
    });
  }

  onFormUpdate(formValue: FormValue): void {
    this.selectedInstrument.emit(formValue.getValues()?.instrument?.value);
  }
}
