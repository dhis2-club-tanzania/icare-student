import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSelectChange } from "@angular/material/select";
import { select, Store } from "@ngrx/store";
import { IssuingObject } from "src/app/shared/resources/store/models/issuing.model";
import { IssuingService } from "src/app/shared/resources/store/services/issuing.service";
import { orderBy, flatten, omit } from "lodash";
import { Observable, zip } from "rxjs";
import { map, tap } from "rxjs/operators";
import { LocationGet } from "src/app/shared/resources/openmrs";
import { loadLocationsByTagName } from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import { getStoreLocations } from "src/app/store/selectors";
import { ConfirmRequisitionsModalComponent } from "../../modals/confirm-requisitions-modal/confirm-requisitions-modal.component";
import { IssuingFormComponent } from "../../modals/issuing-form/issuing-form.component";
import { RequestCancelComponent } from "../../modals/request-cancel/request-cancel.component";
import { RequisitionService } from "src/app/shared/resources/store/services/requisition.service";
import { SharedConfirmationComponent } from "src/app/shared/components/shared-confirmation/shared-confirmation.component";

@Component({
  selector: "app-issuing",
  templateUrl: "./issuing.component.html",
  styleUrls: ["./issuing.component.scss"],
})
export class IssuingComponent implements OnInit {
  @Input() currentLocation: any;

