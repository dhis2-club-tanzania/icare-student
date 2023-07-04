import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-current-dashboard',
  templateUrl: './current-dashboard.component.html',
  styleUrls: ['./current-dashboard.component.scss']
})
export class CurrentDashboardComponent {
currentDashboard$: Observable<any>
  constructor(private route: ActivatedRoute, private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params)=>{
      console.log(params)
      this.currentDashboard$= this.dashboardService.getDashboardById(params['dashboardId'])
    }
    )
  }

}
