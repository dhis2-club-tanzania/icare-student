import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LbPriceListContainerComponent } from './lb-price-list-container.component';

describe('LbPriceListContainerComponent', () => {
  let component: LbPriceListContainerComponent;
  let fixture: ComponentFixture<LbPriceListContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LbPriceListContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LbPriceListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
