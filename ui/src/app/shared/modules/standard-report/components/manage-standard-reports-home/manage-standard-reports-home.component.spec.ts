import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStandardReportsHomeComponent } from './manage-standard-reports-home.component';

describe('ManageStandardReportsHomeComponent', () => {
  let component: ManageStandardReportsHomeComponent;
  let fixture: ComponentFixture<ManageStandardReportsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageStandardReportsHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageStandardReportsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
