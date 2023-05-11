import { Component } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  dashboards$:  Observable<any[]>;
constructor(private dashboardService: DashboardService) {}

ngOnInit() {
  this.dashboards$ = this.dashboardService.getAllDashboards();
}
}
