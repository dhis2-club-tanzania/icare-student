import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-events-data",
  templateUrl: "./events-data.component.html",
  styleUrls: ["./events-data.component.scss"],
})
export class EventsDataComponent implements OnInit {
  @Input() reportObject: any;
  reportData: any[];
  @Output() eventData: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {
    this.reportData = this.reportObject
      ? Object.keys(this.reportObject).map((key) => {
          return this.reportObject[key];
        })
      : [];
  }

  sendEvent(e, data) {
    e.stopPropagation();
    this.eventData.emit(data);
  }
}
