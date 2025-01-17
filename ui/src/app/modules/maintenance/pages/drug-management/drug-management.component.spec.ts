import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugManagementComponent } from './drug-management.component';

describe('DrugManagementComponent', () => {
  let component: DrugManagementComponent;
  let fixture: ComponentFixture<DrugManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrugManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
