import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Patient } from 'src/app/shared/resources/patient/models/patient.model';
import { ProgramsService } from '../../services/programs.service';

@Component({
  selector: 'app-patient-enrollments',
  templateUrl: './patient-enrollments.component.html',
  styleUrls: ['./patient-enrollments.component.scss']
})
export class PatientEnrollmentsComponent implements OnInit {

  @Input() patient: Patient;
  @Input() programs: any;
  enrolledPrograms$: Observable<any>;
  selectedProgram: any;
  allowWokrflowSelection: boolean = false;

  constructor(private programService: ProgramsService) { }

  ngOnInit(): void {

    this.enrolledPrograms$ = this.programService.getPatieintsEnrollments(this.patient.id);
  }

  setProgram(program){

    this.allowWokrflowSelection = true;
    this.selectedProgram = program;

  }

  enroll(){

    let enrollmentPayload = {
      state:{
        concept:"REG00000IIIIIIIIIIIIIIIIIIIIIIIIIIII",
        programWorkflow:"bbed2c43-1996-4a83-b82b-f1f8b88b52fb",
        initial: true,
        terminal:false
      }
    }

    this.programService.newEnrollment("", enrollmentPayload).subscribe(response => {

    }, error => {

    })

  }

}
