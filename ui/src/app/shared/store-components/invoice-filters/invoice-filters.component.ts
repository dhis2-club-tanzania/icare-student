import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-invoice-filters",
  templateUrl: "./invoice-filters.component.html",
  styleUrls: ["./invoice-filters.component.scss"],
})
export class InvoiceFiltersComponent implements OnInit {
  @Output() searchingText: EventEmitter<string> = new EventEmitter<string>();
  startDate: Date;
  endDate: Date;
  @Output() definedStartDate: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() definedEndDate: EventEmitter<Date> = new EventEmitter<Date>();
  constructor() {}

  ngOnInit(): void {}

  onSearch(event: KeyboardEvent): void {
    this.searchingText.emit((event.target as HTMLInputElement).value);
  }

  onGetDate(event: any, dateType): void {
    if (dateType === "endDate") {
      this.endDate = event?.value;
      this.definedEndDate.emit(this.endDate);
    } else {
      this.startDate = event?.value;
      this.definedStartDate.emit(this.startDate);
    }
  }
}
