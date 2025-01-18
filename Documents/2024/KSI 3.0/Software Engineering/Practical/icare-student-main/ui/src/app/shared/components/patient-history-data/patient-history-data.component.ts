import { Component, EventEmitter, OnInit, Output, Input } from "@angular/core";
import * as _ from "lodash";
import {
  arrangeVisitDataChronologically,
  getGenericDrugPrescriptionsFromVisit,
} from "../../helpers/visits.helper";
import { Visit } from "../../resources/visits/models/visit.model";

@Component({
  selector: "app-patient-history-data",
  templateUrl: "./patient-history-data.component.html",
  styleUrls: ["./patient-history-data.component.scss"],
})
export class PatientHistoryDataComponent implements OnInit {
  @Input() visit: any;
  @Input() settings: any;
  @Input() forms: any;
  @Input() generalPrescriptionOrderType: any;
  @Input() prescriptionArrangementFields: any;
  @Input() specificDrugConceptUuid: any;
  labOrders: any[];
  radiologyOrders: any[] = [];
  procedureOrders: any[] = [];
  obsBasedOnForms: any[] = [];
  medications: any[];
  drugsPrescribed: any;
  visitHistory: any;
  diagnoses: any;

  constructor() {}

  ngOnInit(): void {
    let visit = new Visit(this.visit?.visit);

    let observationsWithoutForm = this.visit?.obs?.filter((observation) => observation?.encounter?.form === null);
    let observationsWithForm = this.visit?.obs?.filter((observation) => observation?.encounter?.form !== null);

    // Handle observations linked to form
    this.forms?.map((form) => {
      let observations = []
      observationsWithForm?.map((observation) => {
        if(observation?.encounter?.form?.uuid === form?.uuid) {
          let ob = {
            ...observation,
            encounterUuid: observation?.encounter?.uuid
          }
          observations = [
            ...observations,
            ob
          ]
        }
      })

      let observationsObject = _.groupBy(observations, "encounterUuid");

      if (Object.keys(observationsObject)?.length > 0){
        Object.keys(observationsObject).forEach((key) => {
          this.obsBasedOnForms = [
            ...this.obsBasedOnForms,
            {
              form: form?.name,
              obs: observationsObject[key]?.reduce(
                (obs, ob) => ({
                  ...obs,
                  [`${ob?.concept?.uuid}`]:
                    `${ob?.concept?.uuid}` in obs
                      ? obs[`${ob?.concept?.uuid}`].concat(ob)
                      : [ob],
                }),
                []
              ),
              fields: form?.formFields,
              obsDatetime: observationsObject[key][0]?.obsDatetime || observationsObject[key][0]?.encounter?.encounterDatetime,
              // fields: flatten(
              //   form?.formFields
              //     ?.map((formField) => {
              //       return formField?.formFields
              //         ? formField?.formFields
              //         : formField?.formField;
              //     })
              //     .filter((field) => field)
              // )
              //   .filter((field) => {
              //     if (
              //       field?.key in
              //       observations?.reduce(
              //         (obs, ob) => ({
              //           ...obs,
              //           [`${ob?.concept?.uuid}`]:
              //             `${ob?.concept?.uuid}` in obs
              //               ? obs[`${ob?.concept?.uuid}`].concat(ob)
              //               : [ob],
              //         }),
              //         []
              //       )
              //     ) {
              //       return field;
              //     }
              //   })
              //   .filter((field) => field),
            },
          ];
        })
      }
    })

    // // Handle observations not linked to form
    this.forms?.map((form) => {
      let observations = [];
      form?.formFields?.forEach((field) => {
        if (field?.formFields?.length) {
          field?.formFields?.forEach((formField) => {
            observationsWithoutForm?.forEach((obs) => {
              if (obs?.concept?.uuid === formField?.key) {
                observations = [...observations, obs];
              }
            });
          });
        } else {
          observationsWithoutForm?.forEach((obs) => {
            if (obs?.concept?.uuid === field?.formField?.key) {
              observations = [...observations, obs];
            }
          });
        }
      });
      if (observations.length > 0) {
        this.obsBasedOnForms = [
          ...this.obsBasedOnForms,
          {
            form: form?.name,
            obs: observations?.reduce(
              (obs, ob) => ({
                ...obs,
                [`${ob?.concept?.uuid}`]:
                  `${ob?.concept?.uuid}` in obs
                    ? obs[`${ob?.concept?.uuid}`].concat(ob)
                    : [ob],
              }),
              []
            ),
            fields: form?.formFields,
            obsDatetime: observations[0]?.obsDatetime || observations[0]?.encounter?.encounterDatetime,
            // fields: flatten(
            //   form?.formFields
            //     ?.map((formField) => {
            //       return formField?.formFields
            //         ? formField?.formFields
            //         : formField?.formField;
            //     })
            //     .filter((field) => field)
            // )
            //   .filter((field) => {
            //     if (
            //       field?.key in
            //       observations?.reduce(
            //         (obs, ob) => ({
            //           ...obs,
            //           [`${ob?.concept?.uuid}`]:
            //             `${ob?.concept?.uuid}` in obs
            //               ? obs[`${ob?.concept?.uuid}`].concat(ob)
            //               : [ob],
            //         }),
            //         []
            //       )
            //     ) {
            //       return field;
            //     }
            //   })
            //   .filter((field) => field),
          },
        ];
      }
    });

    this.labOrders = visit.labOrders.map((order) => {
      return {
        ...order,
        results: this.visit?.obs
          ?.filter((ob) => {
            if (order?.uuid == ob?.order?.uuid) {
              return ob;
            }
          })
          ?.filter((ob) => ob),
      };
    });
    this.radiologyOrders = visit.radiologyOrders.map((order) => {
      return {
        ...order,
        results: this.visit?.obs
          ?.filter((ob) => {
            if (order?.uuid == ob?.order?.uuid) {
              return ob;
            }
          })
          ?.filter((ob) => ob),
      };
    });
    this.procedureOrders = visit.procedureOrders.map((order) => {
      return {
        ...order,
        results: this.visit?.obs?.filter((ob) => {
          if (order?.uuid == ob?.order?.uuid) {
            return ob;
          }
        })?.filter((ob) => ob),
      };
    });
    this.drugsPrescribed = getGenericDrugPrescriptionsFromVisit(
      this.visit?.visit,
      this.generalPrescriptionOrderType
    );

    this.diagnoses = visit.diagnoses;

    // RESERVE: For TimeLine History
    this.visitHistory = arrangeVisitDataChronologically(
      {
        ...this.visit?.visit,
        observations: this.obsBasedOnForms,
        labOrders: this.labOrders,
        radiologyOrders: this.radiologyOrders,
        procedureOrders: this.procedureOrders,
        drugs: this.drugsPrescribed,
        diagnoses: this.diagnoses,
      },
      'desc',
      this.specificDrugConceptUuid,
      this.prescriptionArrangementFields
    );
  }

  getStringDate(date: Date) {
    return `${date.getDate()}/${
      (date.getMonth() + 1).toString().length > 1
        ? date.getMonth() + 1
        : "0" + date.getMonth() + 1
    }/${date.getFullYear()}`;
  }
}
