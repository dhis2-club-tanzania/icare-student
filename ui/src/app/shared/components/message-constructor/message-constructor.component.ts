import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { Observable, of } from "rxjs";
import { constructMessagesForDrugs } from "src/app/core";
import { OrdersService } from "../../resources/order/services/orders.service";

@Component({
  selector: "app-message-constructor",
  templateUrl: "./message-constructor.component.html",
  styleUrls: ["./message-constructor.component.scss"],
})
export class MessageConstructorComponent implements OnInit {
  @Input() data: any;
  @Input() durationUnitsConceptUuid: string;
  @Input() patientPhoneAttribute: string;
  @Output() constructedMessages: EventEmitter<any> = new EventEmitter<any>();
  selectedDateTime: any;
  numberOfDays: number;
  selectedFrequency: any;
  doseInfo: string;
  durationUnits$: Observable<any>;
  orderFrequencies$: Observable<any>;
  allFrequencies: any[];
  messages: any[];
  constructor(private orderService: OrdersService) {}

  ngOnInit(): void {
    this.data = {
      ...this.data,
      patientPhoneAttribute: this.patientPhoneAttribute,
    };
    this.orderFrequencies$ = this.orderService.getOrdersFrequencies();
    this.orderFrequencies$.subscribe((response) => {
      if (response) {
        this.allFrequencies = response;
      }
    });
  }

  searchItem(event, frequencies): void {
    this.orderFrequencies$ = of(
      frequencies.filter(
        (option) =>
          option?.display.toLowerCase().indexOf(event.target.value) > -1
      )
    );
  }

  getSelectedItemFromOption(event: Event, selectedItem, itemType): void {
    event.stopPropagation();
    this.selectedFrequency = selectedItem;
    this.messages = constructMessagesForDrugs(
      this.data,
      this.numberOfDays,
      this.selectedFrequency,
      this.doseInfo,
      this.selectedDateTime
    );
    this.constructedMessages.emit(this.messages);
  }

  onModelChange(event, key, selectedDateTime): void {
    this.selectedDateTime = selectedDateTime;
    this.messages = constructMessagesForDrugs(
      this.data,
      this.numberOfDays,
      this.selectedFrequency,
      this.doseInfo,
      this.selectedDateTime
    );
    this.constructedMessages.emit(this.messages);
  }

  getNumberOfDays(event: Event, days): void {
    this.numberOfDays = days;
    this.messages = constructMessagesForDrugs(
      this.data,
      this.numberOfDays,
      this.selectedFrequency,
      this.doseInfo,
      this.selectedDateTime
    );
    this.constructedMessages.emit(this.messages);
  }

  getDoseInfo(event: Event, doseInfo): void {
    this.doseInfo = doseInfo;
    this.messages = constructMessagesForDrugs(
      this.data,
      this.numberOfDays,
      this.selectedFrequency,
      this.doseInfo,
      this.selectedDateTime
    );
    this.constructedMessages.emit(this.messages);
  }
}
