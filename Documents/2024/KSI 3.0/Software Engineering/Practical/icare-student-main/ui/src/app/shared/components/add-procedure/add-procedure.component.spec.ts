import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProcedureComponent } from './add-procedure.component';

describe('AddProcedureComponent', () => {
  let component: AddProcedureComponent;
  let fixture: ComponentFixture<AddProcedureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProcedureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProcedureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
