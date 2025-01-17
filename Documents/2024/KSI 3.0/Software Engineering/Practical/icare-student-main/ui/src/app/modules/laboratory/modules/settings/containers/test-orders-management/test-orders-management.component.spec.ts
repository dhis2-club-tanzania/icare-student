import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestOrdersManagementComponent } from './test-orders-management.component';

describe('TestOrdersManagementComponent', () => {
  let component: TestOrdersManagementComponent;
  let fixture: ComponentFixture<TestOrdersManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestOrdersManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestOrdersManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
