import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabPriceListHomeComponent } from './lab-price-list-home.component';

describe('LabPriceListHomeComponent', () => {
  let component: LabPriceListHomeComponent;
  let fixture: ComponentFixture<LabPriceListHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabPriceListHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LabPriceListHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
