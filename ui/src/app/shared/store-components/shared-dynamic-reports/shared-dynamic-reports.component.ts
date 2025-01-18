import { Component, OnInit } from "@angular/core";
import { OpenmrsHttpClientService } from "../../modules/openmrs-http-client/services/openmrs-http-client.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-shared-dynamic-reports",
  templateUrl: "./shared-dynamic-reports.component.html",
  styleUrl: "./shared-dynamic-reports.component.scss",
})
export class SharedDynamicReportsComponent implements OnInit {
  summaryReportCost$: Observable<any>;
  constructor(private httpClientService: OpenmrsHttpClientService) {}
  ngOnInit(): void {
    this.summaryReportCost$ = this.httpClientService.get(
      "store/reports/summarycost"
    );
  }
}
