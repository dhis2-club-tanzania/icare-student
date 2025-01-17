import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedDashboardSingleValueItemComponent } from './shared-dashboard-single-value-item.component';

describe('SharedDashboardSingleValueItemComponent', () => {
  let component: SharedDashboardSingleValueItemComponent;
  let fixture: ComponentFixture<SharedDashboardSingleValueItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedDashboardSingleValueItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedDashboardSingleValueItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
