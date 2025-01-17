import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Observable } from "rxjs";
import { filter, first } from "rxjs/operators";
import { TableActionOption } from "../../models/table-action-options.model";
import { TableColumn } from "../../models/table-column.model";
import { TableConfig } from "../../models/table-config.model";
import { uniqBy, keyBy } from "lodash";
import { TableSelectAction } from "../../models/table-select-action.model";
import { Visit } from "../../resources/visits/models/visit.model";
import { DrugOrdersService } from "../../resources/order/services";
import { MatDialog } from "@angular/material/dialog";
import { ShortMessageConstructionComponent } from "../../dialogs";
import { Patient } from "../../resources/patient/models/patient.model";
import { AppState } from "src/app/store/reducers";
import { select, Store } from "@ngrx/store";
import { getActiveVisit } from "src/app/store/selectors/visit.selectors";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"],
})
export class TableComponent implements OnInit {
  @Input() useNormalTable: boolean;
  @Input() data$: Observable<MatTableDataSource<any>>;
  @Input() columns: TableColumn[];
  @Input() loadingDataError: string;
  @Input() tableConfig: TableConfig;
  @Input() loading: boolean;
  @Input() actionOptions: TableActionOption[];
  @Input() patientDrugOrdersStatuses: any[];
  @Input() visit: Visit;
  @Input() drugOrders: any;
  @Input() currentPatient: any;
  @Input() generalMetadataConfigurations: any;
  keyedDrugOrderStatuses: any = {};

  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;

  @Output() selectRow = new EventEmitter();
  @Output() selectAction: EventEmitter<any> =
    new EventEmitter<TableSelectAction>();
  @Output() addAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() confirmAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() printPrescriptions: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  patientDrugOrdersStatuses$: Observable<any>;
  activeVisit$: Observable<any>;
  constructor(
    private drugOrderService: DrugOrdersService,
    private dialog: MatDialog,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.keyedDrugOrderStatuses = keyBy(
      this.patientDrugOrdersStatuses,
      "order"
    );
    this.columns = uniqBy(
      this.actionOptions?.length > 0
        ? [
            ...(this.columns || []),
            { id: "actions", label: "Actions", isActionColumn: true },
          ]
        : this.columns || [],
      "id"
    );

    this.displayedColumns = this.columns.map((visitColumn) => visitColumn.id);
    this.activeVisit$ = this.store.pipe(select(getActiveVisit));
  }

  ngAfterViewInit() {
    if (this.visit && this.visit.uuid) {
      this.patientDrugOrdersStatuses$ =
        this.drugOrderService.getDrugOrderStatus(this.visit.uuid);
    }

    this.data$?.pipe(filter((data) => data !== null)).subscribe((data) => {
      this.dataSource = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onSelectRow(e: MouseEvent, row) {
    e.stopPropagation();
    this.selectRow.emit(row);
  }

  onSelectAction(e: MouseEvent, actionOption: any, data: any) {
    e.stopPropagation();
    this.selectAction.emit({
      actionOption,
      data,
    });
  }

  onPrintPrescriptions(e: any, drugOrders: any) {
    e?.stopPropagation();
    this.printPrescriptions.emit(drugOrders);
  }

  onOpenMessageConstruction(
    event: Event,
    drugOrder: any,
    currentPatient: Patient,
    generalMetadataConfigurations: any
  ): void {
    event.stopPropagation();
    this.dialog.open(ShortMessageConstructionComponent, {
      width: "60%",
      data: {
        headerDetails: "Client messages",
        data: {
          referenceInstructions:
            drugOrder?.drug?.display +
            ", " +
            drugOrder?.instructions +
            " (" +
            drugOrder?.quantity +
            ")",
          drug: drugOrder?.drug?.display,
          patient: currentPatient,
          generalMetadataConfigurations,
        },
      },
    });
  }
}
