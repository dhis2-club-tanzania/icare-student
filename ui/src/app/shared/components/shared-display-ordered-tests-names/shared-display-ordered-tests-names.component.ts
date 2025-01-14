import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-shared-display-ordered-tests-names",
  templateUrl: "./shared-display-ordered-tests-names.component.html",
  styleUrls: ["./shared-display-ordered-tests-names.component.scss"],
})
export class SharedDisplayOrderedTestsNamesComponent implements OnInit {
  @Input() sampleDetails: any;
  @Input() useShortName: boolean;
  displayString: string;
  constructor() {}

  ngOnInit(): void {
    this.displayString = this.sampleDetails?.orders?.map((orderDetails: any) =>
      this.useShortName
        ? orderDetails?.order?.shortName?.indexOf(":") > -1
          ? orderDetails?.order?.shortName?.split(":")[1]
          : orderDetails?.order?.shortName
        : orderDetails?.order?.concept?.display?.indexOf(":") > -1
        ? orderDetails?.order?.concept?.display?.split(":")[1]
        : orderDetails?.order?.concept?.display
    );
  }
}
