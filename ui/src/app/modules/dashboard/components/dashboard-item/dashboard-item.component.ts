import { Component, Input, OnInit } from '@angular/core';
import { DashboardDataService } from '../../services/dashboard-data.service';
@Component({
  selector: 'app-dashboard-item',
  templateUrl: './dashboard-item.component.html',
  styleUrls: ['./dashboard-item.component.scss']
})
export class DashboardItemComponent implements OnInit {
  @Input() dashboardItem: any

  constructor(private dataService: DashboardDataService) { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  }


    
  