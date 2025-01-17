import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitionReceiptByStoreComponent } from './requisition-receipt-by-store.component';

describe("RequisitionReceiptByStoreComponent", () => {
  let component: RequisitionReceiptByStoreComponent;
  let fixture: ComponentFixture<RequisitionReceiptByStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequisitionReceiptByStoreComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionReceiptByStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
