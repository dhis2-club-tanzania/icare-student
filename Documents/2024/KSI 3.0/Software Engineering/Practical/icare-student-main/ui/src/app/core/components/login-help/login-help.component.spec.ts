import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginHelpComponent } from './login-help.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { materialModules } from 'src/app/shared/material-modules';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { matDialogRefMock } from 'src/test-mocks/material.mocks';

describe('LoginHelpComponent', () => {
  let component: LoginHelpComponent;
  let fixture: ComponentFixture<LoginHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [...materialModules],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [LoginHelpComponent],
      providers: [matDialogRefMock],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
