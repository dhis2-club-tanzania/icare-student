import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestMaleRangeListComponent } from './test-male-range-list.component';

describe('TestMaleRangeListComponent', () => {
  let component: TestMaleRangeListComponent;
  let fixture: ComponentFixture<TestMaleRangeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestMaleRangeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestMaleRangeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
