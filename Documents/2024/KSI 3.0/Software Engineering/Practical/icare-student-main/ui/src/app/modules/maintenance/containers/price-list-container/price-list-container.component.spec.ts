import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceListContainerComponent } from './price-list-container.component';

describe('PriceListContainerComponent', () => {
  let component: PriceListContainerComponent;
  let fixture: ComponentFixture<PriceListContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceListContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
