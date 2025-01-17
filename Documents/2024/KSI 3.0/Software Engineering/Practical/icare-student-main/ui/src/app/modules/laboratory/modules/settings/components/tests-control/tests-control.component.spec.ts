import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsControlComponent } from './tests-control.component';

describe('TestsControlComponent', () => {
  let component: TestsControlComponent;
  let fixture: ComponentFixture<TestsControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestsControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
