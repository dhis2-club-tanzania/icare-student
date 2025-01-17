import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { WorkSheetsService } from "src/app/modules/laboratory/resources/services/worksheets.service";

@Component({
  selector: "app-worksheets-list",
  templateUrl: "./worksheets-list.component.html",
  styleUrls: ["./worksheets-list.component.scss"],
})
export class WorksheetsListComponent implements OnInit {
  worksheets$: Observable<any>;
  constructor(private worksheetsService: WorkSheetsService) {}

  ngOnInit(): void {
    this.getWorksheets();
  }

  getWorksheets(): void {
    this.worksheets$ = this.worksheetsService.getWorkSheets().pipe(
      map((worksheets: any[]) => {
        return worksheets?.map((worksheet) => {
          return {
            ...worksheet,
            testOrder: {
              ...worksheet?.testOrder,
              display:
                worksheet?.testOrder?.display?.indexOf(":") > -1
                  ? worksheet?.testOrder?.display?.split(":")[1]
                  : worksheet?.testOrder?.display,
            },
          };
        });
      })
    );
  }
}
