import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAllocationDashboardComponent } from './test-allocation-dashboard.component';

describe('TestAllocationDashboardComponent', () => {
  let component: TestAllocationDashboardComponent;
  let fixture: ComponentFixture<TestAllocationDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestAllocationDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAllocationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
