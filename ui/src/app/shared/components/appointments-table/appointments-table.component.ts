import { EventEmitter, OnChanges, Output, ViewChild } from "@angular/core";
import { Component, Input, OnInit } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { sanitizePatientsVisitsForTabularPatientListing } from "../../helpers/sanitize-visits-list-for-appointment-tabular-listing.helper";
import { Visit } from "../../resources/visits/models/visit.model";

@Component({
  selector: 'app-appointments-table',
  templateUrl: './appointments-table.component.html',
  styleUrls: ['./appointments-table.component.scss']
})
export class AppointmentsTableComponent implements OnInit {

  @Input() visits: Visit[];
  @Input() shouldShowParentLocation: boolean;
  @Input() paymentTypeSelected: string;
  @Input() itemsPerPage: number;
  @Input() page: number;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @Output() patientVisitDetails: EventEmitter<any> = new EventEmitter<any>();
  @Output() shouldLoadNewList: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  currentPage: number = 0;

  displayedColumns: string[] = [
    "position",
    "patietId",
    "patientName",
    "appointmentType",
    "provider",
    "location",
    "date",
    "time",
    "status",
  ];
  dataSource: any;
  constructor() {}

  ngOnInit(): void {
    console.log(sanitizePatientsVisitsForTabularPatientListing(
        this.visits,
        this.shouldShowParentLocation,
        this.paymentTypeSelected,
        this.itemsPerPage,
        this.page
      ))
    this.dataSource = new MatTableDataSource(
      sanitizePatientsVisitsForTabularPatientListing(
        this.visits,
        this.shouldShowParentLocation,
        this.paymentTypeSelected,
        this.itemsPerPage,
        this.page
      )
    );
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges() {
    console.log(this.visits)
    this.dataSource = new MatTableDataSource(
      sanitizePatientsVisitsForTabularPatientListing(
        this.visits,
        this.shouldShowParentLocation,
        this.paymentTypeSelected,
        this.itemsPerPage,
        this.page
      )
    );
    this.dataSource.paginator = this.paginator;
  }

  getSelectedPatient(event, patientVisitDetails) {
    event.stopPropagation();
    this.patientVisitDetails.emit(patientVisitDetails);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAnotherList(event: Event, visit, type): void {
    event.stopPropagation();
    this.page =
      type === "next"
        ? this.page + 1
        : type === "prev"
        ? this.page - 1
        : this.page;
    this.shouldLoadNewList.emit({ ...visit, type, page: this.page });
  }

}
