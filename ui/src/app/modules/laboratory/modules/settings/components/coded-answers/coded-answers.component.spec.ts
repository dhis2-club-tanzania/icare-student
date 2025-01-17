import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodedAnswersComponent } from './coded-answers.component';

describe('CodedAnswersComponent', () => {
  let component: CodedAnswersComponent;
  let fixture: ComponentFixture<CodedAnswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodedAnswersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodedAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
