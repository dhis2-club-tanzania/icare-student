import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { SharedConfirmationDialogComponent } from "src/app/shared/components/shared-confirmation-dialog/shared-confirmation-dialog.component";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import { ConceptGetFull } from "src/app/shared/resources/openmrs";

@Component({
  selector: "app-parameters-list",
  templateUrl: "./parameters-list.component.html",
  styleUrls: ["./parameters-list.component.scss"],
})
export class ParametersListComponent implements OnInit {
  parameters$: Observable<ConceptGetFull[]>;
  currentParameter: ConceptGetFull;
  @Output() selectedParameter: EventEmitter<any> = new EventEmitter<any>();
  page: number = 1;
  pageSize: number = 10;
  pageCounts: any[] = [10, 20, 25, 50, 100, 200];
  searchingText: string;
  constructor(
    private conceptService: ConceptsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.parameters$ = this.conceptService.searchConcept({
      q: this.searchingText,
      pageSize: this.pageSize,
      page: this.page,
      conceptClass: "Test",
      startIndex: (this.page - 1) * this.pageSize,
      searchTerm: "LIS_TEST_PARAMETER",
    });
  }

  getTestParameters(event: any, action?: string): void {
    // event.stopPropagation();
    // this.page = action === "prev" ? this.page - 1 : this.page + 1;
    this.page = event.pageIndex + 1;
    this.pageSize = Number(event?.pageSize);
    this.parameters$ = this.conceptService.searchConcept({
      q: this.searchingText,
      conceptClass: "Test",
      pageSize: this.pageSize,
      page: this.page,
      startIndex: (this.page - 1) * this.pageSize,
      searchTerm: "LIS_TEST_PARAMETER",
    });
  }

  searchConcept(event: KeyboardEvent): void {
    this.page = 1;
    this.searchingText = (event.target as HTMLInputElement).value;
    this.parameters$ = this.conceptService.searchConcept({
      q: this.searchingText,
      conceptClass: "Test",
      pageSize: this.pageSize,
      page: this.page,
      startIndex: (this.page - 1) * this.pageSize,
      searchTerm: "LIS_TEST_PARAMETER",
    });
  }

  onEdit(event: Event, concept: ConceptGetFull): void {
    // event.stopPropagation();
    this.currentParameter = concept;
    this.selectedParameter.emit(this.currentParameter);
  }

  onPermanentDelete(event: Event, concept: ConceptGetFull): void {
    this.dialog
      .open(SharedConfirmationDialogComponent, {
        minWidth: "20%",
        data: {
          header: `Are you sure to delete concept <b>${concept?.display}</b> permanently?`,
        },
      })
      .afterClosed()
      .subscribe((shouldConfirm) => {
        if (shouldConfirm) {
          this.conceptService
            .deleteConcept(concept?.uuid, true)
            .subscribe((response) => {
              if (response) {
                this.page = 1;
                this.parameters$ = this.conceptService.searchConcept({
                  pageSize: this.pageSize,
                  page: this.page,
                  conceptClass: "Test",
                  q: this.searchingText,
                  startIndex: (this.page - 1) * this.pageSize,
                  searchTerm: "LIS_TEST_PARAMETER",
                });
              }
            });
        }
      });
  }

  onDelete(event: Event, concept: ConceptGetFull): void {
    this.dialog
      .open(SharedConfirmationDialogComponent, {
        minWidth: "20%",
        data: {
          header: `Are you sure to disable concept <b>${concept?.display}</b>?`,
        },
      })
      .afterClosed()
      .subscribe((shouldConfirm) => {
        if (shouldConfirm) {
          this.conceptService
            .deleteConcept(concept?.uuid)
            .subscribe((response) => {
              if (response) {
                this.page = 1;
                this.parameters$ = this.conceptService.searchConcept({
                  pageSize: this.pageSize,
                  page: this.page,
                  conceptClass: "Test",
                  q: this.searchingText,
                  startIndex: (this.page - 1) * this.pageSize,
                  searchTerm: "LIS_TEST_PARAMETER",
                });
              }
            });
        }
      });
  }

  onEnable(event: Event, concept: any): void {
    this.dialog
      .open(SharedConfirmationDialogComponent, {
        minWidth: "20%",
        data: {
          header: `Are you sure you want to enable concept <b>${concept?.display}</b>?`,
        },
      })
      .afterClosed()
      .subscribe((shouldConfirm) => {
        if (shouldConfirm) {
          this.conceptService
            .unRetireConcept(concept?.uuid)
            .subscribe((response) => {
              if (response) {
                this.page = 1;
                this.parameters$ = this.conceptService.searchConcept({
                  pageSize: this.pageSize,
                  page: this.page,
                  conceptClass: "Test",
                  q: this.searchingText,
                  startIndex: (this.page - 1) * this.pageSize,
                  searchTerm: "LIS_TEST_PARAMETER",
                });
              }
            });
        }
      });
  }
}
