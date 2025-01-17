import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksheetConfigurationComponent } from './worksheet-configuration.component';

describe('WorksheetConfigurationComponent', () => {
  let component: WorksheetConfigurationComponent;
  let fixture: ComponentFixture<WorksheetConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorksheetConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorksheetConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
