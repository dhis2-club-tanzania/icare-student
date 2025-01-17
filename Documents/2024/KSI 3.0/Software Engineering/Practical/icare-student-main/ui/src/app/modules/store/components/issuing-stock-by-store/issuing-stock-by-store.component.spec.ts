import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuingStockByStoreComponent } from './issuing-stock-by-store.component';

describe("IssuingStockByStoreComponent", () => {
  let component: IssuingStockByStoreComponent;
  let fixture: ComponentFixture<IssuingStockByStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IssuingStockByStoreComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuingStockByStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
