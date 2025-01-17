import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import { ConceptGet, ConceptsourceGet } from "src/app/shared/resources/openmrs";
import { ManageUnitOfMeasureModalComponent } from "../../../modules/maintenance/modals/manage-unit-of-measure-modal/manage-unit-of-measure-modal.component";
import { SharedConfirmationDialogComponent } from "src/app/shared/components/shared-confirmation-dialog/shared-confirmation-dialog.component";
import { GoogleAnalyticsService } from "src/app/google-analytics.service";

@Component({
  selector: "app-units-of-measure-settings",
  templateUrl: "./units-of-measure-settings.component.html",
  styleUrls: ["./units-of-measure-settings.component.scss"],
})
export class UnitsOfMeasureSettingsComponent implements OnInit {
  unitsOfMeasure$: Observable<ConceptsourceGet[]>;
  @Input() mappingSource: any;
  constructor(
    private conceptService: ConceptsService,
    private dialog: MatDialog,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {}

  ngOnInit(): void {
    this.getUnitsOfMeasure();
  }

  getUnitsOfMeasure(): void {
    this.unitsOfMeasure$ = this.conceptService
      .getConceptByMappingSource(
        "UNIT OF MEASURE REFERENCE",
        "custom:(uuid,display,mappings:(uuid,display,conceptReferenceTerm:(uuid,display,code,conceptSource)))"
      )
      .pipe(
        map((response) => {
          return {
            ...response,
            results: response?.results?.map((concept) => {
              return {
                ...concept,
                mappings: concept?.mappings,
                unitOfMeasure: (concept?.mappings?.filter(
                  (mapping) =>
                    mapping?.conceptReferenceTerm?.conceptSource?.uuid ===
                    this.mappingSource?.uuid
                ) || [])[0],
              };
            }),
          };
        })
      );
  }

  onAddNew(event: Event): void {
    event.stopPropagation();
    this.dialog
      .open(ManageUnitOfMeasureModalComponent, {
        minWidth: "30%",
        data: {
          conceptSource: this.mappingSource,
        },
      })
      .afterClosed()
      .subscribe((shouldReload?: boolean) => {
        if (shouldReload) {
          this.getUnitsOfMeasure();
        }
      });
      this.trackActionForAnalytics(`Add Units of Measure: Open`);
  }

  trackActionForAnalytics(eventname: any) {
    // Send data to Google Analytics
   this.googleAnalyticsService.sendAnalytics('Pharmacy',eventname,'Pharmacy')
  }


  onDelete(concept: ConceptGet): void {
    this.dialog
      .open(SharedConfirmationDialogComponent, {
        minWidth: "20%",
        data: {
          header: `Are you sure to delete unit of measure <b>${concept?.display}</b> permanently?`,
        },
      })
      .afterClosed()
      .subscribe((shouldConfirm) => {
        if (shouldConfirm) {
          this.conceptService
            .deleteConcept(concept?.uuid, true)
            .subscribe((response) => {
              if (response) {
                this.getUnitsOfMeasure();
              }
            });
        }
      });
  }
  // this is where we fix an error. 
  onEdit(event: Event, drug): void {
      this.dialog
        .open(ManageUnitOfMeasureModalComponent, {
          minWidth: "40%",
          data: {
           
          },
        })
        .afterClosed()
        .subscribe((shouldReloadData) => {
          if (shouldReloadData) {
            this.getUnitsOfMeasure();
          }
        });
    }
}
