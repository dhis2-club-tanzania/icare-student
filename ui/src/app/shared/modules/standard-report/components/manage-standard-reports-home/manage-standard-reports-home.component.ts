import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "lib-manage-standard-reports-home",
  templateUrl: "./manage-standard-reports-home.component.html",
  styleUrls: ["./manage-standard-reports-home.component.scss"],
})
export class ManageStandardReportsHomeComponent implements OnInit {
  report: any = "<p></p>";
  @Input() reportToEdit: any;
  @Input() hideList: boolean;
  constructor() {}

  ngOnInit(): void {
    if (this.reportToEdit) {
      this.report = this.reportToEdit;
    }
  }

  onGetSelectedStandardReport(report: any): void {
    this.report = null;
    setTimeout(() => {
      this.report = {
        ...report,
        value: report?.value ? report?.value : report,
      };
    }, 100);
  }

  onGetReloadList(reload: boolean): void {
    if (reload) {
      this.hideList = true;
      setTimeout(() => {
        this.hideList = false;
      }, 30);
    }
  }
}
