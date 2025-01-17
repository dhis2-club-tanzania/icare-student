import { Component, OnInit, AfterContentInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import * as _ from "lodash";
import { Observable, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";
import { OrdersService } from "src/app/shared/resources/order/services/orders.service";
import { Patient } from "src/app/shared/resources/patient/models/patient.model";
import { PatientService } from "src/app/shared/resources/patient/services/patients.service";
import { EncountersService } from "src/app/shared/services/encounters.service";
import { go, loadCurrentPatient } from "src/app/store/actions";
import { discountBill } from "src/app/store/actions/bill.actions";
import { AppState } from "src/app/store/reducers";
import {
  getLoadingBillStatus,
  getPatientBillLoadedStatus,
  getPatientBills,
} from "src/app/store/selectors/bill.selectors";
import { getCurrentPatient } from "src/app/store/selectors/current-patient.selectors";
import {
  getAllPayments,
  getLoadingPaymentStatus,
} from "src/app/store/selectors/payment.selector";
import { getActiveVisit } from "src/app/store/selectors/visit.selectors";
import { ExemptionDenialComponent } from "../../components/exemption-denial/exemption-denial.component";
import { ExemptionFullConfirmationComponent } from "../../components/exemption-full-confirmation/exemption-full-confirmation.component";
import { BillItem } from "../../models/bill-item.model";
import { BillObject } from "../../models/bill-object.model";
import { Bill } from "../../models/bill.model";
import { PaymentObject } from "../../models/payment-object.model";
import { BillingService } from "../../services/billing.service";

@Component({
  selector: "app-exemption",
  templateUrl: "./exemption.component.html",
  styleUrls: ["./exemption.component.scss"],
})
export class ExemptionComponent implements OnInit, AfterContentInit {
  currentPatient$: Observable<Patient>;
  patientDetails: any;
  quoteToShow: boolean;
  bills$: Observable<BillObject[]>;
  loadingBills$: Observable<boolean>;
  loadingPayments$: Observable<boolean>;
  payments$: Observable<PaymentObject[]>;
  patientId: string;
  patientsBillsLoadedState$: Observable<boolean>;
  discountItemsCount: any;
  discountItems: any[] = [];
  bill: Bill;
  billItems: BillItem[];
  currentVisit$: Observable<any>;
  criteriaResults$: Observable<any>;
  criteria: any;
  criteriaObject: any;
  exemptionForm: any;
  exemptionEncounterType$: any;
  exemptionConcept$: Observable<any>;
  bills: any;
  billsCount: any;
  showActionButtons: boolean;
  attachmentConcept: any;

  constructor(
    private store: Store<AppState>,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router,
    private billingService: BillingService,
    private systemSettingsService: SystemSettingsService,
    private dialog: MatDialog,
    private encounterService: EncountersService,
    private ordersService: OrdersService
  ) {}

  ngOnInit() {
    this.patientId = this.route?.snapshot?.params?.patientId;

    this.store.dispatch(loadCurrentPatient({ uuid: this.patientId }));

    this.currentPatient$ = this.store.select(getCurrentPatient);

    this.bills$ = this.store.pipe(select(getPatientBills));
    this.loadingBills$ = this.store.pipe(select(getLoadingBillStatus));

    this.payments$ = this.store.pipe(select(getAllPayments));

    this.currentVisit$ = this.store.select(getActiveVisit);

    this.loadingPayments$ = this.store.pipe(select(getLoadingPaymentStatus));

    this.patientsBillsLoadedState$ = this.store.select(
      getPatientBillLoadedStatus
    );
    this.criteriaResults$ = this.billingService.discountCriteriaConcept();

    this.criteriaResults$.subscribe((criteria) => {
      this.criteria = criteria.results[0];
    });

    // Get exemption encounter Type
    this.exemptionEncounterType$ = this.systemSettingsService
      .getSystemSettingsByKey("icare.billing.exemption.encounterType")
      .pipe(
        tap((orderType) => {
          return orderType;
        }),
        catchError((error) => {
          console.log("Error occured while trying to get orderType: ", error);
          return of(new MatTableDataSource([error]));
        })
      );

    this.exemptionConcept$ = this.systemSettingsService
      .getSystemSettingsByKey("icare.billing.exemption.concept")
      .pipe(
        tap((exemptionConcept) => {
          return exemptionConcept;
        }),
        catchError((error) => {
          return of(new MatTableDataSource([error]));
        })
      );

    this.systemSettingsService
      .getSystemSettingsByKey("icare.billing.exemption.attachmentConcept")
      .subscribe((value) => {
        this.attachmentConcept = value;
      });
  }

  ngAfterContentInit() {
    this.billingService
      .getPatientBills(this.patientId, false, "all")
      .subscribe({
        next: (bills) => {
          bills.forEach((bill) => {
            if (bill) {
              this.bill = bill;
              bill.billDetails?.discountItems.forEach((discountItem) => {
                this.discountItems = [...this.discountItems, discountItem];
              });
              this.discountItemsCount = this.discountItems.length;
            }
          });
        },
      });
  }

  onDiscountBill(exemptionDetails: any, params?: any): void {
    if (exemptionDetails) {
      let exemptionObject = {
        discountDetails: {
          Criteria: exemptionDetails?.discountDetails?.Criteria,
          isFullExempted: exemptionDetails?.discountDetails?.isFullExempted
            ? exemptionDetails?.discountDetails?.isFullExempted
            : false,
          remarks: exemptionDetails?.discountDetails?.remarks,
          items: exemptionDetails?.discountDetails?.items,
          patient: exemptionDetails?.discountDetails?.patient,
          attachmentDetails: {
            file: exemptionDetails?.discountDetails?.file,
            concept: this.attachmentConcept,
          },
        },
        patient: exemptionDetails?.discountDetails?.patient,
        bill: exemptionDetails.bill,
      };
      const { bill, discountDetails, patient } = exemptionObject;
      this.store.dispatch(discountBill({ bill, discountDetails, patient }));
    }

    if (params) {
      this.updateOrderAndExemptionEncounter(
        params?.currentVisit?.encounters,
        params?.exemptionEncounterType
      );
    }
    this.store.dispatch(go({ path: ["/billing/exemption"] }));
  }

  onSelectPatient(e) {
    e.stopPropagation();
  }

  exemptionDenial(params) {
    const dialog = this.dialog.open(ExemptionDenialComponent, {
      width: "25%",
      panelClass: "custom-dialog-container",
    });

    dialog.afterClosed().subscribe((data) => {
      if (data) {
        let reason = data.reason;

        //Update Encounter Order after Succesfully exempting this person
        this.updateOrderAndExemptionEncounter(
          params?.currentVisit?.encounters,
          params?.exemptionEncounterType,
          reason,
          true
        );

        this.store.dispatch(go({ path: ["/billing/exemption"] }));
      }
    });
  }

  exemptFull(params) {
    this.criteriaObject = {
      id: this.criteria["display"],
      key: this.criteria["display"],
      label: this.criteria["display"],
      options: _.map(this.criteria["answers"], (answer) => {
        return {
          key: answer["uuid"],
          value: answer["uuid"],
          label: answer["display"],
        };
      }),
    };

    this.exemptionForm = {
      criteria: new Dropdown(this.criteriaObject),
      remarks: new Textbox({
        id: "remarks",
        key: "remarks",
        label: "Remark",
      }),
    };

    const dialog = this.dialog.open(ExemptionFullConfirmationComponent, {
      width: "25%",
      panelClass: "custom-dialog-container",
      data: {
        visit: params?.currentVisit,
        bills: params?.bills,
        exemptionMessage: {
          heading: `Fully exempt ${params?.currentPatient?.patient?.person?.display}`,
          message:
            "This is to confirm that you are about to confirm exempting this person in fully including all of the above items. Click Confirm to process the exemption.",
        },
        form: this.exemptionForm,
        patient: params?.currentPatient,
      },
    });

    dialog.afterClosed().subscribe((data) => {
      if (data?.confirmed) {
        // Discount Creation
        this.onDiscountBill(data?.exemptionDetails, params);
      }
    });
  }

  getCurrentExemptionEncounter(encounters: any[], encounterType: any) {
    encounters.filter((encounter) => {
      if (encounter?.encounterType?.uuid === encounterType?.value) {
        return encounter;
      }
    });
    return encounters[0];
  }

  updateOrderAndExemptionEncounter(
    encounters: any[],
    exemptionEncounterType: any,
    commentToFulfiller?: string,
    voidEncounter?: boolean
  ) {
    let exemptionEncounter = this.getCurrentExemptionEncounter(
      encounters,
      exemptionEncounterType
    );
    let exemptionOrder = exemptionEncounter.orders[0];

    exemptionOrder = {
      ...exemptionOrder,
      fulfillerStatus: "RECEIVED",
      encounter: exemptionOrder?.encounter?.uuid,
      fulfillerComment: commentToFulfiller,
    };

    const exemptionOrderPayload = {
      uuid: exemptionOrder?.uuid,
      fulfillerStatus: exemptionOrder?.fulfillerStatus,
      fulfillerComment: exemptionOrder?.fulfillerComment,
      encounter: exemptionOrder?.encounter,
    };
    this.ordersService
      .updateOrdersViaEncounter([exemptionOrderPayload])
      .subscribe({
        next: (order) => {
          return order;
        },
        error: (error) => {
          return error;
        },
      });

    //Update encounter to void if voidEncounter True
    if (voidEncounter === true) {
      this.encounterService.voidEncounter(exemptionEncounter).subscribe({
        next: (encounter) => {
          console.warn("==> Successfully updated encounter: ", encounter);
        },
        error: (error) => {
          console.warn("==> Failed to update encounter: ", error);
        },
      });
    }
  }

  onShowActionButtons(e: any) {
    this.showActionButtons = true;
  }

  backToExemptionList(e: Event) {
    e.stopPropagation();
    this.store.dispatch(
      go({
        path: [`/billing/exemption`],
      })
    );
  }
}
