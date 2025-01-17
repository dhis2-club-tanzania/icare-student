import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StockReceivingFormComponent } from "./stock-receiving-form.component";

describe("StockReceivingFormComponent", () => {
  let component: StockReceivingFormComponent;
  let fixture: ComponentFixture<StockReceivingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockReceivingFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockReceivingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
