import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { LISConfigurationsModel } from "src/app/modules/laboratory/resources/models/lis-configurations.model";

@Component({
  selector: "app-sample-disposal",
  templateUrl: "./sample-disposal.component.html",
  styleUrls: ["./sample-disposal.component.scss"],
})
export class SampleDisposalComponent implements OnInit {
  @Input() allSamples: any[];
  @Input() externalSystemsReferenceConceptUuid: any;
  @Input() LISConfigurations: LISConfigurationsModel;

  @Output() sampleSearch: EventEmitter<any> = new EventEmitter();
  @Output() dispose: EventEmitter<any> = new EventEmitter();

  searchingText: string = "";
  samplesToViewMoreDetails: any = {};
  message: any = {};

  constructor() {}

  ngOnInit(): void {}

  onSearch(e) {
    e.stopPropagation();
    this.sampleSearch.emit(this.searchingText);
  }

  onToggleViewSampleDetails(event: Event, sample: any): void {
    event.stopPropagation();
    this.samplesToViewMoreDetails[sample?.id] = !this.samplesToViewMoreDetails[
      sample?.id
    ]
      ? sample
      : null;
  }

  onDispose(e: Event, sample: any): void {
    e.stopPropagation();
    this.dispose.emit(sample);
  }
}
