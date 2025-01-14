import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Visit } from "../../resources/visits/models/visit.model";

@Component({
  selector: "app-patient-investigations-and-procedures",
  templateUrl: "./patient-investigations-and-procedures.component.html",
  styleUrls: ["./patient-investigations-and-procedures.component.scss"],
})
export class PatientInvestigationsAndProceduresComponent implements OnInit {
  @Input() observations: any;
  @Input() patientVisit: Visit;
  @Input() forConsultation: boolean;
  @Input() investigationAndProceduresFormsDetails: any;
  @Input() orderTypes: any;
  @Input() provider: any;
  @Input() iCareGeneralConfigurations: any;
  @Input() clinicConfigurations: any;
  @Input() userPrivileges: any;
  @Input() fromConsultation: boolean;
  @Input() isInpatient: boolean;
  @Input() tabToShow: string;
  @Input() isTheatre: boolean;
  selectedTab = new FormControl(0);

  shouldShowLabSection: boolean = false;
  @Output() updateConsultationOrder = new EventEmitter();
  constructor() {}

  ngOnInit(): void {
    this.tabToShow = this.tabToShow?.toLowerCase();
    this.shouldShowLabSection = !this.clinicConfigurations?.provisionalDiagnosis
      ?.immedicateSectionsAffected
      ? (
          this.clinicConfigurations?.provisionalDiagnosis?.immedicateSectionsAffected.filter(
            (section) => section?.laboratory
          ) || []
        ).length > 0
      : true;
  }

  changeTab(val): void {
    this.selectedTab.setValue(val);
  }

  onUpdateConsultationOrder() {
    if (this.fromConsultation) {
      this.updateConsultationOrder.emit();
    }
  }
}
