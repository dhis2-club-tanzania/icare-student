import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestMaleRangeComponent } from './test-male-range.component';

describe('TestMaleRangeComponent', () => {
  let component: TestMaleRangeComponent;
  let fixture: ComponentFixture<TestMaleRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestMaleRangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestMaleRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
