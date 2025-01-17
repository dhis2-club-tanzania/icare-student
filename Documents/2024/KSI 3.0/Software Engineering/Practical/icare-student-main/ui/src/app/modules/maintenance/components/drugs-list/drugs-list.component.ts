import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { flatten } from "lodash";
import { Observable, zip } from "rxjs";
import { map } from "rxjs/operators";
import { ExportDataService } from "src/app/core/services/export-data.service";
import { DrugsService } from "src/app/shared/resources/drugs/services/drugs.service";
import { ManageDrugModalComponent } from "../../modals/manage-drug-modal/manage-drug-modal.component";

@Component({
  selector: "app-drugs-list",
  templateUrl: "./drugs-list.component.html",
  styleUrls: ["./drugs-list.component.scss"],
})
export class DrugsListComponent implements OnInit {
  @Input() conceptUuid: string;
  drugs$: Observable<any>;
  startIndex: number = 0;
  limit: number = 10;

  page: number = 1;
  searchingText: string;
  downloading: boolean = false;
  constructor(
    private drugService: DrugsService,
    private dialog: MatDialog,
    private exportDataService: ExportDataService
  ) {}

  ngOnInit(): void {
    this.getDrugs();
  }

  getDrugs(): void {
    if (this.conceptUuid) {
      this.drugs$ = this.drugService.getDrugsUsingConceptUuid(this.conceptUuid);
    } else {
      this.drugs$ = this.drugService.getAllDrugs({
        startIndex: this.startIndex,
        limit: this.limit,
        q: this.searchingText,
        v: "custom:(uuid,display,strength,concept:(uuid,display))",
      });
    }
  }

  onGetList(event: Event, actionType: string): void {
    event.stopPropagation();
    this.page = actionType === "next" ? this.page + 1 : this.page - 1;
    this.startIndex = this.limit * this.page - 1 + 1;
    this.getDrugs();
  }

  onSearch(event): void {
    this.getDrugs();
  }

  onEdit(event: Event, drug): void {
    this.dialog
      .open(ManageDrugModalComponent, {
        width: "40%",
        data: {
          ...drug,
        },
      })
      .afterClosed()
      .subscribe((shouldReloadData) => {
        if (shouldReloadData) {
          this.getDrugs();
        }
      });
  }

  onAddNew(event: Event): void {
    event.stopPropagation();
    this.dialog
      .open(ManageDrugModalComponent, {
        width: "40%",
      })
      .afterClosed()
      .subscribe((shouldReloadData) => {
        if (shouldReloadData) {
          this.getDrugs();
        }
      });
  }

  onDownload(event: Event, fileName: string): void {
    event.stopPropagation();
    this.downloading = true;
    let references = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    this.drugs$ = zip(
      ...references.map((reference) => {
        return this.drugService.getAllDrugs({
          startIndex: (reference - 1) * 100,
          limit: 100,
          q: this.searchingText,
          v: "custom:(uuid,display,strength,concept:(uuid,display))",
        });
      })
    ).pipe(map((response) => flatten(response)));
    this.drugs$.subscribe((response) => {
      if (response) {
        this.downloading = false;
        let data = response?.results
        this.exportDataService.exportAsExcelFile(data, fileName);
      }
    });
  }
}
