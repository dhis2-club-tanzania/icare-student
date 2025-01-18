import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import { ConceptGet } from "src/app/shared/resources/openmrs";
import { AddNewGenericDrugModalComponent } from "../../../modules/maintenance/modals/add-new-generic-drug-modal/add-new-generic-drug-modal.component";
import { DrugListModalComponent } from "../../../modules/maintenance/modals/drug-list-modal/drug-list-modal.component";
import { GoogleAnalyticsService } from "src/app/google-analytics.service";

@Component({
  selector: "app-generic-drugs-list",
  templateUrl: "./generic-drugs-list.component.html",
  styleUrls: ["./generic-drugs-list.component.scss"],
})
export class GenericDrugsListComponent implements OnInit {
  drugConcepts$: Observable<any[]>;
  page: number = 1;
  pageSize = 10;
  pageCounts: any[] = [10, 20, 25, 50, 100, 200];
  searchingText: string;
  constructor(
    private conceptsService: ConceptsService,
    private dialog: MatDialog,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {}

  ngOnInit(): void {
    this.getDrugsConcepts();
  }

  onSearch(event): void {
    this.getDrugsConcepts();
  }

  getDrugsConcepts(): void {
    this.drugConcepts$ = this.conceptsService.searchConcept({
      searchTerm: "ICARE_GENERIC_DRUG",
      page: this.page,
      pageSize: this.pageSize,
      q: this.searchingText,
    });
  }

  onViewDrugs(event: Event, concept: ConceptGet): void {
    // event.stopPropagation();
    this.dialog.open(DrugListModalComponent, {
      width: "50%",
      data: {
        concept,
      },
    });
  }

  onEdit(event: Event, genericDrug: any): void {
    // event.stopPropagation();
    this.dialog
      .open(AddNewGenericDrugModalComponent, {
        width: "70%",
        data: {
          ...genericDrug,
        },
      })
      .afterClosed()
      .subscribe((hasChanges) => {
        if (hasChanges) {
          this.getDrugsConcepts();
        }
      });
  }

  onGetList(event: any, actionType?: string): void {
    this.page = event.pageIndex + 1;
    this.pageSize = Number(event?.pageSize);
    this.getDrugsConcepts();
  }

  onAddNew(event: Event): void {
    event.stopPropagation();
    this.dialog
      .open(AddNewGenericDrugModalComponent, {
        width: "70%",
      })
      .afterClosed()
      .subscribe((shouldReload) => {
        if (shouldReload) {
          this.getDrugsConcepts();
        }
      });
      this.trackActionForAnalytics(`Add Generic Drugs: Open`);
  }

   
  trackActionForAnalytics(eventname: any) {
    // Send data to Google Analytics
   this.googleAnalyticsService.sendAnalytics('Pharmacy',eventname,'Pharmacy')
  }
}
