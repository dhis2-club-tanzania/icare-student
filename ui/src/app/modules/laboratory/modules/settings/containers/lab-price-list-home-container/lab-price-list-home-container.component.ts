import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { loadConceptByUuid } from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import { getConceptById } from "src/app/store/selectors";

@Component({
  selector: "app-lab-price-list-home-container",
  templateUrl: "./lab-price-list-home-container.component.html",
  styleUrl: "./lab-price-list-home-container.component.scss",
})
export class LabPriceListHomeContainerComponent implements OnInit {
  paymentCategories$: Observable<any>;
  constructor(private store: Store<AppState>) {}
  ngOnInit(): void {
    // TODO: Save the uuid on global properties, and switch-map accordingly
    this.store.dispatch(
      loadConceptByUuid({
        uuid: "c95c1065-bcea-4a35-aee0-ca62906ec8e2",
        fields: "custom:(uuid,display,setMembers:(uuid,display)",
      })
    );
    this.paymentCategories$ = this.store.select(getConceptById, {
      id: "c95c1065-bcea-4a35-aee0-ca62906ec8e2",
    });
  }
}
