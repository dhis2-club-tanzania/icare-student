import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-shared-dashboard-container",
  templateUrl: "./shared-dashboard-container.component.html",
  styleUrls: ["./shared-dashboard-container.component.scss"],
})
export class SharedDashboardContainerComponent implements OnInit {
  @Input() datesParams: any;
  constructor() {}

  ngOnInit(): void {}
}
