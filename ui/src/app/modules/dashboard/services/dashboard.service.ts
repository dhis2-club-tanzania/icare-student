import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  dashboards = [{
    id: 'general', name: 'general'
  }]
  constructor() { }

  getAllDashboards() {
    return of(this.dashboards)
  }

  getDashboardById(id: string) {
    return of(this.dashboards.find(dashboard => dashboard.id === id))
  }
}
