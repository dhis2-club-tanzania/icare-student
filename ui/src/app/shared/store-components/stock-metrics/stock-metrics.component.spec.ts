import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StockMetricsComponent } from "./stock-metrics.component";

describe("StockMetricsComponent", () => {
  let component: StockMetricsComponent;
  let fixture: ComponentFixture<StockMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockMetricsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
