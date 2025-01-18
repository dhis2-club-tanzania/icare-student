import { Injectable } from "@angular/core";
import { from, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import {
  Api,
  PrivilegeCreate,
  PrivilegeCreateFull,
  PrivilegeGetFull,
  RoleCreate,
  RoleCreateFull,
  RoleGetFull,
} from "../resources/openmrs";

@Injectable({
  providedIn: "root",
})
export class PrivilegesAndRolesService {
  roleToSave: any = {};
  constructor(private api: Api, private httpClient: OpenmrsHttpClientService) {}

  getPrivileges(parameters: any): Observable<PrivilegeGetFull[]> {
    if (
      parameters?.q === undefined ||
      parameters?.q === "" ||
      parameters?.q === null
    ) {
      return from(this.api.privilege.getAllPrivileges(parameters)).pipe(
        map((response) => response?.results),
        catchError((error) => of(error))
      );
    } else {
      return this.httpClient
        .get(
          `icare/privileges?q=${parameters.q}&startIndex=${parameters?.startIndex}&limit=${parameters?.limit}`
        )
        .pipe(
          map((response) => response),
          catchError((error) => of(error))
        );
    }
  }

  deletePrivilege(id: string): Observable<any> {
    return from(this.api.privilege.deletePrivilege(id)).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }

  addNewPrivilege(privilege: PrivilegeCreate): Observable<PrivilegeCreateFull> {
    return from(this.api.privilege.createPrivilege(privilege)).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => of(error))
    );
  }

  getRoles(parameters: any): Observable<RoleGetFull[]> {
    if (
      parameters?.q === undefined ||
      parameters?.q === "" ||
      parameters?.q === null
    ) {
      return from(this.api.role.getAllRoles(parameters)).pipe(
        map((response) => response?.results),
        catchError((error) => of(error))
      );
    } else {
      return this.httpClient.get(`icare/roles?q=${parameters.q}`).pipe(
        map((response) => response),
        catchError((error) => of(error))
      );
    }
  }

  deleteRole(id: string): Observable<any> {
    return from(this.api.role.deleteRole(id)).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }

  addNewOrUpdateRole(role: RoleCreate): Observable<RoleCreateFull> {
    // roleToSave is created so as to eliminate uuid in role to enable saving
    this.roleToSave = {
      description: role?.description,
      name: role?.name,
      privileges: role?.privileges,
      inheritedRoles: role?.inheritedRoles,
    };
    return (
      role?.uuid
        ? from(this.api.role.updateRole(role?.uuid, role))
        : from(this.api.role.createRole(this.roleToSave))
    ).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => of(error))
    );
  }

  getRoleById(id: string): Observable<RoleGetFull> {
    return from(this.api.role.getRole(id, { v: "full" })).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => of(error))
    );
  }
}
