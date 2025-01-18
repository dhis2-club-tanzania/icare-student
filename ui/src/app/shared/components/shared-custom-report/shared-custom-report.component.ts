import { HttpClient } from "@angular/common/http";
import { Component, Input, OnChanges, OnInit } from "@angular/core";

import * as _ from "lodash";
import { BASE_URL } from "src/app/shared/constants/constants.constants";

@Component({
  selector: "app-shared-custom-report",
  templateUrl: "./shared-custom-report.component.html",
  styleUrls: ["./shared-custom-report.component.scss"],
})
export class SharedCustomReportComponent implements OnInit, OnChanges {
  @Input() report: any;
  @Input() selectionDates: any;
  reportData: any;
  loadingReport: boolean = false;
  reportHeaders: any[];
  searchingText: string = "";
  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.loadingReport = true;
    this.httpClient
      .get(
        BASE_URL +
          "reportingrest/dataSet/" +
          this.report?.key +
          "?startDate=" +
          this.selectionDates?.startDate +
          "&endDate=" +
          this.selectionDates?.endDate
      )
      .subscribe((data: any) => {
        if (data) {
          this.reportHeaders =
            data?.rows?.length > 0
              ? _.map(data?.metadata?.columns, (key) => {
                  return key;
                })
              : [];
          this.reportData = data?.rows?.map((row) => {
            return {
              ...row,
              searchingText: _.map(Object.keys(row), (key) => {
                return row[key];
              }).join(" "),
            };
          });
          this.loadingReport = false;
        }
      });
  }
}
