import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedDashboardContainerComponent } from './shared-dashboard-container.component';

describe('SharedDashboardContainerComponent', () => {
  let component: SharedDashboardContainerComponent;
  let fixture: ComponentFixture<SharedDashboardContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedDashboardContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedDashboardContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
