import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonDrugOrderFormComponent } from './non-drug-order-form.component';

describe('NonDrugOrderFormComponent', () => {
  let component: NonDrugOrderFormComponent;
  let fixture: ComponentFixture<NonDrugOrderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonDrugOrderFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonDrugOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
