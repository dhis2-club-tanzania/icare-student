import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Bill } from '../../models/bill.model';

@Component({
  selector: "app-exemption-history",
  templateUrl: "./exemption-history.component.html",
  styleUrls: ["./exemption-history.component.scss"],
})
export class ExemptionHistoryComponent implements OnInit {
  @Input() discountItems: any[];
  @Input() discountItemsCount;
  @Input() bill: Bill;


  dataSource: MatTableDataSource<any>;
  columns: any[];
  displayedColumns: string[];
  
  currentUser: any;
  confirmedBillEntities: any;
  payableAmount: any;
  totalPaymentAmount: any;
  
  constructor() {}

  ngOnInit() {
    let data = this.discountItems.map((discountItem) => {
      return {
        amount: discountItem.amount,
        name: discountItem.item.name,
      };
    });

    this.dataSource = new MatTableDataSource(data);

    this.totalPaymentAmount = data.reduce((total, item) => {
      return (total = total + item.amount);
    }, 0);
    
    this.columns = [
      { id: "index", label: "#", isIndexColumn: true },
      { id: "name", label: "Description", width: "50%" },
      { id: "amount", label: "Amount", isCurrency: true },
    ];
    this.displayedColumns = [
      ...this.columns.map((column) => column.id),
    ];

  }

}
