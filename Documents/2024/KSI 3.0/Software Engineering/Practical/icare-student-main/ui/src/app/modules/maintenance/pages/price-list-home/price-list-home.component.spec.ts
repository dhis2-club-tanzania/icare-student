import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceListHomeComponent } from './price-list-home.component';

describe('PriceListHomeComponent', () => {
  let component: PriceListHomeComponent;
  let fixture: ComponentFixture<PriceListHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceListHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceListHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
