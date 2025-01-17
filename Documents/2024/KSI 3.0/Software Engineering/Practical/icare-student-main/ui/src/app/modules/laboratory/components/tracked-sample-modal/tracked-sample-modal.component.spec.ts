import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackedSampleModalComponent } from './tracked-sample-modal.component';
import {
  matDialogRefMock,
  matDialogDataMock
} from 'src/test-mocks/material.mocks';

describe('TrackedSampleModalComponent', () => {
  let component: TrackedSampleModalComponent;
  let fixture: ComponentFixture<TrackedSampleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrackedSampleModalComponent],
      providers: [matDialogRefMock, matDialogDataMock]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackedSampleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
