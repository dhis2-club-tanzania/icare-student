import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DispensingFormComponent } from 'src/app/shared/dialogs/dispension-form/dispension-form.component';
import { AppState } from 'src/app/store/reducers';
import { getIfThereIsAnyDiagnosisInTheCurrentActiveVisit } from 'src/app/store/selectors';
import { getVisitLoadingState } from 'src/app/store/selectors/visit.selectors';
import { TableActionOption } from '../../models/table-action-options.model';
import { TableColumn } from '../../models/table-column.model';
import { TableConfig } from '../../models/table-config.model';
import { TableSelectAction } from '../../models/table-select-action.model';
import { DrugOrdersService } from '../../resources/order/services';
import { OrdersService } from '../../resources/order/services/orders.service';
import { Visit } from '../../resources/visits/models/visit.model';

@Component({
  selector: 'app-patient-drug-order-list',
  templateUrl: './patient-drug-order-list.component.html',
  styleUrls: ['./patient-drug-order-list.component.scss'],
})
export class PatientDrugOrderListComponent implements OnInit {
  @Input() currentLocation: any;
  @Input() visit: Visit;
  @Input() loading: boolean;
  @Input() loadingError: string;
  @Input() encounterUuid: string;
  @Input() actionOptions: TableActionOption[];
  @Input() canAddPrescription: boolean;
  @Input() currentPatient: any;
  @Input() generalMetadataConfigurations: any;
  visitLoadingState$: Observable<boolean>;

  drugOrderColumns: TableColumn[];
  tableConfig: TableConfig;
  @Output() orderSelectAction = new EventEmitter<TableSelectAction>();
  isThereDiagnosisProvided$: Observable<boolean>;
  drugOrders$: Observable<any>;
  constructor(
    private dialog: MatDialog,
    private store: Store<AppState>,
    private drugOrderService: DrugOrdersService,
    private ordersService: OrdersService
  ) {}

  ngOnInit() {
    this.drugOrders$ = this.ordersService.getOrdersByVisitAndOrderType({
      visit: this.visit?.uuid,
      orderType: 'iCARESTS-PRES-1111-1111-525400e4297f',
    });
    this.visitLoadingState$ = this.store.select(getVisitLoadingState);
    this.tableConfig = new TableConfig({ noDataLabel: 'No prescription' });
    this.drugOrderColumns = [
      {
        id: 'orderNumber',
        label: '#',
      },
      {
        id: 'display',
        label: 'Item',
      },
      {
        id: 'orderedBy',
        label: 'Ordered by',
      },
      {
        id: 'quantity',
        label: 'Quantity',
      },
      {
        id: 'price',
        label: 'Price',
      },
      {
        id: 'paymentStatus',
        label: 'Status',
      },
    ];
    this.isThereDiagnosisProvided$ = this.store.select(
      getIfThereIsAnyDiagnosisInTheCurrentActiveVisit
    );
  }

  onSelectAction(data: any) {
    this.orderSelectAction.emit(data);
  }

  onAddOrder(e: MouseEvent) {
    e.stopPropagation();
    const dialog = this.dialog.open(DispensingFormComponent, {
      width: '80%',
      disableClose: true,
      data: {
        drugOrder: null,
        patient: this.visit?.patient,
        visit: this.visit,
        location: this.currentLocation,
        encounterUuid: this.encounterUuid,
        fromDispensing: true,
        showAddButton: false,
      },
    });
  }
}
