import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { SamplesService } from "src/app/modules/laboratory/resources/services/samples.service";

@Component({
  selector: "app-shared-dashboard-chart-container",
  templateUrl: "./shared-dashboard-chart-container.component.html",
  styleUrls: ["./shared-dashboard-chart-container.component.scss"],
})
export class SharedDashboardChartContainerComponent implements OnInit {
  @Input() datesParams: any;
  samples$: Observable<any>;
  constructor(private sampleService: SamplesService) {}

  ngOnInit(): void {
    this.samples$ = this.sampleService.getAggregatedSamplesByDifferentStatuses(
      ["ACCEPTED", "REJECTED", "COMPLETED"],
      this.datesParams?.startDate,
      this.datesParams?.endDate
    );
  }
}
