import { Injectable } from "@angular/core";
import { from, Observable, of } from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from "rxjs/operators";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";

@Injectable({
  providedIn: "root",
})
export class SystemUsersService {
  constructor(private httpClient: OpenmrsHttpClientService) {}

  getUsers(params): Observable<any[]> {
    const url = `user?startIndex=${params?.startIndex}&limit=${params?.limit}&v=full&q=${params?.q}`;
    return this.httpClient.get(url).pipe(
      map((response) => response?.results),
      catchError((error) => of(error))
    );
  }

  getUserById(id: string): Observable<any> {
    const url = `user/${id}?v=custom:(uuid,display,roles,allRoles,username,userProperties,retired,person:(uuid,display,attributes,birthdate,gender,display,preferredName,preferredAddress))`;
    return this.httpClient.get(url);
  }

  getPersonById(id: string): Observable<any> {
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

  searchUsers(searchTerm: string): Observable<any[]> {
    const url = `user?q=${searchTerm}&v=full`;
    return this.httpClient.get(url);
  }

  getRoles() {
    const url = "role?startIndex=0&limit=100";
    return this.httpClient.get(url).pipe(
      map((response) => {
        return response?.results;
      }),
      catchError((error) => of(error))
    );
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

  createPerson({ person }): Observable<any> {
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
      "location?limit=100&tag=Login+Location&v=custom:(display,uuid,tags,description,parentLocation,childLocations,attributes:(attributeType,uuid,value,display))"
    );
  }

  createProvider({ provider }): Observable<any> {
    const url = "provider";
    return this.httpClient.post(url, provider);
  }

  getProviderByUserUuid(userUuid: string): Observable<any> {
    return this.httpClient
      .get(`provider?user=${userUuid}&v=custom:(uuid,display,attributes)`)
      .pipe(
        map((response) => response?.results),
        catchError((error) => of(error))
      );
  }
}
