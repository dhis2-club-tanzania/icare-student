import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-labs-section-management",
  templateUrl: "./labs-section-management.component.html",
  styleUrls: ["./labs-section-management.component.scss"],
})
export class LabsSectionManagementComponent implements OnInit {
  searchTermOfConceptSetToExclude: string = "LAB_DEPARTMENT";
  constructor() {}

  ngOnInit(): void {}
}
