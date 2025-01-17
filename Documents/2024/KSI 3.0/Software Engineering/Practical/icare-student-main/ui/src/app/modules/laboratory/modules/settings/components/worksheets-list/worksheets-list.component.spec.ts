import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksheetsListComponent } from './worksheets-list.component';

describe('WorksheetsListComponent', () => {
  let component: WorksheetsListComponent;
  let fixture: ComponentFixture<WorksheetsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorksheetsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorksheetsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
