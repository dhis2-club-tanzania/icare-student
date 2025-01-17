import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { SharedConfirmationComponent } from "src/app/shared/components/shared-confirmation/shared-confirmation.component";
import { ReOrderLevelService } from "src/app/shared/resources/store/services/re-order-level.service";
import { ManageReOrderLevelModalComponent } from "../../store-modals/manage-re-order-level-modal/manage-re-order-level-modal.component";
import { GoogleAnalyticsService } from "src/app/google-analytics.service";

@Component({
  selector: "app-re-order-level-items-list",
  templateUrl: "./re-order-level-items-list.component.html",
  styleUrls: ["./re-order-level-items-list.component.scss"],
})
export class ReOrderLevelItemsListComponent implements OnInit {
  reOrderLevelsList$: Observable<any>;
  constructor(
    private reOrderLevelService: ReOrderLevelService,
    private dialog: MatDialog,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {}

  ngOnInit(): void {
    this.getReOrderLevels();
  }

  getReOrderLevels(): void {
    const locationUuid = JSON.parse(
      localStorage.getItem("currentLocation")
    )?.uuid;
    this.reOrderLevelsList$ = this.reOrderLevelService
      .getReOrderLevelOfItems(locationUuid)
      .pipe(
        map((response) =>
          response?.filter((reOrderLevel) => !reOrderLevel?.voided)
        )
      );
  }

  onAddNew(event: Event): void {
    event.stopPropagation();
    this.dialog
      .open(ManageReOrderLevelModalComponent, {
        minWidth: "30%",
      })
      .afterClosed()
      .subscribe((shouldLoadData) => {
        if (shouldLoadData) {
          this.getReOrderLevels();
        }
      });

      this.trackActionForAnalytics(`Add Re-orders Levels: Open`);
  }

  trackActionForAnalytics(eventname: any) {
    // Send data to Google Analytics
   this.googleAnalyticsService.sendAnalytics('Pharmacy',eventname,'Pharmacy')
  }

  onUpdate(e: any, reOrderLevel: any) {
    e?.stopPropagation();
    this.dialog
      .open(ManageReOrderLevelModalComponent, {
        minWidth: "30%",
        data: {
          reOrderLevel: reOrderLevel,
        },
      })
      .afterClosed()
      .subscribe((shouldLoadData) => {
        if (shouldLoadData) {
          this.getReOrderLevels();
        }
      });
  }
  onDelete(e: any, reOrderLevel: any) {
    e?.stopPropagation();
    this.dialog
      .open(SharedConfirmationComponent, {
        minWidth: "30%",
        data: {
          modalTitle: `Delete Reorder level`,
          modalMessage: `Are you sure to delete re-order level for ${reOrderLevel?.item?.display}`,
          confirmationButtonText: `Delete`,
          showRemarksInput: false,
        },
      })
      .afterClosed()
      .subscribe((response) => {
        if (response?.confirmed) {
          this.reOrderLevelService
            .updateReOrderLevel(reOrderLevel?.uuid, {
              ...reOrderLevel,
              voided: true,
            })
            .pipe(
              tap(() => {
                this.getReOrderLevels();
              })
            )
            .subscribe();
        }
      });
  }
}
