import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatCheckboxChange } from "@angular/material/checkbox";
import * as _ from "lodash"

@Component({
  selector: "app-issuing-stock-by-store",
  templateUrl: "./issuing-stock-by-store.component.html",
  styleUrls: ["./issuing-stock-by-store.component.scss"],
})
export class IssuingStockByStoreComponent implements OnInit {
  @Input() issuingStock: any;
  @Input() currentStore: any;

  @Output() rejectRequest: EventEmitter<any> = new EventEmitter();
  @Output() issueRequest: EventEmitter<any> = new EventEmitter();
  @Output() selectionChange: EventEmitter<any> = new EventEmitter();
  selectedIssues: any = {};
  issuingByLocationAndDate: any;
  issuingobjectkeys: any[];

  constructor() {}

  ngOnInit(): void {
    this.issuingByLocationAndDate = this.issuingStock?.reduce(
      (store, issue) => ({
        ...store,
        [`${issue?.requestingLocation?.name}/${this.dateStruct(
          issue?.requestDate
        )}`]:
          `${issue?.requestingLocation?.name}/${this.dateStruct(
            issue?.requestDate
          )}` in store
            ? store[
                `${issue?.requestingLocation?.name}/${this.dateStruct(
                  issue?.requestDate
                )}`
              ].concat(issue)
            : [issue],
      }),
      []
    );

    const keys = Object.keys(this.issuingByLocationAndDate);
    this.issuingobjectkeys = keys.map((key) => {
      let split = key.split("/");
      return {
        requestingLocation: split[0],
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

  onReject(e: Event, issue: any) {
    e.stopPropagation();
    this.rejectRequest.emit(issue);
  }

  onIssue(e, issue, currentStore) {
    e.stopPropagation();
    this.issueRequest.emit({ issue: issue, currentStore: currentStore });
  }

  getSelection(event: MatCheckboxChange, issue: any): void {
    this.selectionChange.emit({event: event, issue: issue});
  }

  get selectedIssuesCount(): number {
    return this.selectedIssues ? Object.keys(this.selectedIssues)?.length : 0;
  }
}
