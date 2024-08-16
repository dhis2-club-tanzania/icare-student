import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable, zip } from "rxjs";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import { ConceptGetFull } from "src/app/shared/resources/openmrs";
import { SharedConfirmationDialogComponent } from "../shared-confirmation-dialog/shared-confirmation-dialog.component";
import { BillableItemsService } from "../../resources/billable-items/services/billable-items.service";

@Component({
  selector: "app-standard-concepts-list",
  templateUrl: "./standard-concepts-list.component.html",
  styleUrls: ["./standard-concepts-list.component.scss"],
})
export class StandardConceptsListComponent implements OnInit {
  @Input() standardSearchTerm: string;
  @Input() selectedConceptUuid: string;
  @Input() conceptClass: string;
  @Input() stockable: boolean;
  conceptsList$: Observable<ConceptGetFull[]>;
  saving: boolean = false;

  page: number = 1;
  pageSize: number = 10;

  pageCounts: any[] = [10, 20, 25, 50, 100, 200];
  searchingText: string;

  @Output() conceptToEdit: EventEmitter<ConceptGetFull> =
    new EventEmitter<ConceptGetFull>();
  constructor(
    private conceptService: ConceptsService,
    private billableItemService: BillableItemsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.conceptsList$ = !this.stockable
      ? this.conceptService.searchConcept({
          q: this.searchingText,
          pageSize: this.pageSize,
          conceptClass: this.conceptClass,
          page: this.page,
          searchTerm: this.standardSearchTerm,
        })
      : this.conceptService.getConceptsWithItemsDetails([
          "limit=15",
          "startIndex=" + this.pageSize * (this.page - 1),
          `conceptClass=${this.conceptClass}`,
        ]);
  }

  onEdit(event: Event, concept: ConceptGetFull): void {
    this.conceptToEdit.emit(concept);
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
                this.saving = false;
                this.getConceptsList();
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
                this.saving = false;
                this.getConceptsList();
              }
            });
        }
      });
  }

  getConceptsList(): void {
    this.conceptsList$ = this.conceptService.searchConcept({
      q: this.searchingText,
      pageSize: this.pageSize,
      conceptClass: this.conceptClass,
      page: this.page,
      searchTerm: this.standardSearchTerm,
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
                this.saving = false;
                this.conceptsList$ = this.conceptService.searchConcept({
                  q: this.searchingText,
                  pageSize: this.pageSize,
                  conceptClass: this.conceptClass,
                  page: this.page,
                  searchTerm: this.standardSearchTerm,
                });
              }
            });
        }
      });
  }

  onSetBillable(event: Event, concept: any) {
    this.dialog
      .open(SharedConfirmationDialogComponent, {
        minWidth: "20%",
        data: {
          header: `Are you sure you want to set billable <b>${concept?.display}<b>`,
        },
      })
      .afterClosed()
      .subscribe((shouldConfirm) => {
        if (shouldConfirm) {
          const billableItem = {
            concept: { uuid: concept?.uuid },
            unit: "default",
          };
          this.billableItemService
            .createBillableItem(billableItem)
            .subscribe((billableItemResponse) => {
              if (billableItemResponse && !billableItemResponse?.error) {
                // Create prices
                const prices = [
                  {
                    item: {
                      uuid: billableItemResponse?.uuid,
                    },
                    paymentScheme: {
                      uuid: "00000102IIIIIIIIIIIIIIIIIIIIIIIIIIII",
                    },
                    paymentType: {
                      uuid: "00000100IIIIIIIIIIIIIIIIIIIIIIIIIIII",
                    },
                    price: "0",
                  },
                  {
                    item: {
                      uuid: billableItemResponse?.uuid,
                    },
                    paymentScheme: {
                      uuid: "5f53b4e2-da03-4139-b32c-ad6edb699943",
                    },
                    paymentType: {
                      uuid: "00000100IIIIIIIIIIIIIIIIIIIIIIIIIIII",
                    },
                    price: "0",
                  },
                ];
                zip(
                  ...prices.map((priceObject) => {
                    return this.billableItemService.createPrice(priceObject);
                  })
                ).subscribe((priceResponses) => {
                  if (priceResponses) {
                    this.saving = false;
                    this.getConceptsList();
                  }
                });
              }
            });
        }
      });
  }

  searchConcept(event?: KeyboardEvent): void {
    this.page = 1;
    this.searchingText = event
      ? (event.target as HTMLInputElement).value
      : null;
    this.conceptsList$ = !this.stockable
      ? this.conceptService.searchConcept({
          q: this.searchingText,
          pageSize: this.pageSize,
          conceptClass: this.conceptClass,
          page: this.page,
          searchTerm: this.standardSearchTerm,
        })
      : this.conceptService.getConceptsWithItemsDetails(
          [
            "limit=15",
            "startIndex=" + this.pageSize * (this.page - 1),
            this.searchingText ? `q=${this.searchingText}` : null,
            `conceptClass=${this.conceptClass}`,
          ].filter((filterItem: any) => filterItem) || []
        );
  }

  getConceptList(event: any, action?: string): void {
    this.page = event.pageIndex + 1;
    this.pageSize = Number(event?.pageSize);
    this.conceptsList$ = this.conceptService.searchConcept({
      q: this.searchingText,
      pageSize: this.pageSize,
      conceptClass: this.conceptClass,
      page: this.page,
      searchTerm: this.standardSearchTerm,
    });
  }

  onMakeItemStockable(event: Event, conceptItem: any): void {
    // console.log(conceptItem);
    this.conceptService
      .updateItemStockableStatus({
        uuid: conceptItem?.item?.uuid,
        stockable: true,
      })
      .subscribe((response: any) => {
        if (response && !response?.error) {
          this.saving = false;
          this.searchConcept();
        } else {
          // Handle errors
          this.saving = false;
        }
      });
  }
}
