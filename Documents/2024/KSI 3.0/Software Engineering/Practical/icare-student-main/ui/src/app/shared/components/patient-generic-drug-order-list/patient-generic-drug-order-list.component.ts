import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { DispensingFormComponent } from "src/app/shared/dialogs/dispension-form/dispension-form.component";
import { AppState } from "src/app/store/reducers";
import { getIfThereIsAnyDiagnosisInTheCurrentActiveVisit } from "src/app/store/selectors";
import { getVisitLoadingState } from "src/app/store/selectors/visit.selectors";
import { TableActionOption } from "../../models/table-action-options.model";
import { TableColumn } from "../../models/table-column.model";
import { TableConfig } from "../../models/table-config.model";
import { TableSelectAction } from "../../models/table-select-action.model";
import { DrugOrdersService } from "../../resources/order/services";
import { OrdersService } from "../../resources/order/services/orders.service";
import { Visit } from "../../resources/visits/models/visit.model";

import { flatten, keyBy } from "lodash";
import { loadActiveVisit } from "src/app/store/actions/visit.actions";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { map, tap } from "rxjs/operators";
import { Api } from "../../resources/openmrs";

@Component({
  selector: "app-patient-generic-drug-order-list",
  templateUrl: "./patient-generic-drug-order-list.component.html",
  styleUrls: ["./patient-generic-drug-order-list.component.scss"],
})
export class PatientGenericDrugOrderListComponent implements OnInit {
  @Input() currentLocation: any;
  @Input() visit: Visit;
  @Input() loading: boolean;
  @Input() loadingError: string;
  @Input() encounterUuid: string;
  @Input() actionOptions: TableActionOption[];
  @Input() canAddPrescription: boolean;
  @Input() currentPatient: any;
  @Input() generalMetadataConfigurations: any;
  @Input() genericPrescriptionOrderType: any;
  @Input() genericPrescriptionEncounterType: any;
  @Input() useGenericPrescription: boolean;
  visitLoadingState$: Observable<boolean>;

  drugOrderColumns: TableColumn[];
  tableConfig: TableConfig;
  isThereDiagnosisProvided$: Observable<boolean>;
  drugOrders$: Observable<any>;
  drugOrders: any[];

  drugOrdersKeyedByEncounter: any = {};

  @Output() orderSelectAction = new EventEmitter<TableSelectAction>();
  @Output() loadPatientVisit = new EventEmitter<any>();
  genericPrescriptionConceptUuids$: any;
  specificDrugConceptUuid$: Observable<string>;
  errors: any[] = [];
  encounter$: Observable<any>;

  constructor(
    private dialog: MatDialog,
    private store: Store<AppState>,
    private ordersService: OrdersService,
    private api: Api,
    private systemSettingsService: SystemSettingsService
  ) {}

  ngOnInit() {
    this.getDrugOrders();

    this.visitLoadingState$ = this.store.select(getVisitLoadingState);
    this.tableConfig = new TableConfig({ noDataLabel: "No prescription" });
    this.drugOrderColumns = [
      {
        id: "orderNumber",
        label: "#",
      },
      {
        id: "display",
        label: "Item",
      },
      {
        id: "orderedBy",
        label: "Ordered by",
      },
      {
        id: "quantity",
        label: "Quantity",
      },
      {
        id: "price",
        label: "Price",
      },
      {
        id: "paymentStatus",
        label: "Status",
      },
    ];
    this.isThereDiagnosisProvided$ = this.store.select(
      getIfThereIsAnyDiagnosisInTheCurrentActiveVisit
    );

    this.genericPrescriptionConceptUuids$ = this.systemSettingsService
      .getSystemSettingsMatchingAKey("iCare.clinic.genericPrescription.field")
      .pipe(
        map((response: any) => {
          if (response?.error) {
            this.errors = [...this.errors, response.error];
          }
          return response;
        })
      );

    this.specificDrugConceptUuid$ = this.systemSettingsService
      .getSystemSettingsByKey(
        "iCare.clinic.genericPrescription.specificDrugConceptUuid"
      )
      .pipe(
        tap((response) => {
          if (response === "none") {
            this.errors = [
              ...this.errors,
              {
                error: {
                  message:
                    "Generic Use Specific drug Concept config is missing, Set 'iCare.clinic.genericPrescription.specificDrugConceptUuid' or Contact IT (Close to continue)",
                },
                type: "warning",
              },
            ];
          }
        })
      );
  }

  getDrugOrders() {
    this.drugOrders = flatten(
      this.visit?.encounters
        ?.map((encounter) => {
          encounter?.orders?.forEach((order) => {
            if (
              order?.orderType?.javaClassName ===
              "org.openmrs.module.icare.billing.models.Prescription"
            ) {
              this.drugOrdersKeyedByEncounter[order?.encounter?.uuid] = order;
            }
          });
          return (
            encounter?.orders.filter(
              (order) =>
                order.orderType?.uuid == this.genericPrescriptionOrderType
            ) || []
          )?.map((genericDrugOrder) => {
            return {
              ...genericDrugOrder,
              formulatedDescription: (
                encounter?.obs?.map((observation) => observation?.value) || []
              ).join(";"),
              obs: keyBy(
                encounter?.obs?.map((observation) => {
                  return {
                    ...observation,
                    conceptKey: observation?.concept?.uuid,
                    valueIsObject: observation?.value?.uuid ? true : false,
                  };
                }),
                "conceptKey"
              ),
            };
          });
        })
        ?.filter((order) => order) || []
    );

    this.drugOrders = this.drugOrders?.filter(
      (order) => !this.drugOrdersKeyedByEncounter[order?.encounter?.uuid]
    );
  }

  onVerify(order: any) {
    const dialog = this.dialog.open(DispensingFormComponent, {
      width: "100%",
      disableClose: true,
      data: {
        drugOrder: order,
        patient: this.visit?.visit?.patient,
        visit: this.visit,
        location: this.currentLocation,
        encounterUuid: this.encounterUuid,
        fromDispensing: true,
        showAddButton: false,
        useGenericPrescription: this.useGenericPrescription,
      },
    });

    dialog.afterClosed().subscribe(() => {
      // this.store.dispatch(
      //   loadActiveVisit({ patientId: this.visit?.visit?.patient?.uuid })
      // );
      this.loadPatientVisit.emit();
    });
  }
}
