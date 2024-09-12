import { Component, OnInit } from "@angular/core";
import { formatDateToYYMMDD } from "src/app/shared/helpers/format-date.helper";

@Component({
  selector: "app-pharmacy-dashboard-home",
  templateUrl: "./pharmacy-dashboard-home.component.html",
  styleUrls: ["./pharmacy-dashboard-home.component.scss"],
})
export class PharmacyDashboardHomeComponent implements OnInit {
  startDate: Date;
  endDate: Date;
  datesParameters: any;
  datesRangeDifference: number = 2; // TODO: Consider puttingon settings
  constructor() {}

  ngOnInit(): void {
    const today: string = formatDateToYYMMDD(new Date());
    this.startDate = new Date(
      Number(today.split("-")[0]),
      Number(today.split("-")[1]) - 1,
      Number(today.split("-")[2]) - this.datesRangeDifference
    );
    this.endDate = new Date(
      Number(today.split("-")[0]),
      Number(today.split("-")[1]),
      Number(today.split("-")[2]) + 1
    );
    this.datesParameters = {
      startDate: formatDateToYYMMDD(new Date(this.startDate)),
      endDate: formatDateToYYMMDD(new Date(this.endDate)),
    };
  }

  dateRangeSelect(): void {
    this.datesParameters = null;
    setTimeout(() => {
      if (this.startDate && this.endDate) {
        this.datesParameters = {
          startDate: formatDateToYYMMDD(new Date(this.startDate)),
          endDate: formatDateToYYMMDD(new Date(this.endDate)),
        };
      }
    }, 100);
  }
}
