import { Injectable } from "@angular/core";
import { from, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
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
  constructor(private api: Api) {}

  getPrivileges(parameters: any): Observable<PrivilegeGetFull[]> {
    return from(this.api.privilege.getAllPrivileges(parameters)).pipe(
      map((response) => response?.results),
      catchError((error) => of(error))
    );
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
    return from(this.api.role.getAllRoles(parameters)).pipe(
      map((response) => response?.results),
      catchError((error) => of(error))
    );
  }

  deleteRole(id: string): Observable<any> {
    return from(this.api.role.deleteRole(id)).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }

  addNewOrUpdateRole(role: RoleCreate): Observable<RoleCreateFull> {
    return (
      role?.uuid
        ? from(this.api.role.updateRole(role?.uuid, role))
        : from(this.api.role.createRole(role))
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
