import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralClientProgramFormsComponent } from './general-client-program-forms.component';

describe('GeneralClientProgramFormsComponent', () => {
  let component: GeneralClientProgramFormsComponent;
  let fixture: ComponentFixture<GeneralClientProgramFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralClientProgramFormsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralClientProgramFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
