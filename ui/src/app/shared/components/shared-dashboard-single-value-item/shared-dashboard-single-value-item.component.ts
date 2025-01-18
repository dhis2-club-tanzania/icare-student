import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { OpenmrsHttpClientService } from "../../modules/openmrs-http-client/services/openmrs-http-client.service";

@Component({
  selector: "app-shared-dashboard-single-value-item",
  templateUrl: "./shared-dashboard-single-value-item.component.html",
  styleUrls: ["./shared-dashboard-single-value-item.component.scss"],
})
export class SharedDashboardSingleValueItemComponent implements OnInit {
  @Input() dataSet: any;
  @Input() datesParams: { startDate: Date; endDate: Date };
  singleValue$: Observable<any>;
  dataSet$: Observable<any>;
  constructor(private httpClient: OpenmrsHttpClientService) {}

  ngOnInit(): void {
    this.singleValue$ = this.httpClient
      .get(
        `reportingrest/dataSet/${this.dataSet?.value}?startDate=${this.datesParams?.startDate}&endDate=${this.datesParams?.endDate}`
      )
      .pipe(
        map((response) => {
          return {
            name: response?.definition?.name
              ?.replace("SINGLE VALUE:", "")
              ?.replace("COUNT:", ""),
            description: response?.definition?.description,
            value:
              response?.rows && response?.rows?.length > 0
                ? response?.rows[0]?.count
                : 0,
          };
        })
      );
    this.dataSet$ = this.httpClient.get(``);
  }
}
