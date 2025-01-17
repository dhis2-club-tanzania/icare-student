import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestFemaleRangeComponent } from './test-female-range.component';

describe('TestFemaleRangeComponent', () => {
  let component: TestFemaleRangeComponent;
  let fixture: ComponentFixture<TestFemaleRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestFemaleRangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestFemaleRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
