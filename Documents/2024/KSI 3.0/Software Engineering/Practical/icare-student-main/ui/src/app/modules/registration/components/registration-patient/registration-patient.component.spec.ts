import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationPatientComponent } from './registration-patient.component';
import { RouterTestingModule } from '@angular/router/testing';
import { materialModules } from 'src/app/shared/material-modules';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OpenmrsHttpClientService } from 'src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service';
import { provideMockStore } from '@ngrx/store/testing';

describe('RegistrationPatientComponent', () => {
  let component: RegistrationPatientComponent;
  let fixture: ComponentFixture<RegistrationPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ...materialModules,
        BrowserAnimationsModule,
      ],
      declarations: [RegistrationPatientComponent],
      providers: [
        provideMockStore({
          initialState: {
            currentPatient: {
              auditInfo: null,
              links: null,
              uuid: null,
              display: null,
              identifiers: null,
              preferred: null,
              voided: null,
              person: null,
            },
            locations: { currentUserCurrentLocation: null },
          },
        }),
        { provide: OpenmrsHttpClientService, useValue: null },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
