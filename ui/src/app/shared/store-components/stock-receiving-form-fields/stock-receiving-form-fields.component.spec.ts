import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StockReceivingFormFieldsComponent } from "./stock-receiving-form-fields.component";

describe("StockReceivingFormFieldsComponent", () => {
  let component: StockReceivingFormFieldsComponent;
  let fixture: ComponentFixture<StockReceivingFormFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockReceivingFormFieldsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockReceivingFormFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
