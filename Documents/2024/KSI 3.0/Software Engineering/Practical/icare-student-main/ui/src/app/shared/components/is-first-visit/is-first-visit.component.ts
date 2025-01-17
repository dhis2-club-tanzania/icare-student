import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { VisitsService } from '../../resources/visits/services';

@Component({
  selector: 'app-is-first-visit',
  templateUrl: './is-first-visit.component.html',
  styleUrls: ['./is-first-visit.component.scss'],
})
export class IsFirstVisitComponent implements OnInit {
  @Input() patient: string;
  isFirstVisit$: Observable<boolean>;
  constructor(private visitService: VisitsService) {}

  ngOnInit(): void {
    this.isFirstVisit$ = this.visitService.isThisFirstVisit(this.patient);
  }
}
