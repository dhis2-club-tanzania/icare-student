import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWorksheetComponent } from './create-worksheet.component';

describe('CreateWorksheetComponent', () => {
  let component: CreateWorksheetComponent;
  let fixture: ComponentFixture<CreateWorksheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateWorksheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWorksheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
