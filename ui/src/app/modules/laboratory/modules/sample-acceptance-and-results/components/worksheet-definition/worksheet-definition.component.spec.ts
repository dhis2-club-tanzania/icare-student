import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksheetDefinitionComponent } from './worksheet-definition.component';

describe('WorksheetDefinitionComponent', () => {
  let component: WorksheetDefinitionComponent;
  let fixture: ComponentFixture<WorksheetDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorksheetDefinitionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorksheetDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
