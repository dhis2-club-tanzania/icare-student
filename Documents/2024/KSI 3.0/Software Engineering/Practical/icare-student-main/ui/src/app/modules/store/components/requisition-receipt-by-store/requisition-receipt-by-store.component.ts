import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatCheckboxChange } from "@angular/material/checkbox";
import * as _ from "lodash"

@Component({
  selector: "app-requisition-receipt-by-store",
  templateUrl: "./requisition-receipt-by-store.component.html",
  styleUrls: ["./requisition-receipt-by-store.component.scss"],
})
export class RequisitionReceiptByStoreComponent implements OnInit {
  @Input() requisitions: any[];
  @Input() currentStore: any;

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
}
