import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodedAnswersSelectionComponent } from './coded-answers-selection.component';

describe('CodedAnswersSelectionComponent', () => {
  let component: CodedAnswersSelectionComponent;
  let fixture: ComponentFixture<CodedAnswersSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodedAnswersSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodedAnswersSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
