import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefineAdditionalDataFieldsComponent } from './define-additional-data-fields.component';

describe('DefineAdditionalDataFieldsComponent', () => {
  let component: DefineAdditionalDataFieldsComponent;
  let fixture: ComponentFixture<DefineAdditionalDataFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefineAdditionalDataFieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefineAdditionalDataFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
