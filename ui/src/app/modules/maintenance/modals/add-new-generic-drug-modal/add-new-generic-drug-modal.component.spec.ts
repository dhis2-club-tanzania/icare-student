import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewGenericDrugModalComponent } from './add-new-generic-drug-modal.component';

describe('AddNewGenericDrugModalComponent', () => {
  let component: AddNewGenericDrugModalComponent;
  let fixture: ComponentFixture<AddNewGenericDrugModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewGenericDrugModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewGenericDrugModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
