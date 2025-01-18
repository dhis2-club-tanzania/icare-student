import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugOrderFormComponent } from './drug-order-form.component';

describe('DrugOrderFormComponent', () => {
  let component: DrugOrderFormComponent;
  let fixture: ComponentFixture<DrugOrderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrugOrderFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
