import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";
import { getFormattedPeriodsByPeriodType } from "src/app/shared/helpers/format-dates-types.helper";

@Component({
  selector: "app-report-period-filter",
  templateUrl: "./report-period-filter.component.html",
  styleUrls: ["./report-period-filter.component.scss"],
})
export class ReportPeriodFilterComponent implements OnInit, OnChanges {
  @Input() reportConfigs: any;
  @Output() selectedPeriod = new EventEmitter<any>();
  periodObject: any;
  selectedYear: any;
  formattedPeriods: any[];
  currentYear: any;
  selectedDay: any;

  startDate: any = new Date();
  endDate: any = new Date();

  selectedDateRange = {};
  constructor() {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.defineDates();
  }

  defineDates() {
    this.selectedDay = new Date();

    if (
      this.reportConfigs?.reportingFrequency !== "Daily" &&
      this.reportConfigs?.reportingFrequency !== "Range"
    ) {
      let now = new Date();
      const year = !this.selectedYear
        ? now.getFullYear().toString()
        : this.selectedYear;

      this.currentYear = now.getFullYear().toString();

      this.selectedYear = year;

      this.formattedPeriods = getFormattedPeriodsByPeriodType(
        year,
        this.reportConfigs["reportingFrequency"]
      );
      this.selectedPeriod.emit(
        this.formattedPeriods[this.formattedPeriods.length - 1]
      );
      this.periodObject =
        this.formattedPeriods[this.formattedPeriods.length - 1];
    } else if (this.reportConfigs?.reportingFrequency === "Daily") {
      this.selectedPeriod.emit(this.formatDate(this.selectedDay));
    } else if (this.reportConfigs?.reportingFrequency === "Range") {
      // console.log("For range picker");
      // console.log("this.onDateChange()", this.onDateChange());
      // this.selectedPeriod.emit(this.onDateChange());
    }
  }

  onChange() {
    this.selectedPeriod.emit(this.formatDate(this.selectedDay));
  }

  onGetPeriod(period): void {
    this.periodObject = period;
    this.selectedPeriod.emit(this.periodObject);
  }

  onSetYear(e, type): void {
    e.stopPropagation();
    const currentYear = new Date().getFullYear();
    this.selectedYear =
      type === "next"
        ? Number(this.selectedYear) + 1
        : Number(this.selectedYear) - 1;
    this.formattedPeriods = getFormattedPeriodsByPeriodType(
      this.selectedYear,
      this.reportConfigs["reportingFrequency"]
    );
    if (this.selectedYear === currentYear) {
      this.periodObject =
        this.formattedPeriods[this.formattedPeriods.length - 1];
      this.selectedPeriod.emit(this.periodObject);
    } else {
      this.periodObject = this.formattedPeriods[0];
      this.selectedPeriod.emit(this.periodObject);
    }
  }

  formatDate(date: Date) {
    return {
      date: `${date.getFullYear()}-${date.getMonth() < 9 ? "0" : ""}${
        date.getMonth() + 1
      }-${date.getDate() < 10 ? "0" : ""}${date.getDate()}`,
      periodId: `${date.getFullYear()}${date.getMonth() < 9 ? "0" : ""}${
        date.getMonth() + 1
      }${date.getDate() < 10 ? "0" : ""}${date.getDate()}`,
    };
  }

  onDateChange() {
    this.selectedDateRange = {
      periodId: `${this.startDate.getFullYear()}-${
        this.startDate.getMonth() + 1
      }-${this.startDate.getDate()}-${this.endDate.getFullYear()}-${
        this.endDate.getMonth() + 1
      }-${this.endDate.getDate()}`,
      name: `${this.startDate.getFullYear()}-${
        this.startDate.getMonth() + 1
      }-${this.startDate.getDate()} to ${this.endDate.getFullYear()}-${
        this.endDate.getMonth() + 1
      }-${this.endDate.getDate()}`,
      startDate: `${this.startDate.getFullYear()}-${
        this.startDate.getMonth() + 1
      }-${this.startDate.getDate()}`,
      endDate: this.endDate
        ? `${this.endDate.getFullYear()}-${
            this.endDate.getMonth() + 1
          }-${this.endDate.getDate()}`
        : "",
    };
    if (this.startDate && this.endDate) {
      this.selectedPeriod.emit(this.selectedDateRange);
    }
  }
}
