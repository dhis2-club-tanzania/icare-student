import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { PersonCreateModel, UserCreateModel } from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private httpClient: OpenmrsHttpClientService) {}

  getUsers(params): Observable<any[]> {
    const url = `user?startIndex=0&limit=10&v=full&q=${params?.q}`;
    return this.httpClient.get(url);
  }
  getUserById(id: string): Observable<UserCreateModel> {
    const url = `user/${id}?v=full`;
    return this.httpClient.get(url);
  }

  getPersonById(id: string): Observable<PersonCreateModel> {
    const url = `person/${id}?v=full`;
    return this.httpClient.get(url);
  }
  searchUser(searchTerm: string): Observable<any> {
    return of(searchTerm).pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap((term) => this.searchUsers(term))
    );
  }

  searchUsers(searchTerm: string): Observable<UserCreateModel[]> {
    const url = `user?q=${searchTerm}&v=full`;
    return this.httpClient.get(url);
  }
  getRoles() {
    const url = "role?startIndex=0&limit=100";
    return this.httpClient.get(url);
  }
  updateUser({ data, uuid }): Observable<any> {
    const url = `user/${uuid}`;
    return this.httpClient.post(url, data);
  }
  getPrefferedAddress({ person }): Observable<any> {
    const url = `person/${person}/address?v=full`;
    return this.httpClient.get(url);
  }
  createPersonAddress({ address, uuid }): Observable<any> {
    const url = `person/${uuid}/address`;
    return this.httpClient.post(url, address);
  }
  getLocations({ query }): Observable<any> {
    const url = `location?q=${query}&tag=Login+Location`;
    return this.httpClient.get(url);
  }
  searchLocation(searchTerm: string): Observable<any> {
    return of(searchTerm).pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap((query) => this.getLocations({ query }))
    );
  }
  createPerson({ person }): Observable<PersonCreateModel> {
    const url = `person`;
    return this.httpClient.post(url, person);
  }
  createUser({ user }): Observable<any> {
    const url = `user`;
    return this.httpClient.post(url, user);
  }

  deletePerson({ uuid }): Observable<any> {
    const url = `person/${uuid}?purge=true`;
    return this.httpClient.delete(url);
  }

  getLocationByUuid({ uuid }): Observable<any> {
    const url = `location/${uuid}`;
    return this.httpClient.get(url);
  }

  getLoginLocations(): Observable<any> {
    return this.httpClient.get(
      "location?limit=100&tag=Login+Location&v=custom:(display,country,postalCode,stateProvince,uuid,tags,description,parentLocation,childLocations,attributes:(attributeType,uuid,value,display))"
    );
  }
  createProvider({ provider }): Observable<any> {
    const url = "provider";
    return this.httpClient.post(url, provider);
  }
}
