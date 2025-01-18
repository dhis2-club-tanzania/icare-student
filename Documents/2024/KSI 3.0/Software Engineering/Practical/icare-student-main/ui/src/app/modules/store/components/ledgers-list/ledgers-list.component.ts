import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { LedgerTypeObject } from "src/app/shared/resources/store/models/ledger-type.model";
import { LedgerTypeService } from "src/app/shared/resources/store/services/ledger-type.service";
import { ManageLedgerComponent } from "../../modals/manage-ledger/manage-ledger.component";

@Component({
  selector: "app-ledgers-list",
  templateUrl: "./ledgers-list.component.html",
  styleUrls: ["./ledgers-list.component.scss"],
})
export class LedgersListComponent implements OnInit {
  ledgerTypes$: Observable<LedgerTypeObject[]>;
  constructor(
    private ledgerTypesService: LedgerTypeService,
    private dialog: MatDialog
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
        width: "30%",
      })
      .afterClosed()
      .subscribe((shouldLoadLegderTypes) => {
        if (shouldLoadLegderTypes) {
          this.getLedgerTypes();
        }
      });
  }
}
