import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsToPrintComponent } from './results-to-print.component';

describe('ResultsToPrintComponent', () => {
  let component: ResultsToPrintComponent;
  let fixture: ComponentFixture<ResultsToPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultsToPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsToPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
