import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatCheckboxChange } from "@angular/material/checkbox";
import * as _ from "lodash"

@Component({
  selector: "app-requisition-by-store",
  templateUrl: "./requisition-by-store.component.html",
  styleUrls: ["./requisition-by-store.component.scss"],
})
export class RequisitionByStoreComponent implements OnInit {
  @Input() requisitions: any[];
  @Input() currentStore: any;

  @Output() cancelRequisition: EventEmitter<any> = new EventEmitter();
  @Output() receiveRequisition: EventEmitter<any> = new EventEmitter();
  @Output() rejectRequisition: EventEmitter<any> = new EventEmitter();
  selectedIssues: any = {};
  requisitionByStoreAndDate: any;
  requisitionObjectkeys: any[];

  constructor() {}

  ngOnInit(): void {
    this.requisitionByStoreAndDate = this.requisitions?.reduce(
      (store, requisition) => ({
        ...store,
        [`${requisition?.targetStore?.name}/${this.dateStruct(
          requisition?.created
        )}`]:
          `${requisition?.targetStore?.name}/${this.dateStruct(
            requisition?.created
          )}` in store
            ? store[
                `${requisition?.targetStore?.name}/${this.dateStruct(
                  requisition?.created
                )}`
              ].concat(requisition)
            : [requisition],
      }),
      []
    );

    const keys = Object.keys(this.requisitionByStoreAndDate);
    this.requisitionObjectkeys = keys.map((key) => {
      let split = key.split("/");
      return {
        targetStore: split[0],
        date: split[1],
        searchKey: key,
      };
    });
  }

  dateStruct(date): any {
    let newDate = new Date(date);
    let month =
      (newDate.getMonth() + 1).toString().length > 1
        ? newDate.getMonth() + 1
        : `0${newDate.getMonth() + 1}`;
    let day =
      newDate.getDate().toString().length > 1
        ? newDate.getDate()
        : `0${newDate.getDate()}`;
    return `${day}-${month}-${newDate.getFullYear()}`;
  }

  onRejectRequisition(e: Event, requisition: any) {
    e.stopPropagation();
    this.rejectRequisition.emit({ event: e, requisition: requisition });
  }

  onCancelRequisition(event, requestId) {
    this.cancelRequisition.emit({ event: event, id: requestId });
  }
  onReceiveRequisition($vent, requisition) {
    this.receiveRequisition.emit({ event: event, requisition: requisition });
  }

  get selectedIssuesCount(): number {
    return this.selectedIssues ? Object.keys(this.selectedIssues)?.length : 0;
  }
}
