import { Component, Input, OnInit } from "@angular/core";
import { Observable, forkJoin } from "rxjs";
import { VisitsService } from "src/app/shared/resources/visits/services";

@Component({
  selector: "app-other-patient-details",
  templateUrl: "./other-patient-details.component.html",
  styleUrls: ["./other-patient-details.component.scss"],
})
export class OtherPatientDetailsComponent implements OnInit {
  @Input() patient: any;
  patientVisit$: Observable<any>;
  allpatientVisit$: Observable<any>;
  ID: string;
  ObservedCurrentInsuranceID: any;
  NewID: any;
  insurelanceID: any;
  constructor(private visitService: VisitsService) {}

  ngOnInit(): void {
    // TODO: Softcode ID reference
    // this.ID = (this.patient?.person?.attributes?.filter(
    //   (attribute) => attribute?.attributeType?.display === "ID"
    // ) || [])[0]?.value;

    this.patientVisit$ = this.visitService.getLastPatientVisit(
      this.patient?.uuid
    );
    this.allpatientVisit$ = this.visitService.getAllPatientVisits(
      this.patient?.uuid,
      true,
      false
    );

    forkJoin([this.patientVisit$, this.allpatientVisit$]).subscribe(
      ([patientVisit, allpatientVisit]) => {
        // Handle patientVisit$
        // console.log("Patient Visit----------------------------:", patientVisit);
        const visit = patientVisit[0].visit;
        const attributes = visit.attributes;
        for (const attribute of attributes) {
          if (attribute.display.includes("Insurance ID")) {
            const insuranceID = attribute.value;
            this.ObservedCurrentInsuranceID = insuranceID.toString();
            // console.log("Insurance ID:", insuranceID);
            break;
          }
        }

        // Handle allpatientVisit$
        const insuranceIDs = allpatientVisit.map((visit) => {
          const insuranceAttribute = visit.visit.attributes.find((attribute) =>
            attribute.display.includes("Insurance ID")
          );
          return insuranceAttribute ? insuranceAttribute.value : null;
        });
        // console.log("insuranceAttribute  ---------------------------------------===:", insuranceIDs);

        const validInsuranceIDs = insuranceIDs
          .filter((id) => id !== null)
          .map((id) => parseInt(id, 10));
        const largestInsuranceID = validInsuranceIDs[0];
        this.NewID = largestInsuranceID?.toString();

        // console.log("Largest Insurance ID ---------------------------------------===:", largestInsuranceID);

        // Check and set ID after both Observables are completed
        // console.log("observed -------------------", this.ObservedCurrentInsuranceID, this.NewID);
        if (this.ObservedCurrentInsuranceID !== this.NewID) {
          // console.log("am in now -------------------->");
          this.insurelanceID = this.NewID;
        } else {
          this.insurelanceID = this.ObservedCurrentInsuranceID;
        }
        // console.log("ID ---------------------------------------===:",  this.insurelanceID);
      }
    );
  }
}
