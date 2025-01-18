import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectAnswerModalComponent } from './reject-answer-modal.component';

describe('RejectAnswerModalComponent', () => {
  let component: RejectAnswerModalComponent;
  let fixture: ComponentFixture<RejectAnswerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectAnswerModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectAnswerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
