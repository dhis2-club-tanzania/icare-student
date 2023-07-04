import { Injectable } from '@angular/core';
import {of} from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  dashboard =[{
    id: 'general', name: 'GENERAL',
    
  }]
  constructor() { }
  getAllDashboards(){
    return of(this.dashboard)
  }

  // getDashboardById(id: string){
  //   return of(this.getAllDashboards.find((dashboard => dashboard.id === id)))
  // }
  getDashboardById(id: string) {
    return this.getAllDashboards().pipe(
      map(dashboards => dashboards.find(dashboard => dashboard.id === id))
    );
  }
  
}
