import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { ReOrderLevelService } from "src/app/shared/resources/store/services/re-order-level.service";
import { ManageReOrderLevelModalComponent } from "../../modals/manage-re-order-level-modal/manage-re-order-level-modal.component";

@Component({
  selector: "app-re-order-level-items-list",
  templateUrl: "./re-order-level-items-list.component.html",
  styleUrls: ["./re-order-level-items-list.component.scss"],
})
export class ReOrderLevelItemsListComponent implements OnInit {
  reOrderLevelsList$: Observable<any>;
  constructor(
    private reOrderLevelService: ReOrderLevelService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getReOrderLevels();
  }

  getReOrderLevels(): void {
    const locationUuid = JSON.parse(
      localStorage.getItem("currentLocation")
    )?.uuid;
    this.reOrderLevelsList$ =
      this.reOrderLevelService.getReOrderLevelOfItems(locationUuid);
  }

  onAddNew(event: Event): void {
    event.stopPropagation();
    this.dialog
      .open(ManageReOrderLevelModalComponent, {
        width: "30%",
      })
      .afterClosed()
      .subscribe((shouldLoadData) => {
        if (shouldLoadData) {
          this.getReOrderLevels();
        }
      });
  }
}
