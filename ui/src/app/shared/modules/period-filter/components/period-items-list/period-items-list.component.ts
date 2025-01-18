import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "lib-period-items-list",
  templateUrl: "./period-items-list.component.html",
  styleUrls: ["./period-items-list.component.scss"],
})
export class PeriodItemsListComponent implements OnInit {
  @Input() periodsList: any[];
  year: any;
  @Output() selectedPeriod: EventEmitter<any[]> = new EventEmitter<any[]>();
  constructor() {}

  ngOnInit(): void {}

  getSelectedPeriod(event: Event, period: any): void {
    event.stopPropagation();
    this.selectedPeriod.emit(period);
  }
}
