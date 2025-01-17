import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Dropdown } from "../../modules/form/models/dropdown.model";
import { FormValue } from "../../modules/form/models/form-value.model";
import { SampleAllocation } from "../../resources/sample-allocations/models/allocation.model";

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
  instrument: any = null;
  constructor() {}

  ngOnInit(): void {
    this.order?.allocations?.forEach((allocation) => {
      const formattedAllocation = new SampleAllocation(allocation).toJson();
      if (formattedAllocation?.instrument) {
        this.instrument = formattedAllocation?.instrument;
      }
    });
    this.instrumentFormField = new Dropdown({
      id: "instrument",
      key: "instrument",
      label: "Instrument/method used",
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
