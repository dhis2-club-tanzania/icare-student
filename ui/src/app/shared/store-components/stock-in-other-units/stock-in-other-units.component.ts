import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { from, Observable } from "rxjs";
//import { groupBy, map, mergeMap, reduce, toArray } from "rxjs/operators";
import { LocationService } from "src/app/core/services";
import { StockService } from "src/app/shared/resources/store/services/stock.service";

@Component({
  selector: "app-stock-in-other-units",
  templateUrl: "./stock-in-other-units.component.html",
  styleUrls: ["./stock-in-other-units.component.scss"],
})
export class StockInOtherUnitsComponent implements OnInit {
  locations$: Observable<any>;
  stockStatusOfAnItem$: Observable<any>;
  @Input() itemID?: string;
  @Output() clearItemID: EventEmitter<any> = new EventEmitter();
  constructor(
    private locationService: LocationService,
    private stockService: StockService
  ) {}

  ngOnInit(): void {
    this.locations$ = this.locationService.getLocationsByTagName("Store");
    this.stockStatusOfAnItem$ = this.stockService.getItemStockInAllUnits(
      this.itemID
    );
  }
  getLocatons(): void {
    this.locations$ = this.locationService.getLocationsByTagName("Store");
    // .pipe(
    //   map((locations) => {
    //     return locations.map((location) => {
    //       return {
    //         ...location,
    //         locationId: location?.uuid,
    //       };
    //     });
    //   })
    // );
  }

  onClose(): void {
    this.clearItemID.emit();
  }
}
