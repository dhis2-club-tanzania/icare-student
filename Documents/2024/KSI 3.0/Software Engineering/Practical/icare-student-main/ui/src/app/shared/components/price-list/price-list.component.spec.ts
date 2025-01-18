/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement, NO_ERRORS_SCHEMA } from "@angular/core";

import { PriceListComponent } from "./price-list.component";
import { matDialogProviderMock } from "src/test-mocks/material.mocks";
import { MatMenuModule } from "@angular/material/menu";
import { ItemPriceService } from "../../../modules/maintenance/services/item-price.service";
import { of } from "rxjs";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { AppState } from "src/app/store/reducers";
import { storePages } from "src/app/modules/store/pages";
import { storeDataMock } from "src/test-mocks/store-data.mock";
import { PricingService } from "../../../modules/maintenance/services";

describe("PriceListComponent", () => {
  let component: PriceListComponent;
  let fixture: ComponentFixture<PriceListComponent>;
  let store: MockStore<AppState>;

  class ItemPriceServiceMock {
    getItemPrices() {
      return of([]);
    }

    getPaymentTypes() {
      return of([]);
    }
  }

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        declarations: [PriceListComponent],
        providers: [
          matDialogProviderMock,
          { provide: ItemPriceService, useClass: ItemPriceServiceMock },
          { provide: PricingService, useValue: null },
          provideMockStore(storeDataMock),
        ],
        imports: [MatMenuModule],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceListComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
