import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { getFilteredIssueItems } from "src/app/shared/helpers/issuings.helper";
import { RequisitionService } from "src/app/shared/resources/store/services/requisition.service";

@Component({
  selector: "app-issue-items",
  templateUrl: "./issue-items.component.html",
  styleUrls: ["./issue-items.component.scss"],
})
export class IssueItemsComponent implements OnInit {
  @Input() issue: any;
  @Input() currentLocation: any;
  @Output() reloadList: EventEmitter<any> = new EventEmitter();

  @Output() rejectRequest: EventEmitter<any> = new EventEmitter();
  @Output() issueRequest: EventEmitter<any> = new EventEmitter();
  @Output() selectionChange: EventEmitter<any> = new EventEmitter();

  errors: any[];
  specificRequisition$: Observable<any>;
  loadingRequisition: boolean = false;
  selectedItems: any = {};
  selectAllItems: boolean = false;
  markAll: boolean = false;

  constructor(
    private requisitionService: RequisitionService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadingRequisition = true;
    this.specificRequisition$ = this.requisitionService
      .getRequisitionByUuid(this.issue?.uuid)
      .pipe(
        map((response) => {
          const items = getFilteredIssueItems(
            response?.requisitionItems,
            response?.issues
          );
          this.loadingRequisition = false;
          this.markAll =
            items?.filter((item) => item?.status === "PENDING")?.length > 0;
          return {
            ...response,
            items: items,
          };
        })
      );
  }

  onReject(e: Event, item: any) {
    e.stopPropagation();
    this.rejectRequest.emit(item);
  }

  onIssue(e, item: any) {
    e.stopPropagation();
    this.issueRequest.emit({
      item: item,
      currentStore: this.currentLocation,
    });
  }

  getSelection(event: MatCheckboxChange, item: any): void {
    if (!event.checked) {
      this.selectAllItems = false;
    }
    this.selectionChange.emit({ event: event, item: item });
  }

  selectAll(e: MatCheckboxChange, items: any[]) {
    if (e?.checked) {
      items
        ?.filter((item) => item?.status === "PENDING")
        ?.forEach((item) => {
          this.selectedItems = {
            ...this.selectedItems,
            [item]: item,
          };
          this.selectionChange.emit({ event: e, item: item });
        });
      this.selectAllItems = true;
    } else {
      this.selectAllItems = false;
      this.selectedItems = {};
      items.forEach((item) => {
        this.selectionChange.emit({ event: e, item: item });
      });
    }
  }

  get selectedIssuesCount(): number {
    return this.selectedItems ? Object.keys(this.selectedItems)?.length : 0;
  }
}
