import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestMethodsDashboardComponent } from './test-methods-dashboard.component';

describe('TestMethodsDashboardComponent', () => {
  let component: TestMethodsDashboardComponent;
  let fixture: ComponentFixture<TestMethodsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestMethodsDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestMethodsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