  issuingList$: Observable<IssuingObject[]>;
  loadingIssuingList$: Observable<boolean>;
  currentStore$: Observable<LocationGet>;
  stores$: Observable<any>;
  requestingLocation: any;
  selectedItems: any = {};
  errors: any[];
  page: number = 1;
  pageSize: number = 50;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  pager: any;
  statuses: string[] = ["", "PENDING", "CANCELLED", "REJECTED", "ISSUED"];
  selectedStatus: string;
  viewIssueItems: string;
  loadingIssues: boolean;

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private issuingService: IssuingService,
    private requisitionService: RequisitionService
  ) {
    store.dispatch(loadLocationsByTagName({ tagName: "Store" }));
    // store.dispatch(loadIssuings());
  }

  ngOnInit() {
    // this.issuingList$ = this.store.pipe(select(getAllIssuings));
    // this.loadingIssuingList$ = this.store.pipe(select(getIssuingLoadingState));
    // this.issuingList$ = this.store.pipe(select(getAllIssuings));
    this.getAllIssuing();
    // this.loadingIssuingList$ = this.store.pipe(select(getIssuingLoadingState));
    this.stores$ = this.store.pipe(select(getStoreLocations));
  }

  onIssue(e: any, issue?: any, currentStore?: LocationGet): void {
    const item = e?.item;
    currentStore = this.currentLocation;
    const dialog = this.dialog.open(IssuingFormComponent, {
      width: "30%",
      panelClass: "custom-dialog-container",
      data: { item: item, issue: issue, currentStore: currentStore },
    });

    dialog.afterClosed().subscribe((result) => {
      if (result?.issueInput) {
        // this.store.dispatch(
        //   issueRequest({ id: issue.id, issueInput: result.issueInput })
        // );
        this.issuingService
          .issueRequest(result.issueInput)
          .subscribe((response) => {
            if (response) {
              this.getAllIssuing();
            }
            if (response?.error && response?.message) {
              this.errors = [
                ...this.errors,
                {
                  error: {},
                },
              ];
            }
          });
      }
    });
  }

  getSelection(event: any): void {
    const item = event?.item;

    event = event?.event;
    if (event?.checked) {
      this.selectedItems[item?.uuid] = item;
    } else {
      let newSelectedItems: any;
      Object.keys(this.selectedItems).forEach((uuid) => {
        if (uuid === item?.uuid) {
          newSelectedItems = omit(this.selectedItems, uuid);
        }
      });
      this.selectedItems = newSelectedItems;
    }
  }

  getSelectedStore(event: MatSelectChange): void {
    this.requestingLocation = event?.value;
    this.getAllIssuing();
  }

  getAllIssuing(): void {
    this.loadingIssues = true
    this.issuingList$ = this.issuingService
      .getIssuings(
        this.currentLocation?.id,
        this.requestingLocation?.uuid || undefined,
        this.page,
        this.pageSize,
        this.selectedStatus,
        "DESC"
      )
      ?.pipe(
        map((response) => {
          this.pager = response?.pager;
          this.loadingIssues = false;
          return response?.issuings;
        })
      );
  }

  onReject(item: any, issueSelected?: any): void {
    // e.stopPropagation();
    const issue = issueSelected;
    const issueItem = item;
    const dialogToConfirmRejection = this.dialog.open(RequestCancelComponent, {
      width: "25%",
      panelClass: "custom-dialog-container",
      data: "item",
    });

    dialogToConfirmRejection.afterClosed().subscribe((result) => {
      if (result) {
        if (result?.confirmed) {
          const ItemObject = {
            ...item,
            requisitionItemStatuses: [
              {
                status: "REJECTED",
                remarks: result?.reason
              }
            ]
          };

          this.requisitionService
            .updateRequisitionItem(item?.uuid, ItemObject)
            .pipe(
              tap((response) => {
                this.getAllIssuing();
              })
            )
            .subscribe();
        }
      }
    });
  }

  getBatchsNotExpired(batches): any {
    return orderBy(
      batches?.filter(
        (batch) => Number(batch?.quantity) > 0 && batch?.expiryDate > Date.now()
      ),
      ["expiryDate"],
      ["asc"]
    );
  }

  issueAllSelected(event: Event, issue: any): void {
    event.stopPropagation();
    let itemsToIssue = [];
    Object.keys(this.selectedItems).forEach((key) => {
      itemsToIssue = [...itemsToIssue, this.selectedItems[key]];
    });
    this.dialog
      .open(ConfirmRequisitionsModalComponent, {
        width: "20%",
        data: {
          items: itemsToIssue,
          issue: issue
        }
      })
      .afterClosed()
      .subscribe((requisitionData) => {
        const items = requisitionData?.requisitions?.items;
        const nonExpiredBatches = this.getBatchsNotExpired(
          flatten(
            requisitionData?.stockStatus.map(
              (stockStatus) => stockStatus?.batches
            )
          )
        );

        if (items) {
          zip(
            ...items.map((item) => {
                // Determine all batches eligible to match the requested quantity
                const batchesForThisItem = nonExpiredBatches.filter((batch) => batch?.item?.uuid === item?.item?.uuid) || [];
                let eligibleBatches = [];
                const quantityToIssue = Number(item?.quantity);
                let eligibleToIssue = 0;
                let count = 0;
                while (
                  batchesForThisItem?.length > 0 &&
                  quantityToIssue > eligibleToIssue
                ) {
                  const toIssue =
                    quantityToIssue - eligibleToIssue >
                    Number(batchesForThisItem[count]?.quantity)
                      ? Number(batchesForThisItem[count]?.quantity)
                      : quantityToIssue - eligibleToIssue;
                  eligibleBatches = [
                    ...eligibleBatches,
                    {
                      ...batchesForThisItem[count],
                      ...item,
                      toIssue: toIssue,
                    },
                  ];
                  eligibleToIssue =
                    eligibleToIssue +
                    Number(batchesForThisItem[count]?.quantity);
                  count++;
                }
              const issueInput = {
                requisitionUuid: issue?.uuid,
                issuedLocationUuid: issue?.requestingLocation.uuid,
                issuingLocationUuid: issue?.requestedLocation.uuid,
                issueItems: eligibleBatches.map((batch) => {
                  return {
                    itemUuid: batch?.item?.uuid,
                    quantity: batch?.toIssue,
                    batch: batch?.batch,
                    expiryDate: new Date(batch?.expiryDate),
                  };
                }),
              };
              return this.issuingService.issueItems(issueInput).pipe(
                map((response) => {
                  return response;
                })
              );
            })
          ).subscribe((response: any) => {
            if (response) {
              if(!response?.error){
                this.selectedItems = {};
                this.getAllIssuing();
              }
            }
          });
        }
      });
  }
  
  rejectAllSelected(event: Event, issue: any): void {
    event.stopPropagation();
    let itemsToReject = [];
    Object.keys(this.selectedItems).forEach((key) => {
      itemsToReject = [...itemsToReject, this.selectedItems[key]];
    });
    this.dialog
      .open(SharedConfirmationComponent, {
        width: "20%",
        data: {
          modalTitle: `Multiple Items Rejection`,
          modalMessage: `Are you sure you want to reject all selected items?`,
          showRemarksInput: true,
          confirmationButtonText: "Reject All",
        },
      })
      .afterClosed()
      .subscribe((results) => {
        if (results?.confirmed) {
          if (itemsToReject?.length) {
            zip(
              ...itemsToReject.map((item) => {
                const ItemObject = {
                  ...item,
                  requisitionItemStatuses: [
                    {
                      status: "REJECTED",
                      remarks: results?.reason
                    }
                  ]
                }
                return this.requisitionService
                  .updateRequisitionItem(item?.uuid, ItemObject)
              })
            ).subscribe((response: any) => {
              if (response) {
                if(!response?.error){
                  this.selectedItems = {};
                  this.getAllIssuing();
                }
              }
            });
          }
        } 

      });
  }

  onPageChange(event) {
    this.page =
      event.pageIndex - this.page >= 0 ? this.page + 1 : this.page - 1;
    this.pageSize = Number(event?.pageSize);
    this.getAllIssuing();
  }

  onSelectStatus(e) {
    this.selectedStatus = e?.value;
    this.getAllIssuing();
  }

  get selectedIssuesCount(): number {
    return this.selectedItems ? Object.keys(this.selectedItems)?.length : 0;
  }

  onViewIssueItems(issueUuid: string) {
    if (this.viewIssueItems === issueUuid) {
      this.viewIssueItems = undefined;
    } else {
      this.viewIssueItems = issueUuid;
    }
  }

  // onIssue(e: any, issue?: IssuingObject, currentStore?: LocationGet): void {
  //   issue = issue ? issue : e?.issue;
  //   currentStore = currentStore ? currentStore : e?.currentStore;
  //   const dialog = this.dialog.open(IssuingFormComponent, {
  //     width: "30%",
  //     panelClass: "custom-dialog-container",
  //     data: { issue, currentStore },
  //   });

  //   dialog.afterClosed().subscribe((result) => {
  //     if (result?.issueInput) {
  //       // this.store.dispatch(
  //       //   issueRequest({ id: issue.id, issueInput: result.issueInput })
  //       // );
  //       this.issuingService
  //         .issueRequest(result.issueInput)
  //         .subscribe((response) => {
  //           if (response) {
  //             this.getAllIssuing();
  //           }
  //           if (response?.error && response?.message) {
  //             this.errors = [
  //               ...this.errors,
  //               {
  //                 error: {},
  //               },
  //             ];
  //           }
  //         });
  //     }
  //   });
  // }

  // onReject(e, issue?: IssuingObject): void {
  //   // e.stopPropagation();
  //   issue = issue ? issue : e;
  //   const dialogToConfirmRejection = this.dialog.open(RequestCancelComponent, {
  //     width: "25%",
  //     panelClass: "custom-dialog-container",
  //     data: "issue",
  //   });

  //   dialogToConfirmRejection.afterClosed().subscribe((result) => {
  //     if (result) {
  //       // this.store.dispatch(
  //       //   rejectRequisition({ id: issue.id, reason: result?.reason })
  //       // );
  //       const issueStatusInput = {
  //         issueUuid: issue?.id,
  //         status: "REJECTED",
  //         remarks: result?.reason,
  //       };
  //       this.issuingService
  //         .saveIssueStatus(issueStatusInput)
  //         .subscribe((response) => {
  //           if (response) {
  //             this.getAllIssuing();
  //           }
  //         });
  //     }
  //   });
  // }

  // issueAllSelected(event: Event, selectedItemsToIssue: any): void {
  //   event.stopPropagation();
  //   let itemsToIssue = [];
  //   Object.keys(selectedItemsToIssue).forEach((key) => {
  //     itemsToIssue = [...itemsToIssue, selectedItemsToIssue[key]];
  //   });
  //   const groupedRequisitions = groupBy(itemsToIssue, "requisitionUuid");

  //   this.dialog
  //     .open(ConfirmRequisitionsModalComponent, {
  //       width: "20%",
  //       data: groupedRequisitions,
  //     })
  //     .afterClosed()
  //     .subscribe((requisitionData) => {
  //       const groupedRequisitions = requisitionData?.requisitions;
  //       const nonExpiredBatches = this.getBatchsNotExpired(
  //         flatten(
  //           requisitionData?.stockStatus.map(
  //             (stockStatus) => stockStatus?.batches
  //           )
  //         )
  //       );

  //       if (groupedRequisitions) {
  //         zip(
  //           ...Object.keys(groupedRequisitions).map((key) => {
  //             const currentItemsToIssue = groupedRequisitions[key];
  //             // Create items to issue by batches
  //             const toIssueItemsByBatches = flatten(
  //               currentItemsToIssue.map((item) => {
  //                 // Determine all batches eligible to match the requested quantity
  //                 const batchesForThisItem =
  //                   nonExpiredBatches.filter(
  //                     (batch) => batch?.item?.uuid === item?.itemUuid
  //                   ) || [];
  //                 let eligibleBatches = [];
  //                 const quantityToIssue = Number(item?.quantityRequested);
  //                 let eligibleToIssue = 0;
  //                 let count = 0;
  //                 while (
  //                   batchesForThisItem?.length > 0 &&
  //                   quantityToIssue > eligibleToIssue
  //                 ) {
  //                   const toIssue =
  //                     quantityToIssue - eligibleToIssue >
  //                     Number(batchesForThisItem[count]?.quantity)
  //                       ? Number(batchesForThisItem[count]?.quantity)
  //                       : quantityToIssue - eligibleToIssue;
  //                   eligibleBatches = [
  //                     ...eligibleBatches,
  //                     {
  //                       ...batchesForThisItem[count],
  //                       ...item,
  //                       toIssue: toIssue,
  //                     },
  //                   ];
  //                   eligibleToIssue =
  //                     eligibleToIssue +
  //                     Number(batchesForThisItem[count]?.quantity);
  //                   count++;
  //                 }
  //                 return eligibleBatches;
  //               })
  //             );
  //             const issueInput = {
  //               requisitionUuid: key,
  //               issuedLocationUuid:
  //                 groupedRequisitions[key][0]?.requestingLocation.uuid,
  //               issuingLocationUuid:
  //                 groupedRequisitions[key][0].requestedLocation.uuid,
  //               issueItems: toIssueItemsByBatches.map((matchedItemToIssue) => {
  //                 // console.log("matchedItemToIssue", matchedItemToIssue);
  //                 return {
  //                   itemUuid: matchedItemToIssue?.itemUuid,
  //                   quantity: matchedItemToIssue?.toIssue,
  //                   batch: matchedItemToIssue?.batch,
  //                   expiryDate: new Date(matchedItemToIssue?.expiryDate),
  //                 };
  //               }),
  //             };
  //             return this.issuingService.issueRequest(issueInput).pipe(
  //               map((response) => {
  //                 return response;
  //               })
  //             );
  //           })
  //         ).subscribe((response) => {
  //           if (response) {
  //             this.selectedIssues = {};
  //             this.getAllIssuing();
  //           }
  //         });
  //       }
  //     });
  // }
  // getSelection(event: any, issue?: any): void {
  //   issue = event?.issue ? event?.issue : issue;
  //   event = event?.event ? event?.event : event;
  //   if (event?.checked) {
  //     this.selectedIssues[issue?.id] = issue;
  //   } else {
  //     let newSelectedIssues: any;
  //     Object.keys(this.selectedIssues).forEach((id) => {
  //       if (id === issue?.id) {
  //         newSelectedIssues = omit(this.selectedIssues, id);
  //       }
  //     });
  //     this.selectedIssues = newSelectedIssues;
  //   }
  // }
}
