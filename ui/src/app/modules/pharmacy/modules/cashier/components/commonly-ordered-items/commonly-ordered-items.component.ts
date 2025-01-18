import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Observable } from "rxjs";
import { OrdersService } from "src/app/shared/resources/order/services/orders.service";

@Component({
  selector: "app-commonly-ordered-items",
  templateUrl: "./commonly-ordered-items.component.html",
  styleUrls: ["./commonly-ordered-items.component.scss"],
})
export class CommonlyOrderedItemsComponent implements OnInit {
  @Input() currentLocation: any;
  @Output() selectedDrug: EventEmitter<any> = new EventEmitter<any>();
  commonlyOrderedItems$: Observable<any[]>;
  parameters: string[] = [];
  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.parameters = [
      ...this.parameters,
      "locationUuid=" + this.currentLocation?.uuid,
    ];
    this.commonlyOrderedItems$ = this.ordersService.getCommonlyOrderedItems(
      this.parameters
    );
  }

  onSelectDrug(event: Event, selectedDrug: any): void {
    event.stopPropagation();
    if (selectedDrug?.drug?.quantity > 0) this.selectedDrug.emit(selectedDrug);
  }
}
