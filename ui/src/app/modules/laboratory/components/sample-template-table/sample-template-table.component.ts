import { Component, Input, OnInit } from "@angular/core";
import { formulateHeadersFromExportTemplateReferences } from "../../resources/helpers/import-export.helper";

@Component({
  selector: "app-sample-template-table",
  templateUrl: "./sample-template-table.component.html",
  styleUrls: ["./sample-template-table.component.scss"],
})
export class SampleTemplateTableComponent implements OnInit {
  @Input() exportTemplateDataReferences: any[];
  formulatedHeaders: any = {};
  constructor() {}

  ngOnInit(): void {
    this.formulatedHeaders = formulateHeadersFromExportTemplateReferences(
      this.exportTemplateDataReferences
    );
  }
}
