import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import {
  clearDrugOrdersStore,
  clearLabOrders,
  clearRadiologyOrders,
  clearStockMetrics,
  go,
  loadRolesDetails,
} from "../../../store/actions";
import { AppState } from "../../../store/reducers";
import { ICAREApp, ICARE_APPS } from "./modules.constants";

import { map, filter } from "lodash";
import { Observable } from "rxjs";
import { getCurrentLocation } from "../../../store/selectors";
import { clearBillItems } from "../../../store/actions/bill-item.actions";
import { clearBills } from "../../../store/actions/bill.actions";
import { clearDiagnosis } from "../../../store/actions/diagnosis.actions";
import { clearObservations } from "../../../store/actions/observation.actions";
import { clearPayments } from "../../../store/actions/payment.actions";
import { clearVisits } from "../../../store/actions/visit.actions";
import { clearSamples } from "src/app/modules/laboratory/store/actions";
import { clearStockData } from "src/app/store/actions/stock.actions";
import { Router } from "@angular/router";
import { take } from "rxjs/operators";

@Component({
  selector: "app-modules",
  templateUrl: "./modules.component.html",
  styleUrls: ["./modules.component.scss"],
})
export class ModulesComponent implements OnInit {
  apps: ICAREApp[] = ICARE_APPS;
  appsByLocation: ICAREApp[];
  searchTerm: string;
  currentLocation$: Observable<any>;

  constructor(private store: Store<AppState>, private router: Router) {}

  ngOnInit() {
    /*this.currentLocation$ = this.store.select(getCurrentLocation(false));
    this.store.dispatch(loadRolesDetails());
    this.searchModules();

    this.currentLocation$.subscribe((resp) => {
      let assignedApps = this.apps.filter((item: any) => {
        return (
          (
            filter(resp?.attributes, (attribute) => {
              return (
                attribute?.value?.toLowerCase() == item?.id?.toLowerCase() &&
                !attribute?.voided
              );
            }) || []
          )?.length > 0 && item["id"]?.toLowerCase()?.includes("")
        );
      });

      if (assignedApps.length > 0 && assignedApps[0].path) {
        // NB: Navigation has to be moved to module selector
        this.navigateToApp(assignedApps[0].path);
      }
    });*/
  }

  navigateToApp(path): void {
    if (path) {
      this.store.dispatch(clearBillItems());
      this.store.dispatch(clearBills());
      this.store.dispatch(clearDiagnosis());
      this.store.dispatch(clearDrugOrdersStore());
      this.store.dispatch(clearRadiologyOrders());
      this.store.dispatch(clearLabOrders());
      this.store.dispatch(clearObservations());
      this.store.dispatch(clearPayments());
      this.store.dispatch(clearSamples());
      this.store.dispatch(clearVisits());
      this.store.dispatch(clearStockMetrics());
      this.store.dispatch(clearStockData());
      const hasQueryParams = path && path.indexOf("?") > 0 ? true : false;
      const basePath = hasQueryParams ? path.split("?")[0] : path;
      let formattedParam = {};
      hasQueryParams
        ? map(path.split("?")[1].split("&"), (param) => {
            formattedParam[param.split("=")[0]] = param.split("=")[1];
          })
        : (formattedParam = null);

      /**
       * Navigation has been moved to module selector
       */
      // this.store.dispatch(
      //   go({ path: [basePath], extras: { queryParams: formattedParam } })
      // );
    }
  }

  searchModules(event?: Event): void {
    if (event) {
      event.stopPropagation();
      this.searchTerm = (event.target as HTMLInputElement).value;
    } else {
      this.searchTerm = "";
    }
  }
}
