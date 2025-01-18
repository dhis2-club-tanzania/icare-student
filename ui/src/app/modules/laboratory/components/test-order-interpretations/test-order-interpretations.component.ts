import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-test-order-interpretations",
  templateUrl: "./test-order-interpretations.component.html",
  styleUrls: ["./test-order-interpretations.component.scss"],
})
export class TestOrderInterpretationsComponent implements OnInit {
  @Input() descriptions!: any[];
  constructor() {}

  ngOnInit(): void {
    this.descriptions = (
      this.descriptions?.filter(
        (description: any) =>
          description?.description?.indexOf("INTERPRETATION:") > -1
      ) || []
    )?.map((interpretation: any) => {
      return {
        label: interpretation?.description?.split(":")[1],
        description: interpretation?.description?.split("::")[1],
      };
    });
  }
}
