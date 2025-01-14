import { Component, Input, OnInit } from "@angular/core";
import { Observable, of } from "rxjs";
import { SamplesService } from "src/app/shared/services/samples.service";

@Component({
  selector: "app-shared-batch-samples-list-entry",
  templateUrl: "./shared-batch-samples-list-entry.component.html",
  styleUrls: ["./shared-batch-samples-list-entry.component.scss"],
})
export class SharedBatchSamplesListEntryComponent implements OnInit {
  @Input() category!: string;
  batchSampleDetails$: Observable<any>;
  batchSampleUuid: string;
  constructor(private sampleService: SamplesService) {}

  ngOnInit(): void {
    this.batchSampleUuid = localStorage.getItem("batchUuid");
    if (this.batchSampleUuid) {
      this.batchSampleDetails$ = !this.category
        ? this.sampleService.getBatchSamplesByUuid(this.batchSampleUuid)
        : this.sampleService.getBatchSamplesByUuid(this.batchSampleUuid);
    } else {
      this.batchSampleDetails$ = of({
        samples: [],
      });
    }
  }
}
