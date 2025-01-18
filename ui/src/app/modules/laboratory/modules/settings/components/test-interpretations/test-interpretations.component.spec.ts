import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestInterpretationsComponent } from './test-interpretations.component';

describe('TestInterpretationsComponent', () => {
  let component: TestInterpretationsComponent;
  let fixture: ComponentFixture<TestInterpretationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestInterpretationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestInterpretationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
