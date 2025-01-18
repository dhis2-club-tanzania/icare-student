import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAdditionalDataFieldsComponent } from './manage-additional-data-fields.component';

describe('ManageAdditionalDataFieldsComponent', () => {
  let component: ManageAdditionalDataFieldsComponent;
  let fixture: ComponentFixture<ManageAdditionalDataFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageAdditionalDataFieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAdditionalDataFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
