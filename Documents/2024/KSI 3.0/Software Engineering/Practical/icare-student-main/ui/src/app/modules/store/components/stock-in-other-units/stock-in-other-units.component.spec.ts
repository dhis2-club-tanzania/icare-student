import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockInOtherUnitsComponent } from './stock-in-other-units.component';

describe('StockInOtherUnitsComponent', () => {
  let component: StockInOtherUnitsComponent;
  let fixture: ComponentFixture<StockInOtherUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockInOtherUnitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockInOtherUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
