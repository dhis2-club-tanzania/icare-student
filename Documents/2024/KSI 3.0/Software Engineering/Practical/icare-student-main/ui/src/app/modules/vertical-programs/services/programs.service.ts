import { Injectable } from '@angular/core';
import { OpenmrsHttpClientService } from 'src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service';

@Injectable()
export class ProgramsService {
  constructor(private httpClient: OpenmrsHttpClientService) {}

  getPatieintsEnrollments(patientUuid: string) {
    const url = `programenrollment?patient=${patientUuid}&v=full`;

    return this.httpClient.get(url);
  }

  getAllPrograms() {
    const url = `program?v=full`;

    return this.httpClient.get(url);
  }

  newEnrollment(patientId, payload) {
    const url = `programenrollment?${patientId}/state`;

    return this.httpClient.post(url, payload);
  }
}
