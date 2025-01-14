import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityFormFieldComponent } from './quantity-form-field.component';

describe('QuantityFormFieldComponent', () => {
  let component: QuantityFormFieldComponent;
  let fixture: ComponentFixture<QuantityFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuantityFormFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantityFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
