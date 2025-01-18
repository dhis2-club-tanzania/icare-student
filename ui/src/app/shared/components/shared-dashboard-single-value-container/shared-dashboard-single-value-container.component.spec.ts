import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedDashboardSingleValueContainerComponent } from './shared-dashboard-single-value-container.component';

describe('SharedDashboardSingleValueContainerComponent', () => {
  let component: SharedDashboardSingleValueContainerComponent;
  let fixture: ComponentFixture<SharedDashboardSingleValueContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedDashboardSingleValueContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedDashboardSingleValueContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
