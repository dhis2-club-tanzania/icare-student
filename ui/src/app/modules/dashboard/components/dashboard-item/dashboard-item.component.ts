import { Component, Input } from '@angular/core';
import { DashboardDataService } from '../../services/dashboard-data.service';

@Component({
  selector: 'app-dashboard-item',
  templateUrl: './dashboard-item.component.html',
  styleUrls: ['./dashboard-item.component.scss']
})
export class DashboardItemComponent {
@Input() dashboardItem: any;
constructor(private dataService: DashboardDataService) {}
}
