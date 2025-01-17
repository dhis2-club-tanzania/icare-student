import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-shared-samples-summary-dashboard",
  templateUrl: "./shared-samples-summary-dashboard.component.html",
  styleUrls: ["./shared-samples-summary-dashboard.component.scss"],
})
export class SharedSamplesSummaryDashboardComponent implements OnInit {
  @Input() datesParams: any;
  @Input() dashboardSingleValueDataSetsReferenceKey: string;
  constructor() {}

  ngOnInit(): void {}
}
