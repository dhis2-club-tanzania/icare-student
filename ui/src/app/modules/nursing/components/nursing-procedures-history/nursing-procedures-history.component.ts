import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { VisitsService } from 'src/app/shared/resources/visits/services';

@Component({
  selector: 'app-nursing-procedures-history',
  templateUrl: './nursing-procedures-history.component.html',
  styleUrls: ['./nursing-procedures-history.component.scss'],
})
export class NursingProceduresHistoryComponent implements OnInit {
  @Input() patientUuid: string;
  omitCurrent: boolean = true;
  patientVisits$: Observable<any>;
  constructor(private visitService: VisitsService) {}

  ngOnInit(): void {
    this.patientVisits$ = this.visitService.getAllPatientVisits(
      this.patientUuid,
      true,
      this.omitCurrent
    );
  }
}
