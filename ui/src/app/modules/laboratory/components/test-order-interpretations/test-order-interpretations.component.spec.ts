import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestOrderInterpretationsComponent } from './test-order-interpretations.component';

describe('TestOrderInterpretationsComponent', () => {
  let component: TestOrderInterpretationsComponent;
  let fixture: ComponentFixture<TestOrderInterpretationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestOrderInterpretationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestOrderInterpretationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
