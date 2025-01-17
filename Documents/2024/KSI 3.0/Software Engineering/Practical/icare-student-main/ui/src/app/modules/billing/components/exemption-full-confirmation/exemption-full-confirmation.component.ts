import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { FormValue } from 'src/app/shared/modules/form/models/form-value.model';
import { BillItem } from '../../models/bill-item.model';
import { Bill } from '../../models/bill.model';

@Component({
  selector: "app-exemption-full-confirmation",
  templateUrl: "./exemption-full-confirmation.component.html",
  styleUrls: ["./exemption-full-confirmation.component.scss"],
})
export class ExemptionFullConfirmationComponent implements OnInit {
  reason: any;
  currentVisit: any;
  data: any;
  dataSource: MatTableDataSource<unknown>;
  columns: any;
  isIndexColumn?: any[];
  displayedColumns: string[];
  bill: Bill;
  billItems: BillItem[];
  currentVisit$: Observable<any>;
  exemptionDetails: any;
  document: any;

  constructor(
    private matDialogRef: MatDialogRef<ExemptionFullConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.currentVisit = data?.visit;
    this.data = data;
  }

  ngOnInit() {
    this.data = {
      ...this.data,
      bills: this.data?.bills.filter((bill) => {
        if (bill?.items.length > 0) {
          return bill;
        }
      }),
    };
    let data: any;
    this.data?.bills.forEach((bill) => {
      data = bill?.items.map((item) => {
        return {
          amount: item?.price,
          name: item?.billItem?.item?.concept?.name,
        };
      });
    });

    this.dataSource = new MatTableDataSource(data);
    this.columns = [
      { id: "index", label: "#", isIndexColumn: true },
      { id: "name", label: "Description", width: "50%" },
      { id: "amount", label: "Amount", isCurrency: true },
    ];
    this.displayedColumns = [...this.columns.map((column) => column.id)];
  }

  onFormUpdate(formValue: FormValue): void {
    this.exemptionDetails = {
      ...this.exemptionDetails,
      ...formValue.getValues(),
      isFullExempted: true,
    };
  }

  fileSelection(event): void {
    event.stopPropagation();
    const fileInputElement: HTMLElement = document.getElementById(
      "exemptionFile"
    );
    this.document = event.target.files[0];
  }

  onCancel(e): void {
    e.stopPropagation();
    this.matDialogRef.close();
  }

  onConfirm(e): void {
    e.stopPropagation();

    // Create an exemption Details data
    this.data?.bills?.forEach((bill) => {
      this.billItems = bill?.items;

      //Create discount Items
      const billItemObjects = this.billItems
        .map((item) => item.toJson())
        .map((itemObject) => ({
          ...itemObject,
          discount: itemObject.amount,
        }));

      const newBill = new Bill({ ...bill, items: billItemObjects });

      this.billItems = newBill.items;

      (this.billItems || []).forEach((billItem) => {
        this.exemptionDetails = {
          ...this.exemptionDetails,
          items: {
            ...(this.exemptionDetails.items || {}),
            [billItem.id]: {
              amount: billItem.discount,
              item: billItem.id,
              invoice: bill?.id,
            },
          },
          patient: this.data?.patient?.patient?.uuid,
        };
        
      });

      this.exemptionDetails = {
        ...this.exemptionDetails,
        file: this.document,
      };

      this.exemptionDetails = {
        ...this.exemptionDetails,
        discountDetails: this.exemptionDetails,
        bill: bill,
      };
    });

    this.matDialogRef.close({
      confirmed: true,
      exemptionDetails: this.exemptionDetails,
    });
  }
}

