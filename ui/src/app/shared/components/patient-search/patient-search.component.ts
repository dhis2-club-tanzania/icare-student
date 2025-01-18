import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { addCurrentPatient } from "../../../store/actions";
import { AppState } from "../../../store/reducers";
import { PatientService } from "../../resources/patient/services/patients.service";
import { Patient } from "../../resources/patient/models/patient.model";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: "app-patient-search",
  templateUrl: "./patient-search.component.html",
  styleUrls: ["./patient-search.component.scss"],
})
export class PatientSearchComponent implements OnInit {
  @Output() selectPatient: EventEmitter<any> = new EventEmitter();
  @Output() displayList: EventEmitter<any> = new EventEmitter();
  patients$: Observable<any>;
  searching: boolean = false;
  showList: boolean = false;
  nopatient: boolean = false;
  displayedColumns: string[] = ["id", "name", "gender", "age", "phone"];
  focused: boolean = false;
  totalPatients: number = 0;
  pageSize: number = 100; // Set page size to 100 for displaying more results
  currentPage: number = 0; // Current page
  searchTerm: string = ''; // Store the current search term

  // For pagination
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  constructor(
    private patientService: PatientService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {}

  // Handle search and pagination
  onSearchPatients(e): void {
    if (e) {
      if (typeof e.stopPropagation === 'function') {
        e.stopPropagation();  // Only call stopPropagation if it exists
      }
  
      this.searching = true;
      this.showList = false;
  
      // Update search term
      this.searchTerm = e.target.value;
  
      // Fetch patient data from service with pagination
      this.patients$ = this.patientService.getPatients(this.searchTerm, this.pageSize, this.currentPage).pipe(
        map((results: any) => {
          console.log('Search Results:', results); // Log the raw response for debugging
  
          if (!results || results.length === 0) {
            this.nopatient = true;
            this.totalPatients = 0;
            this.dataSource.data = []; // Empty the table if no results
            return [];
          } else {
            this.nopatient = false;
            this.totalPatients = results.length; // Update total patient count based on results length
            this.dataSource.data = results; // Populate the table with new data
          }
  
          // Map patient data (optional: process data here)
          return results?.map((res) => {
            return {
              ...res,
              insurance: res?.patient?.person?.attributes?.filter(attribute => 
                attribute?.attributeType?.uuid === "58867285-7f8e-4ddf-aef6-f0c3d8f73305"
              )[0]?.value || [],
              phoneNumber: res?.patient?.person?.attributes?.filter(attribute => 
                attribute?.attributeType?.uuid === "96878413-bbae-4ee0-812f-241a4fc94500" ||
                attribute?.attributeType?.uuid === "aeb3a16c-f5b6-4848-aa51-d7e3146886d6"
              )[0]?.value || []
            };
          });
        }),
        tap(() => {
          this.searching = false;
          this.showList = true;
        })
      );
  
      if (this.searchTerm.length > 0) {
        this.focused = true;
      } else {
        this.focused = false;
      }
  
      this.displayList.emit(this.focused);
    }
  }
  

   // Handle page change and refresh the search data accordingly
  onPageChange(event): void {
    this.currentPage = event.pageIndex;  // Update currentPage based on pageIndex
    this.pageSize = event.pageSize;      // Update pageSize based on selected pageSize

    // Fetch patients again with the updated page size and current page
    this.onSearchPatients({ target: { value: this.searchTerm } });
  }

  // When a patient is selected, store the patient and emit the selection
  onSelectPatient(e: Event, patient: Patient): void {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    console.log('Clicked patient:', patient); // Debug here
    this.store.dispatch(addCurrentPatient({ patient }));
    this.selectPatient.emit(patient);
  }
  
  
}
