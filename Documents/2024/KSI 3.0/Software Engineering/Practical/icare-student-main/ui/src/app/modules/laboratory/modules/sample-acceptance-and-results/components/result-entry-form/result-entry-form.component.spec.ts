import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultEntryFormComponent } from './result-entry-form.component';

describe('ResultEntryFormComponent', () => {
  let component: ResultEntryFormComponent;
  let fixture: ComponentFixture<ResultEntryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultEntryFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultEntryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
