import { Component, Input, OnInit } from "@angular/core";
import { sum } from "lodash";

@Component({
  selector: "app-totalize-stock-units-quantity",
  templateUrl: "./totalize-stock-units-quantity.component.html",
  styleUrls: ["./totalize-stock-units-quantity.component.scss"],
})
export class TotalizeStockUnitsQuantityComponent implements OnInit {
  @Input() location: any;
  @Input() stockStatusOfAnItem: any;
  constructor() {}

  ngOnInit(): void {}

  get totalStock(): number {
    return sum(
      (
        this.stockStatusOfAnItem.filter(
          (stockStatus) => stockStatus?.location?.uuid == this.location?.uuid
        ) || []
      ).map((batchOfTheLocation) => {
        return Number(batchOfTheLocation?.quantity) || 0;
      })
    );
  }
}
