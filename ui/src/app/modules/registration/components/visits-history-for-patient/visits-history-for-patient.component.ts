import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { VisitsService } from 'src/app/shared/resources/visits/services';

@Component({
  selector: 'app-visits-history-for-patient',
  templateUrl: './visits-history-for-patient.component.html',
  styleUrls: ['./visits-history-for-patient.component.scss'],
})
export class VisitsHistoryForPatientComponent implements OnInit {
  @Input() patient: any;
  patientVisits$: Observable<any[]>;
  omitCurrent: boolean = true;
  shouldNotLoadNonVisitItems: boolean = true;
  constructor(private visitService: VisitsService) {}

  ngOnInit(): void {
    this.patientVisits$ = this.visitService.getActiveVisit(
      this.patient?.uuid,
      true,
      this.omitCurrent,
      this.shouldNotLoadNonVisitItems
    );
  }
}
