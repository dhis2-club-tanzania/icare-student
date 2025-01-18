import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabPriceListHomeContainerComponent } from './lab-price-list-home-container.component';

describe('LabPriceListHomeContainerComponent', () => {
  let component: LabPriceListHomeContainerComponent;
  let fixture: ComponentFixture<LabPriceListHomeContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabPriceListHomeContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LabPriceListHomeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
