import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NearlyStockedOutItemsComponent } from './nearly-stocked-out-items.component';

describe('NearlyStockedOutItemsComponent', () => {
  let component: NearlyStockedOutItemsComponent;
  let fixture: ComponentFixture<NearlyStockedOutItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NearlyStockedOutItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NearlyStockedOutItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
