import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSelectChange } from "@angular/material/select";
import { select, Store } from "@ngrx/store";
import { IssuingObject } from "src/app/shared/resources/store/models/issuing.model";
import { IssuingService } from "src/app/shared/resources/store/services/issuing.service";
import { orderBy, flatten, omit } from "lodash";
import { Observable, zip, Subscription } from "rxjs";
import { map, tap } from "rxjs/operators";
import { LocationGet } from "src/app/shared/resources/openmrs";
import { loadLocationsByTagName } from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import { getParentLocation, getStoreLocations } from "src/app/store/selectors";
import { RequisitionService } from "src/app/shared/resources/store/services/requisition.service";
import { SharedConfirmationComponent } from "src/app/shared/components/shared-confirmation/shared-confirmation.component";
import { IssuingFormComponent } from "../../store-modals/issuing-form/issuing-form.component";
import { RequestCancelComponent } from "../../store-modals/request-cancel/request-cancel.component";
import { ConfirmRequisitionsModalComponent } from "../../store-modals/confirm-requisitions-modal/confirm-requisitions-modal.component";
import { getCurrentUserDetails } from "src/app/store/selectors/current-user.selectors";
import { getFilteredIssueItems } from "../../helpers/issuings.helper";
import { formatDateToString } from "../../helpers/format-date.helper";

@Component({
  selector: "app-issuing",
  templateUrl: "./issuing.component.html",
  styleUrls: ["./issuing.component.scss"],
})
export class IssuingComponent implements OnInit {
  @Input() currentLocation: any;

