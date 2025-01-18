import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-lab-reports-list",
  templateUrl: "./lab-reports-list.component.html",
  styleUrls: ["./lab-reports-list.component.scss"],
})
export class LabReportsListComponent implements OnInit {
  @Input() reports: any[];
  searchingText: string = "";
  @Output() selectedReport: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {}

  onSearchReport(event: KeyboardEvent): void {
    this.searchingText = (event?.target as HTMLInputElement)?.value;
  }

  onViewReport(event: Event, report: any): void {
    event.stopPropagation();
    this.selectedReport.emit(report);
  }
}
