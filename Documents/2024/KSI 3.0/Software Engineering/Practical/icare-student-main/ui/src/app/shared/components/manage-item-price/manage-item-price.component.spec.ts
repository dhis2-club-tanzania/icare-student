/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { ManageItemPriceComponent } from "./manage-item-price.component";
import {
  matDialogDataMock,
  matDialogRefMock,
} from "src/test-mocks/material.mocks";
import { ItemPriceService } from "../../../modules/maintenance/services/item-price.service";
import { of } from "rxjs";

describe("ManageItemPriceComponent", () => {
  let component: ManageItemPriceComponent;
  let fixture: ComponentFixture<ManageItemPriceComponent>;

  class ItemPriceServiceMock {
    getConceptClasses() {
      return of(null);
    }
  }

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ManageItemPriceComponent],
        providers: [
          matDialogDataMock,
          matDialogRefMock,
          { provide: ItemPriceService, useClass: ItemPriceServiceMock },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageItemPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