  // subscription: Subscription;
  issuingList$: Observable<IssuingObject[]>;
  loadingIssuingList$: Observable<boolean>;
  currentStore$: Observable<LocationGet>;
  stores$: Observable<any>;
  requestingLocation: any;
  selectedItems: any = {};
  errors: any[];
  page: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  pager: any;
  statuses: string[] = ["", "PENDING", "CANCELLED", "REJECTED", "ISSUED"];
  selectedStatus: string;
  viewIssueItems: string;
  loadingIssues: boolean;
  q: string;
  startDate: Date;
  endDate: Date;
  specificRequisition$: Observable<any>;
  facilityDetails$: Observable<any>;
  currentUser$: Observable<any>;

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
    this.facilityDetails$ = this.store.select(getParentLocation);
    this.currentUser$ = this.store.select(getCurrentUserDetails);
  }
  // ngOnDestroy(): void {
  //   this.subscription.unsubscribe();
  // }
  onGetSearchingText(q: string): void {
    this.q = q;
    this.getAllIssuing();
  }

  onGetEndDate(endDate: Date): void {
    this.endDate = endDate;
    this.getAllIssuing();
  }

  onGetStartDate(startDate: Date): void {
    this.startDate = startDate;
    this.getAllIssuing();
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
    this.loadingIssues = true;
    this.issuingList$ = this.issuingService
      .getIssuings(
        this.currentLocation?.id,
        this.requestingLocation?.uuid || undefined,
        this.page,
        this.pageSize,
        this.selectedStatus,
        "DESC",
        {
          q: this.q,
          startDate: this.startDate,
          endDate: this.endDate,
        }
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
                remarks: result?.reason,
              },
            ],
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
          issue: issue,
        },
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
              const batchesForThisItem =
                nonExpiredBatches.filter(
                  (batch) => batch?.item?.uuid === item?.item?.uuid
                ) || [];
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
                  eligibleToIssue + Number(batchesForThisItem[count]?.quantity);
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
              if (!response?.error) {
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
        minWidth: "20%",
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
                      remarks: results?.reason,
                    },
                  ],
                };
                return this.requisitionService.updateRequisitionItem(
                  item?.uuid,
                  ItemObject
                );
              })
            ).subscribe((response: any) => {
              if (response) {
                if (!response?.error) {
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

  onPrint(e: Event, issue: any, facilityDetails: any, currentUser: any) {
    let itemsToPrint: any;
    // this.specificRequisition$ =
    this.requisitionService
      .getRequisitionByUuid(issue?.uuid)
      .pipe(
        map((response) => {
          const items = getFilteredIssueItems(
            response?.requisitionItems,
            response?.issues
          );
          return { ...response, items: items };
        })
      )
      .subscribe((response) => {
        itemsToPrint = response.items;
        let contents: string;
        let printingDate = formatDateToString(new Date());
        let issueDate = formatDateToString(new Date(issue?.created));

        const frame1: any = document.createElement("iframe");
        frame1.name = "frame3";
        frame1.style.position = "absolute";
        frame1.style.width = "100%";
        frame1.style.top = "-1000000px";
        document.body.appendChild(frame1);

        var frameDoc = frame1.contentWindow
          ? frame1.contentWindow
          : frame1.contentDocument.document
          ? frame1.contentDocument.document
          : frame1.contentDocument;

        frameDoc.document.open();

        frameDoc.document.write(`
         <html>
          <head>
            <style>
                @page { size: auto;  margin: 0mm; }

                body {
                  padding: 30px;
                  margin: 0 auto;
                  width: 150mm;
                }

                #top .logo img{
                  //float: left;
                  height: 100px;
                  width: 100px;
                  background-size: 100px 100px;
                }
                .info h2 {
                  font-size: 1.3em;
                }
                h3 {
                  font-size: 1em;
                }
                h5 {
                  font-size: .7em;
                }
                p {
                  font-size: .7em;
                }
                #table {
                  font-family: Arial, Helvetica, sans-serif;
                  border-collapse: collapse;
                  width: 100%;
                  background-color: #000;
                }
                #table td, #table  th {
                  border: 1px solid #ddd;
                  padding: 5px;
                }

                #table tbody tr:nth-child(even){
                  background-color: #f2f2f2;
                }

                #table thead tr th {
                  padding-top:6px;
                  padding-bottom: 6px;
                  text-align: left;
                  background-color: #cecece;
                  font-size: .7em;
                }
                tbody tr td {
                  font-size: .7em;
                }
                .footer {
                  margin-top:50px
                }
                .footer .userDetails .signature {
                  margin-top: 20px;
                }
            </style>
          </head>
          <body>
           <div id="printOut">
          `);

        // Change image from base64 then replace some text with empty string to get an image

        let image = "";
        let header = "";
        let subHeader = "";

        facilityDetails?.attributes?.map((attribute) => {
          let attributeTypeName =
            attribute && attribute.attributeType
              ? attribute?.attributeType?.name.toLowerCase()
              : "";
          if (attributeTypeName === "logo") {
            image = attribute?.value;
          }
          header = attributeTypeName === "header" ? attribute?.value : "";
          subHeader =
            attributeTypeName === "sub header" ? attribute?.value : "";
        });

        frameDoc.document.write(`

        <center id="top">
           <div class="info">
            <h2>${header.length > 0 ? header : facilityDetails.display} </h2>
            </div>
          <div class="logo">
            <img src="${image}" alt="Facility's Logo">
          </div>

          <div class="info">
            <h2>${
              subHeader.length > 0 ? subHeader : facilityDetails.description
            } </h2>
            <h3>P.O Box ${facilityDetails.postalCode} ${
          facilityDetails.stateProvince
        }</h3>
            <h3>${facilityDetails.country}</h3>
          </div>
          <!--End Info-->
        </center>
        <!--End Document top-->

        <div id="mid">
          <div class="patient-info">
            <p>
                <b>Issue Number:</b>  ${issue.code}</br>
            </p>
            <p>
                <b>Issuig Store:</b> ${this.currentLocation?.display}</br>
            </p>
            <p>
               <b> Requesting Store:</b> ${
                 issue?.requestingLocation?.display
               }</br>
            </p>
            <p>
                <b>Requested on:</b> ${issueDate}</br>
            </p>
            <p>
                <b>Status:</b> ${
                  issue?.requisitionStatuses[
                    issue?.requisitionStatuses?.length - 1
                  ]?.status
                    ? issue?.requisitionStatuses[
                        issue?.requisitionStatuses?.length - 1
                      ]?.status
                    : "DRAFT"
                }</br>
                  
            </p>
          </div>
        </div>`);

        //For paid items
        if (itemsToPrint.length > 0) {
          let title = "items";
          frameDoc.document.write(`
          <div>
            <h5>${title}</h5>
          </div>
          <table id="table">
            <thead>
              <tr>
                <th>SN</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Batch</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>`);

          itemsToPrint.forEach((stock, index) => {
            let currentIndex = index + 1;
            // let paymentDate = new Date(payment.created);
            // Date to string
            // let date_paid = formatDateToString(paymentDate);

            // let date_paid = `${
            //   paymentDate.getDate().toString().length > 1
            //     ? paymentDate.getDate()
            //     : "0" + paymentDate.getDate()
            // }-${
            //   paymentDate.getMonth().toString().length > 1
            //     ? paymentDate.getMonth() + 1
            //     : "0" + paymentDate.getMonth() + 1
            // }-${paymentDate.getFullYear()}`;
            contents = `
                  <tr>
                    <td>${currentIndex}</td>
                    <td>${stock?.item.display}</td>
                    <td>${stock?.quantity}</td>
                    <td>${stock?.batch}</td>
                    <td>${stock?.status}</td>
                  </tr>`;

            frameDoc.document.write(contents);
          });

          frameDoc.document.write(`
            </tbody>
          </table>`);
        }

        frameDoc.document.write(`
            <div class="footer">
              <div class="userDetails">
                <p class="name">Printed By: ${currentUser?.person?.display}</p>
                <p class="signature">Signature : ..............................</p>
              </div>

              <div class=""printDate>
                <p>Printed on: ${printingDate}</p>
              </div>
            </div>
          </div>
        </body>
      </html>`);

        frameDoc.document.close();

        setTimeout(function () {
          window.frames["frame3"].focus();
          window.frames["frame3"].print();
          document.body.removeChild(frame1);
        }, 500);
      });
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
