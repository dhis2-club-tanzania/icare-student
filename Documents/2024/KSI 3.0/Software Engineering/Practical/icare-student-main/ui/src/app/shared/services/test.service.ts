import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../constants/constants.constants';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  constructor(private httpClient: HttpClient) {}

  updateTestAvailability(payload, testConceptUuid, mappingUuid) {
    let url = `${BASE_URL}concept/${testConceptUuid}/mapping/${
      mappingUuid ? mappingUuid : ''
    }`;

    return this.httpClient.post(url, payload);
  }

  saveTestTimeSettings(configs) {
    const url = `${BASE_URL}lab/testtime`;

    return this.httpClient.post(url, configs);
  }

  updateTestTimeSettings(configs){
    
    const url = `${BASE_URL}lab/testtime/${configs?.uuid}`;

    return this.httpClient.post(url,configs);
  }

  getTestTimeSettingByTestConcept(testConceptUuid) {
    const url = `${BASE_URL}lab/testtime?concept=${testConceptUuid}`;

    return this.httpClient.get(url);
  }

  saveTestMaleRangeConfigs(configs) {
    const url = `${BASE_URL}lab/testrange`;

    return this.httpClient.post(url, configs);
  }

 

  saveTestFemaleRangeConfigs(configs) {
    const url = `${BASE_URL}lab/testrange`;

    return this.httpClient.post(url, configs);
  }

  getTestValueRangesByTestConcept(testConceptUuid) {
    const url = `${BASE_URL}lab/testrange?concept=${testConceptUuid}`;

    return this.httpClient.get(url);
  }

  updateTestValuesRange(configs){
    const url = `${BASE_URL}lab/testrange/${configs?.uuid}`;

    return this.httpClient.post(url, configs);
  }
  
}
