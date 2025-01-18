import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestParameterEntryComponent } from './test-parameter-entry.component';

describe('TestParameterEntryComponent', () => {
  let component: TestParameterEntryComponent;
  let fixture: ComponentFixture<TestParameterEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestParameterEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestParameterEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
