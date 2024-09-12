import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { LedgerTypeObject } from "src/app/shared/resources/store/models/ledger-type.model";
import { LedgerTypeService } from "src/app/shared/resources/store/services/ledger-type.service";
import { ManageLedgerComponent } from "../../store-modals/manage-ledger/manage-ledger.component";
import { GoogleAnalyticsService } from "src/app/google-analytics.service";

@Component({
  selector: "app-ledgers-list",
  templateUrl: "./ledgers-list.component.html",
  styleUrls: ["./ledgers-list.component.scss"],
})
export class LedgersListComponent implements OnInit {
  ledgerTypes$: Observable<LedgerTypeObject[]>;
  constructor(
    private ledgerTypesService: LedgerTypeService,
    private dialog: MatDialog,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {}

  ngOnInit(): void {
    this.getLedgerTypes();
  }

  getLedgerTypes(): void {
    this.ledgerTypes$ = this.ledgerTypesService.getLedgerTypes();
  }

  onAddNew(event: Event): void {
    event.stopPropagation();
    this.dialog
      .open(ManageLedgerComponent, {
        minWidth: "30%",
      })
      .afterClosed()
      .subscribe((shouldLoadLegderTypes) => {
        if (shouldLoadLegderTypes) {
          this.getLedgerTypes();
        }
      });
      this.trackActionForAnalytics(`Add Ledgers: Open`);
  }



  trackActionForAnalytics(eventname: any) {
    // Send data to Google Analytics
   this.googleAnalyticsService.sendAnalytics('Pharmacy',eventname,'Pharmacy')
  }

}
