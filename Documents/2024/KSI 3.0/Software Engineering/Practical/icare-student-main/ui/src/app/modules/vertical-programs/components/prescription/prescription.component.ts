import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import {
  removeDrugOrder,
  saveDrugOrder,
  updateDrugOrder,
} from 'src/app/store/actions';
import { Observable } from 'rxjs';
import {
  getAllDrugOrders,
  getConsultationEncounterUuid,
  getOrderTypesByName,
} from 'src/app/store/selectors';
import { Patient } from 'src/app/shared/resources/patient/models/patient.model';
import { getCurrentPatient } from 'src/app/store/selectors/current-patient.selectors';
import { DrugOrder } from 'src/app/shared/resources/order/models/drug-order.model';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss'],
})
export class PrescriptionComponent implements OnInit {
  expandedRow: number;
  currentDrugOrder: any;
  countOfDrugsOrdered: number = 0;
  drugsOrdered$: Observable<any>;
  consultationEncounterUuid$: Observable<string>;
  patient$: Observable<Patient>;
  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.consultationEncounterUuid$ = this.store.pipe(
      select(getConsultationEncounterUuid)
    );
    this.patient$ = this.store.pipe(select(getCurrentPatient));
    this.drugsOrdered$ = this.store.select(getAllDrugOrders);
  }

  onToggleExpand(rowNumber) {
    if (this.expandedRow === rowNumber) {
      this.expandedRow = undefined;
    } else {
      this.expandedRow = rowNumber;
    }
  }

  onOrderingDrug(drugOrder) {
    this.currentDrugOrder = drugOrder;
    this.countOfDrugsOrdered++;
    if (!drugOrder.uuid) {
      this.store.dispatch(
        saveDrugOrder({ drugOrder: DrugOrder.getOrderForSaving(drugOrder) })
      );
    } else {
      this.store.dispatch(
        updateDrugOrder({
          drugOrder: DrugOrder.getOrderForSaving(drugOrder),
        })
      );
    }
  }

  removeDrugFromList(drugOrder) {
    this.store.dispatch(removeDrugOrder({ orderId: drugOrder.id }));
    this.currentDrugOrder = null;
  }
}
