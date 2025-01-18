import { Component, OnInit } from "@angular/core";
import { Observable, of } from "rxjs";
import { SamplesService } from "src/app/shared/services/samples.service";

@Component({
  selector: "app-batch-samples-list",
  templateUrl: "./batch-samples-list.component.html",
  styleUrls: ["./batch-samples-list.component.scss"],
})
export class BatchSamplesListComponent implements OnInit {
  batchSampleDetails$: Observable<any>;
  batchSampleUuid: string;
  constructor(private sampleService: SamplesService) {}

  ngOnInit(): void {
    this.batchSampleUuid = localStorage.getItem("batchSample");
    if (this.batchSampleUuid) {
      this.batchSampleDetails$ = this.sampleService.getBatchSamplesByUuid(
        this.batchSampleUuid
      );
    } else {
      this.batchSampleDetails$ = of([]);
    }
  }
}
