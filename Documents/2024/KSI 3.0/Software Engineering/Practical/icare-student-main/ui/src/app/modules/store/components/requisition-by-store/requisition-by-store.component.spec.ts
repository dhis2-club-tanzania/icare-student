import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitionByStoreComponent } from './requisition-by-store.component';

describe("RequisitionByStoreComponent", () => {
  let component: RequisitionByStoreComponent;
  let fixture: ComponentFixture<RequisitionByStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequisitionByStoreComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionByStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
