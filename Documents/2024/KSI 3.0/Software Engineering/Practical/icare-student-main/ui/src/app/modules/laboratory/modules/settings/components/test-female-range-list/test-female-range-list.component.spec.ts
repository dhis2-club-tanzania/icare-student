import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestFemaleRangeListComponent } from './test-female-range-list.component';

describe('TestFemaleRangeListComponent', () => {
  let component: TestFemaleRangeListComponent;
  let fixture: ComponentFixture<TestFemaleRangeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestFemaleRangeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestFemaleRangeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
