import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationSearchComponent } from './registration-search.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { materialModules } from 'src/app/shared/material-modules';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';

describe('RegistrationSearchComponent', () => {
  let component: RegistrationSearchComponent;
  let fixture: ComponentFixture<RegistrationSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ...materialModules,
        BrowserAnimationsModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [RegistrationSearchComponent],
      providers:[provideMockStore({initialState: {currentPatient: {auditInfo: null,
        links: null,
        uuid: null,
        display: null,
        identifiers: null,
        preferred: null,
        voided: null,
        person: null}, locations: {currentUserCurrentLocation: null}}})]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
