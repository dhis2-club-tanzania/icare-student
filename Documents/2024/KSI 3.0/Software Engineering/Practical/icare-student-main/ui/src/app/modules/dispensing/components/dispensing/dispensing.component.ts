import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DrugOrder } from 'src/app/shared/resources/order/models/drug-order.model';
import { Dropdown } from 'src/app/shared/modules/form/models/dropdown.model';
import { Textbox } from 'src/app/shared/modules/form/models/text-box.model';
import { DrugOrdersService } from 'src/app/shared/resources/order/services';
import { ProviderGet } from 'src/app/shared/resources/openmrs';
import { Patient } from 'src/app/shared/resources/patient/models/patient.model';
import { VisitsService } from 'src/app/shared/resources/visits/services';
import { dispenseDrug, saveDrugOrder } from 'src/app/store/actions';
import { AppState } from 'src/app/store/reducers';
import {
  getAllUniqueDrugOrders,
  getDrugOrderLoadingStatus,
  getOrderTypesByName,
  getTotalDrugOrderAmount,
} from 'src/app/store/selectors';
import { getCurrentPatient } from 'src/app/store/selectors/current-patient.selectors';
import { getProviderDetails } from 'src/app/store/selectors/current-user.selectors';
import { DispensingFormComponent } from '../../../../shared/dialogs/dispension-form/dispension-form.component';

@Component({
  selector: 'app-dispensing',
  templateUrl: './dispensing.component.html',
  styleUrls: ['./dispensing.component.scss'],
})
export class DispensingComponent implements OnInit {
  expandedRow: number;
  quantityFormField: any;
  quantityUnitsField: any;
  drugsField: any;
  currentVisitDrugOrders: any;
  currentSetDrug: any;

  genericNameField: any;
  orderReasonField: any;
  instructionField: any;
  doseField: any;
  doseUnitsField: any;
  frequencyField: any;
  durationField: any;
  durationUnitsField: any;
  routeField: any;
  drugOrders$: Observable<any>;
  totalDrugOrderAmount$: Observable<number>;

  patient$: Observable<Patient>;
  provider$: Observable<ProviderGet>;
  orderType$: Observable<any>;
  loadingDrugOrders$: Observable<boolean>;
  constructor(
    private drugOrderService: DrugOrdersService,
    private store: Store<AppState>,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    this.drugOrders$ = this.store.select(getAllUniqueDrugOrders);

    this.loadingDrugOrders$ = this.store.pipe(
      select(getDrugOrderLoadingStatus)
    );

    this.totalDrugOrderAmount$ = this.store.select(getTotalDrugOrderAmount);

    this.patient$ = this.store.pipe(select(getCurrentPatient));
    this.provider$ = this.store.pipe(select(getProviderDetails));

    this.orderType$ = this.store.pipe(
      select(getOrderTypesByName, { name: 'Drug Order' })
    );

    const quantityUnits = await this.drugOrderService.getSetMembersAsOptions(
      'Dosing Unit',
      'full'
    );
    const drugs = await this.drugOrderService.getAllDrugs('full');
    this.drugsField = new Dropdown({
      options: drugs,
      key: 'Drug',
      value: 'Drug',
      required: true,
      label: 'Drug',
    });

    this.quantityFormField = new Textbox({
      key: 'Quantity',
      value: 'Quantity',
      required: true,
      type: 'number',
      label: 'Quantity',
    });

    this.quantityUnitsField = new Dropdown({
      options: quantityUnits,
      key: 'Units',
      value: 'Units',
      required: true,
      label: 'Units',
    });
  }

  onUpdatePrescription(e: Event, drugOrder, params) {
    e.stopPropagation();
    const dialog = this.dialog.open(DispensingFormComponent, {
      width: '80%',
      data: {
        drugOrder,
        patient: params.patient,
        provider: params.provider,
        orderType: params.orderType,
        fromDispensing: true,
        showAddButton: false,
      },
    });

    dialog.afterClosed().subscribe((data) => {
      if (data?.drugOrder) {
        this.store.dispatch(
          saveDrugOrder({ drugOrder: data.drugOrder, isDispensing: true })
        );
      }
    });
  }
  onToggleExpand(rowNumber, drug) {
    this.currentSetDrug = drug;
    if (this.expandedRow === rowNumber) {
      this.expandedRow = undefined;
    } else {
      this.expandedRow = rowNumber;
    }
  }
  onChangeDrugQuantity(quantity) {
    this.currentSetDrug = { ...this.currentSetDrug, quantity };
  }

  onOrderingDrug(drugOrder) {
    this.expandedRow = undefined;
    if (drugOrder.isTheOrderFromDoctor) {
      this.store.dispatch(
        saveDrugOrder({
          drugOrder: DrugOrder.getOrderForSaving({
            ...drugOrder.order,
            providerUuid: drugOrder?.provider?.uuid,
            patientUuid: drugOrder?.patient?.id,
            encounterUuid: drugOrder?.order?.encounterUuid,
            orderType: {
              uuid: drugOrder?.orderType?.id,
              display: drugOrder?.orderType?.name,
            },
            careSetting: 'OUTPATIENT',
            numRefills: 1,
            uuid: null,
            previousNumber: drugOrder.orderNumber,
          }),
          isDispensing: true,
        })
      );
    } else {
      this.store.dispatch(
        saveDrugOrder({
          drugOrder: DrugOrder.getOrderForSaving({
            ...drugOrder.order,
            action: 'NEW',
            providerUuid: drugOrder?.provider?.uuid,
          }),
          isDispensing: true,
        })
      );
    }
  }

  onDispense(e, drugOrder) {
    e.stopPropagation();
    this.store.dispatch(
      dispenseDrug({
        drugOrder: DrugOrder.getOrderForSaving(
          {
            ...drugOrder,
            action: 'DISCONTINUE',
            dispenseAsWritten: true,
          },
          true
        ),
      })
    );
  }

  onCloseForm() {
    this.expandedRow = undefined;
  }
}
