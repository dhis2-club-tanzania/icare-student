import { ThrowStmt } from "@angular/compiler";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { RequisitionInput } from "src/app/shared/resources/store/models/requisition-input.model";
import { RequisitionObject } from "src/app/shared/resources/store/models/requisition.model";
import { RequisitionService } from "src/app/shared/resources/store/services/requisition.service";
import {
  cancelRequisition,
  createRequest,
  loadRequisitions,
  receiveRequisition,
  rejectRequisition,
} from "src/app/store/actions/requisition.actions";
import { AppState } from "src/app/store/reducers";
import {
  getCurrentLocation,
  getLocations,
  getStoreLocations,
} from "src/app/store/selectors";
import { getAllStockableItems } from "src/app/store/selectors/pricing-item.selectors";
import {
  getActiveRequisitions,
  getAllRequisitions,
  getRequisitionLoadingState,
} from "src/app/store/selectors/requisition.selectors";
import { RequestCancelComponent } from "../../modals/request-cancel/request-cancel.component";
import { RequisitionFormComponent } from "../../modals/requisition-form/requisition-form.component";

@Component({
  selector: "app-requisition-page",
  templateUrl: "./requisition-page.component.html",
  styleUrls: ["./requisition-page.component.scss"],
})
export class RequisitionPageComponent implements OnInit {
  currentStore$: Observable<any>;
  constructor(
    private store: Store<AppState>,
  ){}

  ngOnInit() {
    this.currentStore$ = this.store.pipe(select(getCurrentLocation));
  }
}
