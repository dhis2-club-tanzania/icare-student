import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { ItemPriceService } from "src/app/shared/services/item-price.service";
import { go } from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";

@Component({
  selector: "app-maintenance-home",
  templateUrl: "./maintenance-home.component.html",
  styleUrls: ["./maintenance-home.component.scss"],
})
export class MaintenanceHomeComponent implements OnInit {
  pages: any[];
  currentMenuDepartments$: Observable<any[]>;
  routeParams$: Observable<Params>;
  currentMenu: any;
  constructor(
    private store: Store<AppState>,
    private itemPriceService: ItemPriceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routeParams$ = this.route.params;
    this.pages = [
      {
        id: "price-list",
        name: "Price List",
        searchCode: "PRICE_LIST",
        children: [{ id: "dept-1" }],
      },
      { id: "users-management", name: "User Management" },
      { id: "drug", name: "Drug Management" },
      { id: "location", name: "Location Management" },
      { id: "system-settings", name: "System Settings" },
      { id: "system-privileges-and-roles", name: "Privileges & Roles" },
      { id: "reports-settings", name: "Reports" },
    ];

    this.getDepartmentsForTheCurrentMenu(this.pages[0]);
  }

  getDepartmentsForTheCurrentMenu(currentMenu: any): void {
    if (currentMenu && currentMenu?.searchCode) {
      this.currentMenuDepartments$ =
        this.itemPriceService.getDepartmentsByMappingSearchQuery(
          currentMenu?.searchCode
        );
    } else {
      this.currentMenuDepartments$ = of(null);
    }
  }

  setRoute(event: Event, id: string): void {
    event.stopPropagation();
    this.store.dispatch(
      go({
        path: ["maintenance/" + id],
      })
    );
  }

  onNnavigateToThis(event: Event, page: any): void {
    event.stopPropagation();
    this.currentMenu = page;

    const currentPath = "/maintenance/" + page?.id;
    this.store.dispatch(
      go({
        path: [currentPath],
      })
    );
  }
}
