import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { select, Store } from "@ngrx/store";
import { map } from "rxjs/operators";
import { Observable, of, zip } from "rxjs";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { RequisitionObject } from "src/app/shared/resources/store/models/requisition.model";
import { RequisitionService } from "src/app/shared/resources/store/services/requisition.service";
import { omit } from "lodash";
import { AppState } from "src/app/store/reducers";
import {
  getStoreLocations,
} from "src/app/store/selectors";
import { getAllStockableItems } from "src/app/store/selectors/pricing-item.selectors";
import { SharedConfirmationComponent } from "src/app/shared/components/shared-confirmation/shared-confirmation.component";

@Component({
  selector: "app-requisition",
  templateUrl: "./requisition.component.html",
  styleUrls: ["./requisition.component.scss"],
})
export class RequisitionComponent implements OnInit {
  @Input() currentLocation: any;

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
  pageSize: number = 50;
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
      this.systemSettingsService.getSystemSettingsMatchingAKey(
        `iCare.store.requisition.id.format`
      );
    this.getAllRequisitions();
    this.currentStore$ = of(this.currentLocation);
    this.stores$ = this.store.pipe(select(getStoreLocations));
    this.stockableItems$ = this.store.pipe(select(getAllStockableItems));
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
        "DESC"
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
    if(!this.showRequisitionForm) {
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

  onUpdateRequisition(e: any, requisition: any){
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
    const requisitionObject = {
      ...requisition,
      voided: true,
    };
    this.requisitionService
      .updateRequisition(requisition?.uuid, requisitionObject)
      .subscribe((response) => {
        localStorage.removeItem("availableRequisition");
        this.getAllRequisitions();
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
          }
        ]
      };
    });
    this.dialog
      .open(SharedConfirmationComponent, {
        width: "40%",
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
            ...issueItems?.map((issueItem) => this.requisitionService
              .receiveIssueItem(issueItem))
          ).subscribe((response) => {
            if (response) {
              this.selectedItems = {};
              this.getAllRequisitions();
            }
          });
        }
      })
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
        width: "40%",
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
        width: "40%",
        data: {
          modalTitle: "Confirm Issues Rejection",
          modalMessage: "Are you sure you want to reject this all selected items?",
          showRemarksInput: true,
          confirmationButtonText: "Reject",
        },
      })
      .afterClosed()
      .subscribe((rejection) => {
        if (rejection?.confirmed) {
          const rejectionObjects = Object.keys(this.selectedItems)?.map((key) => {
            return {
              issueItem: {
                uuid: this.selectedItems[key]?.uuid,
              },
              status: "REJECTED",
              remarks: rejection?.remarks || "",
            };
          })
          zip(
            ...rejectionObjects?.map((rejectionObject) => {
              return this.requisitionService.createIssueItemStatus(rejectionObject);
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
}
