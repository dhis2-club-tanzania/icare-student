import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-shared-sample-orders",
  templateUrl: "./shared-sample-orders.component.html",
  styleUrls: ["./shared-sample-orders.component.scss"],
})
export class SharedSampleOrdersComponent implements OnInit {
  @Input() samplesData: any;
  constructor() {}

  ngOnInit(): void {
    // console.log(this.samplesData);
  }
}
