import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RegistrationPatientComponent } from './components/registration-patient/registration-patient.component';
import { RegistrationSearchComponent } from './components/registration-search/registration-search.component';
import { SelectRoomComponent } from './components/select-room/select-room.component';
import { HomeComponent } from './containers/home/home.component';
import { registrationPages } from './pages';
import { RegistrationRoutingModule } from './registration-routing.module';
import { PatientEditComponent } from './pages/patient-edit/patient-edit.component';
import { RegistrationEditComponent } from './components/registration-edit/registration-edit.component';
import { entryRegComponents, regComponents } from './components';
import { LocationsChipsComponent } from './components/locations-chips/locations-chips.component';
import { RegistrationSummaryCardsComponent } from './components/registration-summary-cards/registration-summary-cards/registration-summary-cards.component';

@NgModule({
  declarations: [
    ...registrationPages,
    HomeComponent,
    RegistrationSearchComponent,
    RegistrationPatientComponent,
    SelectRoomComponent,
    PatientEditComponent,
    RegistrationEditComponent,
    ...regComponents,
    LocationsChipsComponent,
    RegistrationSummaryCardsComponent,
  ],
  entryComponents: [...entryRegComponents],
  imports: [CommonModule, RegistrationRoutingModule, SharedModule],
})
export class RegistrationModule {}
