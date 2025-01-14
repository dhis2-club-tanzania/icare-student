import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { formatEnrollmentsList } from "src/app/core/helpers/sanitize-enrollments.helper";

@Component({
  selector: "app-render-loaded-clients-list",
  templateUrl: "./render-loaded-clients-list.component.html",
  styleUrls: ["./render-loaded-clients-list.component.scss"],
})
export class RenderLoadedClientsListComponent implements OnInit {
  @Input() enrolledPatients: any[];
  displayedColumns: string[] = ["sn", "mrn", "names", "gender", "age"];
  dataSource: any;
  @Output() enrollment: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(
      formatEnrollmentsList(this.displayedColumns, this.enrolledPatients)
    );
  }

  getSelectedEnrollment(event: Event, enrollment: any): void {
    event.stopPropagation();
    this.enrollment.emit(enrollment);
  }
}
