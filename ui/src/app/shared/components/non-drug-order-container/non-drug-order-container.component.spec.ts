import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonDrugOrderContainerComponent } from './non-drug-order-container.component';

describe('NonDrugOrderContainerComponent', () => {
  let component: NonDrugOrderContainerComponent;
  let fixture: ComponentFixture<NonDrugOrderContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonDrugOrderContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonDrugOrderContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
