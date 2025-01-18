import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksheetControlsComponent } from './worksheet-controls.component';

describe('WorksheetControlsComponent', () => {
  let component: WorksheetControlsComponent;
  let fixture: ComponentFixture<WorksheetControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorksheetControlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorksheetControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
