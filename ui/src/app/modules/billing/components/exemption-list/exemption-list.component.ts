import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Observable } from "rxjs";
import { Patient } from "src/app/shared/resources/patient/models/patient.model";
import { BillObject } from "../../models/bill-object.model";
import { Bill } from "../../models/bill.model";
import { BillingService } from "../../services/billing.service";

@Component({
  selector: "app-exemption-list",
  templateUrl: "./exemption-list.component.html",
  styleUrls: ["./exemption-list.component.scss"],
})
export class ExemptionListComponent implements OnInit {
  @Input() bills: BillObject[];
  @Input() currentPatient: Patient;

  @Output() discountBill = new EventEmitter();
  @Output() updateBillDiscount = new EventEmitter();
  @Output() showActionButtons = new EventEmitter();

  criteriaResults$: Observable<any>;

  constructor(private billingService: BillingService) {}

  ngOnInit() {
    this.criteriaResults$ = this.billingService.discountCriteriaConcept();
    this.bills = this.bills.filter((bill) => {
      if (bill?.items && bill?.items.length > 0) {
        this.showActionButtons.emit();
        return bill;
      }
    });
  }

  onConfirmExemption(exemptionDetails): void {
    this.discountBill.emit({
      ...exemptionDetails,
      discountDetails: {
        ...exemptionDetails.discountDetails,
        patient: this.currentPatient?.id,
      },
    });
  }
}
