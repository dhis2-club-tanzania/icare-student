import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Bill } from '../../models/bill.model';
import { flatten } from 'lodash';

@Component({
  selector: 'app-pending-payments',
  templateUrl: './pending-payments.component.html',
  styleUrls: ['./pending-payments.component.scss'],
})
export class PendingPaymentsComponent implements OnInit {
  @Input() pendingPayments: Bill[];
  dataSource: MatTableDataSource<any>;
  columns: any[];
  displayedColumns: string[];

  constructor() {}

  ngOnInit() {
    const billItems = flatten(
      (this.pendingPayments || []).map((pendingPayment) => pendingPayment.items)
    );
    this.dataSource = new MatTableDataSource(billItems);

    this.columns = [
      { id: 'index', label: '#', isIndexColumn: true },
      { id: 'name', label: 'Description', width: '50%' },
      { id: 'quantity', label: 'Quantity' },
      { id: 'price', label: 'Unit Price', isCurrency: true },
      { id: 'discount', label: 'Discount', isCurrency: true },
      { id: 'amount', label: 'Amount', isCurrency: true },
    ];
    this.displayedColumns = this.columns.map((column) => column.id);
  }
}
