import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedPriceListComponent } from './shared-price-list.component';

describe('SharedPriceListComponent', () => {
  let component: SharedPriceListComponent;
  let fixture: ComponentFixture<SharedPriceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedPriceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedPriceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
