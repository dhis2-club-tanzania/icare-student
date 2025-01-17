import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedRemarksEntryComponent } from './shared-remarks-entry.component';

describe('SharedRemarksEntryComponent', () => {
  let component: SharedRemarksEntryComponent;
  let fixture: ComponentFixture<SharedRemarksEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedRemarksEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedRemarksEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
