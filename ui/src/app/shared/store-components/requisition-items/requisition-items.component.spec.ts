import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RequisitionItemsComponent } from "./requisition-items.component";

describe("RequisitionItemsComponent", () => {
  let component: RequisitionItemsComponent;
  let fixture: ComponentFixture<RequisitionItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequisitionItemsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
