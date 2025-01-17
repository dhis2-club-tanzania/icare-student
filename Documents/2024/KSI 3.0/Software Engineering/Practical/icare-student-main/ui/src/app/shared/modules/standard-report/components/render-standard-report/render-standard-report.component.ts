import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { DatasetReportsService } from "../../services/dataset-reports.service";
import { uniq } from "lodash";

@Component({
  selector: "lib-render-standard-report",
  templateUrl: "./render-standard-report.component.html",
  styleUrls: ["./render-standard-report.component.scss"],
})
export class RenderStandardReportComponent implements OnInit {
  @Input() report: any;
  @Input() parameters: any;
  evaluatedDataSetsReport$: Observable<any>;
  constructor(private datasetReportService: DatasetReportsService) {}

  ngOnInit(): void {
    if (
      !this.report?.renderAs ||
      (this.report?.renderAs && this.report?.renderAs != "iframe")
    ) {
      this.evaluatedDataSetsReport$ =
        this.datasetReportService.getEvaluatedDatasetReport(
          this.report?.queries?.map((query) => query?.uuid),
          this.parameters
        );

      this.evaluatedDataSetsReport$.subscribe((response: any) => {
        if (response) {
          // TODO: Review the codes to avaoid too much looping
          response?.forEach((data) => {
            data?.rows?.forEach((row) => {
              Object.keys(row).forEach((key: string) => {
                const spanElems = document.getElementsByTagName("span") as any;
                for (const spanItem of spanElems) {
                  if (spanItem?.outerText.split("\n").join("") === key) {
                    spanItem.outerText = row[key];
                  }
                }

                const tdElems = document.getElementsByTagName("td") as any;
                for (const tdItem of tdElems) {
                  if (tdItem?.innerText.split("\n").join("") === key) {
                    tdItem.innerText = row[key];
                  }
                }
              });
            });
          });
        }
      });
    }
  }
}
