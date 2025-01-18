import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedDepartmentsSelectionComponent } from './shared-departments-selection.component';

describe('SharedDepartmentsSelectionComponent', () => {
  let component: SharedDepartmentsSelectionComponent;
  let fixture: ComponentFixture<SharedDepartmentsSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedDepartmentsSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedDepartmentsSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
