import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { select, Store } from "@ngrx/store";
import { map } from "rxjs/operators";
import { Observable, Subscription, of, zip } from "rxjs";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { RequisitionObject } from "src/app/shared/resources/store/models/requisition.model";
import { RequisitionService } from "src/app/shared/resources/store/services/requisition.service";
import { omit } from "lodash";
import { AppState } from "src/app/store/reducers";
import { getParentLocation, getStoreLocations } from "src/app/store/selectors";
import { getAllStockableItems } from "src/app/store/selectors/pricing-item.selectors";
import { SharedConfirmationComponent } from "src/app/shared/components/shared-confirmation/shared-confirmation.component";
import {
  dateToISOStringMidnight,
  formatDateToString,
} from "src/app/shared/helpers/format-date.helper";
import { getCurrentUserDetails } from "src/app/store/selectors/current-user.selectors";
import { getFilterIssuedItemsInRequisitions } from "src/app/shared/helpers/requisitions.helper";

@Component({
  selector: "app-requisition",
  templateUrl: "./requisition.component.html",
  styleUrls: ["./requisition.component.scss"],
})
export class RequisitionComponent implements OnInit {
  @Input() currentLocation: any;

  // subscription: Subscription;
  requisitions$: Observable<RequisitionObject[]>;
  loadingRequisitions$: Observable<boolean>;
  stores$: Observable<any>;
  stockableItems$: Observable<any>;
  currentStore$: Observable<any>;
  referenceTagsThatCanRequestFromMainStoreConfigs$: Observable<any>;
  referenceTagsThatCanRequestFromPharmacyConfigs$: Observable<any>;
  pharmacyLocationTagUuid$: Observable<any>;
  mainStoreLocationTagUuid$: Observable<any>;
  loadedRequisitions: boolean;
  searchTerm: any;
  requisitions: RequisitionObject[];
  storedRequisitions: RequisitionObject[];
  page: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  pager: any;
  statuses: string[] = [
    "",
    "DRAFT",
    "PENDING",
    "ISSUED",
    "CANCELLED",
    "REJECTED",
    "RECEIVED",
  ];
  selectedStatus: string;
  showRequisitionForm: boolean;
  requisitionCodeFormat$: Observable<any>;
  viewRequisitionItems: string;
  selectedItems: any = {};
  existingRequisition: any;
  q: string;
  startDate: Date;
  endDate: Date;
  facilityDetails$: Observable<any>;
  currentUser$: Observable<any>;

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private systemSettingsService: SystemSettingsService,
    private requisitionService: RequisitionService
  ) {}

  ngOnInit() {
    this.referenceTagsThatCanRequestFromMainStoreConfigs$ =
      this.systemSettingsService.getSystemSettingsMatchingAKey(
        `iCare.store.mappings.canRequestFromMainStore.LocationTagsUuid`
      );
    this.referenceTagsThatCanRequestFromPharmacyConfigs$ =
      this.systemSettingsService.getSystemSettingsMatchingAKey(
        `iCare.store.mappings.canRequestFromPharmacyStore.LocationTagsUuid`
      );

    this.mainStoreLocationTagUuid$ =
      this.systemSettingsService.getSystemSettingsByKey(
        `iCare.store.settings.mainStore.locationTagUuid`
      );
    this.pharmacyLocationTagUuid$ =
      this.systemSettingsService.getSystemSettingsByKey(
        `iCare.store.settings.pharmacy.locationTagUuid`
      );

    this.requisitionCodeFormat$ =
      this.systemSettingsService.getSystemSettingsDetailsByKey(
        `iCare.store.requisition.id.format`
      );
    this.getAllRequisitions();
    this.currentStore$ = of(this.currentLocation);
    this.stores$ = this.store.pipe(select(getStoreLocations));
    this.stockableItems$ = this.store.pipe(select(getAllStockableItems));
    this.facilityDetails$ = this.store.select(getParentLocation);
    this.currentUser$ = this.store.select(getCurrentUserDetails);
  }

  // ngOnDestroy(): void {
  //   this.subscription.unsubscribe();
  // }

  onGetSearchingText(q: string): void {
    this.q = q;
    this.getAllRequisitions();
  }

  onGetEndDate(endDate: Date): void {
    this.endDate = endDate;
    this.getAllRequisitions();
  }

  onGetStartDate(startDate: Date): void {
    this.startDate = startDate;
    this.getAllRequisitions();
  }

  getAllRequisitions(event?: any): void {
    this.loadedRequisitions = false;
    this.searchTerm = event ? event?.target?.value : "";
    this.requisitions$ = this.requisitionService
      .getRequisitions(
        this.currentLocation?.id,
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
      .pipe(
        map((requisitions) => {
          this.pager = requisitions?.pager;
          this.requisitions = requisitions?.requisitions;
          this.storedRequisitions = requisitions?.requisitions;
          this.loadedRequisitions = true;
          return requisitions;
        })
      );
  }

  onSearchRequisition(event?: any) {
    this.requisitions = undefined;
    this.loadedRequisitions = false;
    this.searchTerm = event ? event?.target?.value : "";
    setTimeout(() => {
      if (this.searchTerm?.length > 0) {
        this.requisitions = this.storedRequisitions.filter((requisition) => {
          if (
            requisition?.name
              ?.toLowerCase()
              .includes(this.searchTerm.toLowerCase())
          ) {
            return requisition;
          }
        });
      } else {
        this.requisitions = this.storedRequisitions;
      }
      this.loadedRequisitions = true;
    }, 200);
  }

  onNewRequest(e: Event, params: any): void {
    e.stopPropagation();
    this.showRequisitionForm = !this.showRequisitionForm;
    if (!this.showRequisitionForm) {
      this.getAllRequisitions();
    }

    // if (params) {
    //   const {
    //     currentStore,
    //     stockableItems,
    //     stores,
    //     mainStoreLocationTagUuid,
    //     pharmacyLocationTagUuid,
    //     referenceTagsThatCanRequestFromMainStoreConfigs,
    //     referenceTagsThatCanRequestFromPharmacyConfigs,
    //   } = params;
    //   const dialog = this.dialog.open(RequisitionFormComponent, {
    //     width: "25%",
    //     panelClass: "custom-dialog-container",
    //     data: {
    //       currentStore,
    //       items: stockableItems,
    //       stores,
    //       mainStoreLocationTagUuid,
    //       pharmacyLocationTagUuid,
    //       referenceTagsThatCanRequestFromMainStoreConfigs,
    //       referenceTagsThatCanRequestFromPharmacyConfigs,
    //     },
    //   });

    //   dialog
    //     .afterClosed()
    //     .subscribe((data: { requisitionInput: RequisitionInput }) => {
    //       if (data) {
    //         const { requisitionInput } = data;

    //         // this.store.dispatch(createRequest({ requisitionInput }));
    //         this.requisitionService
    //           .createRequest(requisitionInput)
    //           .subscribe((response) => {
    //             if (response) {
    //               this.getAllRequisition();
    //             }
    //           });
    //       }
    //     });
    // }
  }

  onUpdateRequisition(e: any, requisition: any) {
    this.showRequisitionForm = true;
    this.existingRequisition = requisition;
  }

  onSendRequisition(e: any, requisition: any) {
    e?.stopPropagation();
    const requisitionObject = {
      ...requisition,
      requisitionStatuses: [
        {
          status: "PENDING",
        },
      ],
    };
    this.requisitionService
      .updateRequisition(requisition?.uuid, requisitionObject)
      .subscribe((response) => {
        this.getAllRequisitions();
        localStorage.removeItem("availableRequisition");
      });
  }

  onDeleteRequisition(e: any, requisition: any) {
    e?.stopPropagation();
    this.dialog
      .open(SharedConfirmationComponent, {
        minWidth: "25%",
        data: {
          modalTitle: "Are you sure to delete this Requisition",
          modalMessage:
            "This action is irreversible. Please, click confirm to delete and click cancel to cancel deletion.",
        },
      })
      .afterClosed()
      .subscribe((data) => {
        if (data?.confirmed) {
          this.requisitionService
            .deleteRequisition(requisition?.uuid)
            .subscribe((response) => {
              localStorage.removeItem("availableRequisition");
              this.getAllRequisitions();
            });
        }
      });
  }

  receiveAllSelected(e: Event, requisition) {
    e?.stopPropagation();
    const issueItems = Object.keys(this.selectedItems)?.map((key) => {
      return {
        issue: this.selectedItems[key]?.issue,
        receivingLocation: {
          uuid: requisition?.requestingLocation?.uuid,
        },
        issueingLocation: {
          uuid: requisition?.requestedLocation?.uuid,
        },
        receiptItems: [
          {
            item: {
              uuid: this.selectedItems[key]?.item?.uuid,
            },
            quantity: this.selectedItems[key]?.quantity,
            batch: this.selectedItems[key]?.batch,
            expiryDate: dateToISOStringMidnight(
              new Date(this.selectedItems[key]?.expiryDate)
            ),
          },
        ],
      };
    });
    this.dialog
      .open(SharedConfirmationComponent, {
        minWidth: "40%",
        data: {
          modalTitle: "Confirm Multiple Receive",
          modalMessage: "Are you sure you want to receive all selected items?",
          showRemarksInput: false,
          confirmationButtonText: "Receive All",
        },
      })
      .afterClosed()
      .subscribe((issue) => {
        if (issue?.confirmed) {
          zip(
            ...issueItems?.map((issueItem) =>
              this.requisitionService.receiveIssueItem(issueItem)
            )
          ).subscribe((response) => {
            if (response) {
              this.selectedItems = {};
              this.getAllRequisitions();
            }
          });
        }
      });
  }

  onReceiveRequisition(e: any, requisition: any) {
    e?.stopPropagation();
    const requisitionObject = {
      ...requisition,
      requisitionStatuses: [
        {
          status: "RECEIVED",
        },
      ],
    };
    this.requisitionService
      .updateRequisition(requisition?.uuid, requisitionObject)
      .subscribe((response) => {
        this.getAllRequisitions();
      });
  }

  onRejectItem(e: any) {
    this.dialog
      .open(SharedConfirmationComponent, {
        minWidth: "40%",
        data: {
          modalTitle: "Confirm Issue Rejection",
          modalMessage: "Are you sure you want to reject this item?",
          showRemarksInput: true,
          confirmationButtonText: "Reject",
        },
      })
      .afterClosed()
      .subscribe((rejection) => {
        if (rejection?.confirmed) {
          const issueItemRejectedObject = {
            issueItem: {
              uuid: e?.item?.uuid,
            },
            status: "REJECTED",
            remarks: rejection?.remarks || "",
          };
          this.requisitionService
            .createIssueItemStatus(issueItemRejectedObject)
            .subscribe((response) => {
              // Add support to catch error
              if (response) {
                this.getAllRequisitions();
              }
            });
        }
      });
  }

  rejectAllSelected(e: Event) {
    this.dialog
      .open(SharedConfirmationComponent, {
        minWidth: "40%",
        data: {
          modalTitle: "Confirm Issues Rejection",
          modalMessage:
            "Are you sure you want to reject this all selected items?",
          showRemarksInput: true,
          confirmationButtonText: "Reject",
        },
      })
      .afterClosed()
      .subscribe((rejection) => {
        if (rejection?.confirmed) {
          const rejectionObjects = Object.keys(this.selectedItems)?.map(
            (key) => {
              return {
                issueItem: {
                  uuid: this.selectedItems[key]?.uuid,
                },
                status: "REJECTED",
                remarks: rejection?.remarks || "",
              };
            }
          );
          zip(
            ...rejectionObjects?.map((rejectionObject) => {
              return this.requisitionService.createIssueItemStatus(
                rejectionObject
              );
            })
          ).subscribe((response) => {
            // Add support to catch error
            if (response) {
              this.getAllRequisitions();
            }
          });
        }
      });
  }

  onReceiveItem(e: any, requisition?: any) {
    const issueReceiveObject = {
      issue: e?.item?.issue,
      receivingLocation: {
        uuid: requisition?.requestingLocation?.uuid,
      },
      issueingLocation: {
        uuid: requisition?.requestedLocation?.uuid,
      },
      receiptItems: [
        {
          item: {
            uuid: e?.item?.item?.uuid,
          },
          quantity: e?.item?.quantity,
          batch: e?.item?.batch,
          expiryDate: dateToISOStringMidnight(new Date(e?.item?.expiryDate)),
        },
      ],
    };

    this.requisitionService
      .receiveIssueItem(issueReceiveObject)
      .subscribe((response) => {
        // Add support to catch error
        if (response) {
          this.getAllRequisitions();
        }
      });
  }

  onRejectRequisition(e: any, requisition: any) {
    e?.stopPropagation();
    const requisitionObject = {
      ...requisition,
      requisitionStatuses: [
        {
          status: "REJECTED",
        },
      ],
    };
    this.requisitionService
      .updateRequisition(requisition?.uuid, requisitionObject)
      .subscribe((response) => {
        this.getAllRequisitions();
      });
  }

  onCancelRequisition(e: any, requisition: any) {
    e?.stopPropagation();
    const requisitionObject = {
      ...requisition,
      requisitionStatuses: [
        {
          status: "CANCELLED",
        },
      ],
    };
    this.requisitionService
      .updateRequisition(requisition?.uuid, requisitionObject)
      .subscribe((response) => {
        this.getAllRequisitions();
      });
  }

  // onCancelRequisition(e: any, id?: string): void {
  //   id = id ? id : e?.id;
  //   e = !e?.event ? e : e?.event;
  //   e.stopPropagation();

  //   const dialogToConfirmRejection = this.dialog.open(RequestCancelComponent, {
  //     width: "25%",
  //     panelClass: "custom-dialog-container",
  //     data: "request",
  //   });

  //   dialogToConfirmRejection.afterClosed().subscribe((result) => {
  //     //console.log('==> results :: ', result);
  //     if (result) {
  //       this.store.dispatch(
  //         cancelRequisition({ id: id, reason: result?.reason })
  //       );
  //       this.getAllRequisition();
  //     }
  //   });
  // }

  // onReceiveRequisition(e: any, requisition?: any): void {
  //   requisition = requisition ? requisition : e?.requisition;
  //   e = !e?.event ? e : e?.event;
  //   e.stopPropagation();

  //   // this.store.dispatch(receiveRequisition({ requisition }));
  //   this.requisitionService
  //     .receiveRequisition(requisition)
  //     .subscribe((response) => {
  //       // Add support to catch error
  //       if (response) {
  //         this.getAllRequisition();
  //       }
  //     });
  // }

  // onRejectRequisition(e: any, requisition?: RequisitionObject): void {
  //   requisition = requisition ? requisition : e?.requisition;
  //   e = !e?.event ? e : e?.event;
  //   e.stopPropagation();
  //   if (requisition) {
  //     const { id, issueUuid } = requisition;
  //     // TODO Add support to capture rejection reasons
  //     const rejectionReason = "";
  //     this.store.dispatch(
  //       rejectRequisition({ id, issueUuid, rejectionReason })
  //     );
  //     this.getAllRequisition();
  //   }
  // }

  onViewRequisitionItems(requisitionUuid) {
    if (requisitionUuid === this.viewRequisitionItems) {
      this.viewRequisitionItems = undefined;
    } else {
      this.viewRequisitionItems = requisitionUuid;
    }
  }

  onPageChange(event) {
    this.page =
      event.pageIndex - this.page >= 0 ? this.page + 1 : this.page - 1;
    this.pageSize = Number(event?.pageSize);
    this.getAllRequisitions();
  }

  onSelectStatus(e) {
    this.selectedStatus = e?.value;
    this.getAllRequisitions();
  }

  getSelection(e: any): void {
    const item = e?.item;
    const event = e?.event;
    if (event?.checked) {
      this.selectedItems[item?.uuid] = item;
    } else {
      let newSelectedItems: any;
      Object.keys(this.selectedItems)?.forEach((uuid) => {
        if (uuid === item?.uuid) {
          newSelectedItems = omit(this.selectedItems, uuid);
        }
      });
      this.selectedItems = newSelectedItems;
    }
  }

  get selectedItemsCount(): number {
    return this.selectedItems ? Object.keys(this.selectedItems)?.length : 0;
  }

  onPrint(e: Event, requisition: any, facilityDetails: any, currentUser: any) {
    let itemsToPrint: any;
    this.requisitionService
      .getRequisitionByUuid(requisition?.uuid)
      .pipe(
        map((response) => {
          const items = getFilterIssuedItemsInRequisitions(
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
        let requisitionDate = formatDateToString(
          new Date(requisition?.created)
        );

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
                <b>Requisition Number:</b> ${requisition.code}</br>
            </p>
            <p>
                <b>Target Store:</b> ${
                  requisition?.requestedLocation?.display
                }</br>
            </p>
            <p>
                <b>Requested on:</b> ${requisitionDate}</br>
            </p>
            <p>
                <b>Status:</b> ${
                  requisition?.requisitionStatuses[
                    requisition?.requisitionStatuses?.length - 1
                  ]?.status
                    ? requisition?.requisitionStatuses[
                        requisition?.requisitionStatuses?.length - 1
                      ]?.status
                    : "DRAFT"
                }
                    </br>
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
                    <td>${
                      stock?.requisitionItemStatuses[
                        stock?.requisitionItemStatuses?.length - 1
                      ]?.status
                        ? stock?.requisitionItemStatuses[
                            stock?.requisitionItemStatuses?.length - 1
                          ]?.status
                        : "DRAFT"
                    }</td>
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
}
