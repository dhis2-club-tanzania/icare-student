import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-cabinet-occupancy-summary-modal",
  templateUrl: "./cabinet-occupancy-summary-modal.component.html",
  styleUrls: ["./cabinet-occupancy-summary-modal.component.scss"],
})
export class CabinetOccupancySummaryModalComponent implements OnInit {
  mrn: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.mrn = (this.data?.visit?.patient?.identifiers?.filter(
      (identifier: any) => identifier?.preferred
    ) || [])[0]?.identifier;
  }
}
