import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NursingProceduresHistoryComponent } from './nursing-procedures-history.component';

describe('NursingProceduresHistoryComponent', () => {
  let component: NursingProceduresHistoryComponent;
  let fixture: ComponentFixture<NursingProceduresHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NursingProceduresHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NursingProceduresHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
