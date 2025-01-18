import { Component, EventEmitter, OnInit, Output, Input } from "@angular/core";
import * as _ from "lodash";
import {
  arrangeVisitDataChronologically,
  getGenericDrugPrescriptionsFromVisit,
} from "../../helpers/visits.helper";
import { Visit } from "../../resources/visits/models/visit.model";
import { formatDateToString } from "../../helpers/format-date.helper";
import {
  getAgeInYearsMonthsDays,
  getDateDifferenceYearsMonthsDays,
} from "src/app/shared/helpers/date.helpers";

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
  @Input() FacilityDetails?: any;
  @Input() currentUser?: any;
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
    let observationsWithoutForm = this.visit?.obs?.filter(
      (observation) => observation?.encounter?.form === null
    );
    let observationsWithForm = this.visit?.obs?.filter(
      (observation) => observation?.encounter?.form !== null
    );

    // Handle observations linked to form
    this.forms?.map((form) => {
      let observations = [];
      observationsWithForm?.map((observation) => {
        if (observation?.encounter?.form?.uuid === form?.uuid) {
          let ob = {
            ...observation,
            encounterUuid: observation?.encounter?.uuid,
          };
          observations = [...observations, ob];
        }
      });

      let observationsObject = _.groupBy(observations, "encounterUuid");

      if (Object.keys(observationsObject)?.length > 0) {
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
              obsDatetime:
                observationsObject[key][0]?.obsDatetime ||
                observationsObject[key][0]?.encounter?.encounterDatetime,
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
        });
      }
    });

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
            obsDatetime:
              observations[0]?.obsDatetime ||
              observations[0]?.encounter?.encounterDatetime,
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
            if (order?.uuid === ob?.order?.uuid) {
              return ob;
            }
          })
          ?.filter((ob) => ob),
      };
    });
    this.procedureOrders = visit.procedureOrders.map((order) => {
      return {
        ...order,
        results: this.visit?.obs
          ?.filter((ob) => {
            if (order?.uuid === ob?.order?.uuid) {
              return ob;
            }
          })
          ?.filter((ob) => ob),
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
      "desc",
      this.specificDrugConceptUuid,
      this.prescriptionArrangementFields
    );
  }

  onPrint(e: any, visitData: any): void {
    // console.log("Patient visit", this.visit);
    // console.log("Patient History", this.visitHistory);
    let contents: string;

    const frame1: any = document.createElement("iframe");
    frame1.name = "frame3";
    frame1.style.position = "absolute";
    frame1.style.width = "100%";
    frame1.style.top = "-1000000px";
    document.body.appendChild(frame1);

    var frameDoc = frame1.contentWindow
      ? frame1.contentWindow
      : frame1.contentDocument.document
      ? frame1.contentDocument.document
      : frame1.contentDocument;

    frameDoc.document.open();

    frameDoc.document.write(`
      <html>
        <head> 
          <style> 
              @page { size: auto;  margin: 0mm; }
              
              body {
                padding: 30px;
                margin: 0 auto;
                width: 180mm;
              }

              #top .logo img{
                //float: left;
                height: 100px;
                width: 100px;
                background-size: 100px 100px;
              }
              .info h2 {
                font-size: 1.3em;
              }
              h3 {
                font-size: 1em;
              }
              h4 {
                font-size: .8em;
                padding-bottom: 1px;
                margin-bottom: 0;
              }
              h5 {
                font-size: .7em;
              }
              p {
                font-size: .7em;
              }
              #table {
                font-family: Arial, Helvetica, sans-serif;
                border-collapse: collapse;
                width: 100%;
                background-color: #000;
              } 
              #table td, #table  th {
                border: 1px solid #ddd;
                padding: 5px;
              } 
              
              #table tbody tr:nth-child(even){
                background-color: #f2f2f2;
              } 

              #table thead tr th { 
                padding-top:6px; 
                padding-bottom: 6px; 
                text-align: left; 
                background-color: #cecece;
                font-size: .7em;
              }
              tbody tr td {
                font-size: .7em;
              }
              .footer {
                margin-top:70px
                right: 0px;
                text-align: left;
                float: right;
                padding-right:40px;
              }
              .footer .userDetails .signature {
                margin-top: 20px;
              }
          </style>
        </head>
        <body> 
         <div id="printOut">
        `);

    // Change image from base64 then replace some text with empty string to get an image

    let image = "";

    let header = "";
    let subHeader = "";

    this.FacilityDetails?.attributes?.map((attribute) => {
      let attributeTypeName =
        attribute && attribute.attributeType
          ? attribute?.attributeType?.name.toLowerCase()
          : "";
      if (attributeTypeName === "logo") {
        image = attribute?.value;
      }
      header = attributeTypeName === "header" ? attribute?.value : "";
      subHeader = attributeTypeName === "sub header" ? attribute?.value : "";
    });

    let patientMRN = this.visit?.visit?.patient?.identifiers?.filter(
      (identifier) =>
        identifier?.identifierType?.uuid ===
        "26742868-a38c-4e6a-ac1d-ae283c414c2e"
    )[0]?.identifier;

    let patientAge = getAgeInYearsMonthsDays(
      this.visit?.visit?.patient?.person?.birthdate
    );
    let patientPhone = this.visit?.visit?.patient?.person?.attributes
      ?.filter(
        (attribute) =>
          attribute.uuid == "60003ddc-3e8e-49c6-a6d2-bdf82b5eb572" ||
          attribute.uuid == "bc5022b6-6c53-4f3d-9433-734b91937a23"
      )[0]
      ?.display.split(" = ")[1];

    frameDoc.document.write(`
    
      <center id="top">
         <div class="info">
          <h2>${header.length > 0 ? header : this.FacilityDetails.display} </h2>
          </div>
        <div class="logo">
          <img src="${image}" alt="Facility's Logo"> 
        </div>
        

        <div class="info">
          <h2>${
            subHeader.length > 0 ? subHeader : this.FacilityDetails.description
          } </h2>    <h3>P.O Box ${this.FacilityDetails.postalCode} ${
      this.FacilityDetails.stateProvince
    }</h3>
          <h3>${this.FacilityDetails.country}</h3>
          <br /><br />
          <h3>PATIENT HISTORY</h3>
        </div>
        <!--End Info-->
      </center>
      <!--End Document top-->
      
       <div id="mid">
        <div class="patient-info">
          <p> 
              Patient Name : ${this.visit?.visit?.patient?.person?.display}</br>
          </p>
          <p> 
              MRN : ${patientMRN}</br>
          </p>
          <p>Gender : ${
            this.visit?.visit?.patient?.person?.gender
              ? this.visit?.visit?.patient?.person?.gender == "F"
                ? "Female"
                : "Male"
              : ""
          }</p>
          <p>Age : ${patientAge?.years} <i>yrs,</i> ${
      patientAge?.months
    } <i>months, </i> ${patientAge?.days} <i>days</i> </p>
    <p> Phone : ${patientPhone}</p>
    <hr style="width:27%;text-align:left;margin-left:0;color:#ddd; opacity:0.5">
        </div>
      </div>
      
     `);

    if (
      this.visitHistory?.visitStopDateTime?.date &&
      this.visitHistory?.visitStopDateTime?.time
    ) {
      frameDoc.document
        .write(`<p>Visit started on : <i>${this.visitHistory?.visitStartDateTime?.date} at ${this.visitHistory?.visitStartDateTime?.time}</i></p> 
     <p>Visit stopped on: <i>
${this.visitHistory?.visitStopDateTime?.date} at ${this.visitHistory?.visitStopDateTime?.time}</i></p> <br>
`);
    }

    // Medication Section
if (
  this.visitHistory?.visitOrderedData?.find(
    (visitData) => visitData.category === "DRUG_ORDER"
  )
) {
  frameDoc.document.write(`
    <div>
        <h5>Medication</h5>
    </div>
    <table id="table">
        <thead>
            <tr>
                <th>Item Name</th>
                <th>Description</th>
                <th>Prescribed On</th>
                <th>Provider</th>
            </tr>
        </thead>
        <tbody>`);
}

this.visitHistory?.visitOrderedData?.forEach((visitData) => {
  if (visitData?.category === "DRUG_ORDER") {
    frameDoc.document.write(`
    <tr>
        <td>${visitData?.name || 'N/A'}</td>
        <td>${visitData?.description || 'N/A'}</td>
        <td>${visitData?.date ? formatDateToString(new Date(visitData?.date)) : 'N/A'} ${visitData?.time || ''}</td>
        <td>${visitData?.provider || 'N/A'}</td>
    </tr>`);
  }
});

frameDoc.document.write(`</tbody></table>`);

// Laboratory Orders Section
if (
  this.visitHistory?.visitOrderedData?.find(
    (visitData) => visitData.category === "LAB_ORDER"
  )
) {
  frameDoc.document.write(`
    <div>
        <h5>Laboratory</h5>
    </div>
    <table id="table">
        <thead>
            <tr>
                <th>Order</th>
                <th>Ordered By</th>
                <th>Results</th>
                <th>Fed By</th>
            </tr>
        </thead>
        <tbody>`);
}

this.visitHistory?.visitOrderedData?.forEach((visitData) => {
  if (visitData?.category === "LAB_ORDER") {
    frameDoc.document.write(`
    <tr>
        <td>${visitData?.order?.display || 'N/A'}</td>
        <td>${visitData?.provider} on ${visitData?.date ? formatDateToString(new Date(visitData?.date)) : 'N/A'} ${visitData?.time || ''}</td>
        <td>${visitData?.results?.length ? visitData?.results.map(result => `${result?.concept?.display}: ${result?.value?.display || result?.value}`).join(', ') : 'No results found'}</td>
        <td>${visitData?.results[0]?.provider?.display?.split('-')[1] ? visitData?.results[0]?.provider?.display.split('-')[1] + " on " : '-'} ${visitData?.results[0]?.obsDatetime ? formatDateToString(new Date(visitData?.results[0]?.obsDatetime)) : 'N/A'}</td>
    </tr>`);
  }
});

frameDoc.document.write(`</tbody></table>`);

// Radiology Orders Section
if (
  this.visitHistory?.visitOrderedData?.find(
    (visitData) => visitData.category === "RADIOLOGY_ORDER"
  )
) {
  frameDoc.document.write(`
    <div>
        <h5>Radiology</h5>
    </div>
    <table id="table">
        <thead>
            <tr>
                <th>Order</th>
                <th>Ordered By</th>
                <th>Results</th>
                <th>Fed By</th>
            </tr>
        </thead>
        <tbody>`);
}

this.visitHistory?.visitOrderedData?.forEach((visitData) => {
  if (visitData?.category === "RADIOLOGY_ORDER") {
    frameDoc.document.write(`
    <tr>
        <td>${visitData?.order?.display || 'N/A'}</td>
        <td>${visitData?.provider} on ${visitData?.date ? formatDateToString(new Date(visitData?.date)) : 'N/A'} ${visitData?.time || ''}</td>
        <td>${visitData?.results?.length ? visitData?.results.map(result => `${result?.concept?.display}: ${result?.value?.display || result?.value}`).join(', ') : 'No results found'}</td>
        <td>${visitData?.results[0]?.provider?.display?.split('-')[1] ? visitData?.results[0]?.provider?.display.split('-')[1] + " on " : '-'} ${visitData?.results[0]?.obsDatetime ? formatDateToString(new Date(visitData?.results[0]?.obsDatetime)) : 'N/A'}</td>
    </tr>`);
  }
});

frameDoc.document.write(`</tbody></table>`);


    // -------------------Procedure orders-------------
    if (
      this.visitHistory?.visitOrderedData?.find(
        (visitData) => visitData.category === "PROCEDURE_ORDER"
      )
    ) {
      frameDoc.document.write(`
  <div>
           <h5>Procedure</h5>
         </div>
         <table id="table">
           <thead>
             <tr>
               <th>Order</th>
               <th>Ordered By</th>
               <th>Results</th>
               <th>Fed By</th>
             </tr>
           </thead>
           <tbody>`);
    }
        // Visit note.....


    this.visitHistory?.visitOrderedData?.forEach((visitData) => {
      if (visitData?.category === "OBSERVATIONS") {
        frameDoc.document.write(`
<tr><td>
      ${visitData?.concept?.display}
      </td>
      <td>  ${visitData?.provider} on 
      ${visitData?.date} ${visitData?.time}
      </td> <td>
      `);
        if (visitData?.results?.length > 0) {
          visitData?.results?.forEach((result) => {
            if (!result?.value?.links?.uri) {
              frameDoc.document.write(` ${result?.concept?.display} - 
                          ${
                            result?.value?.display
                              ? result?.value?.display
                              : result?.value
                          }, &nbsp;&nbsp;
    `);
            }
          });
        } else if (!visitData?.results?.length) {
          frameDoc.document.write(` Not Attended
    `);
        }
        frameDoc.document.write(`</td>`);
        frameDoc.document.write(`
      <td>${
        visitData?.results[0]?.provider?.display?.split("-")[1]
          ? visitData?.results[0]?.provider?.display?.split("-")[1] + "on"
          : "-"
      } ${
          visitData?.results[0]?.obsDatetime
            ? formatDateToString(new Date(visitData?.results[0]?.obsDatetime))
            : "-"
        } 
        </td>
</tr>`);
      }
    }); 

    //end of visit note

    this.visitHistory?.visitOrderedData?.forEach((visitData) => {
      if (visitData?.category === "PROCEDURE_ORDER") {
        frameDoc.document.write(`
<tr><td>
      ${visitData?.concept?.display}
      </td>
      <td>  ${visitData?.provider} on 
      ${visitData?.date} ${visitData?.time}
      </td> <td>
      `);
   
      //................Handle Empty or Undefined Data...............

      if (visitData?.results?.length > 0) {
        visitData.results.forEach((result) => {
          if (!result?.value?.links?.uri) {
            frameDoc.document.write(` ${result?.concept?.display || 'N/A'} - 
                                      ${result?.value?.display || result?.value || 'N/A'}, &nbsp;&nbsp;`);
          }
        });
      } else {
        frameDoc.document.write(` Not Attended `);
      }

      //....................End of Handling Data..................

        frameDoc.document.write(`</td>`);
        frameDoc.document.write(`
      <td>${
        visitData?.results[0]?.provider?.display?.split("-")[1]
          ? visitData?.results[0]?.provider?.display?.split("-")[1] + "on"
          : "-"
      } ${
          visitData?.results[0]?.obsDatetime
            ? formatDateToString(new Date(visitData?.results[0]?.obsDatetime))
            : "-"
        } 
        </td>
</tr>`);
      }
    });

    frameDoc.document.write(`</tbody></table>`);
    // -------------------Observations orders-------------
    let observationForm = this.visitHistory?.visitOrderedData?.find(
      (visitData) => visitData.category === "OBSERVATIONS"
    );
      if (observationForm) {
    this.visitHistory?.visitOrderedData?.forEach((visitData) => {
      if (visitData?.category === "OBSERVATIONS") {
        frameDoc.document.write(`
        <div style="margin-top:2px">
         <h5>${visitData?.form}</h5>
       </div>
       <table id="table">
         <thead>
             <tr ><th colspan="2">
          Values <span style="font-weight:normal;"> &nbsp; - &nbsp; <i>written on ${visitData?.date} ${visitData?.time}  By ${visitData?.provider}
        </i></span>
             </th></tr>
         </thead>
         <tbody>`);

        // .............Snippet to process observation..............
        if (visitData?.obs?.length > 0) {
          visitData.obs.forEach((ob) => {
            frameDoc.document.write(`<tr><td>${ob?.concept?.display || 'N/A'}</td><td>
                                     ${ob?.value?.display || ob?.value || 'N/A'}
                                     </td></tr>`);
          });
        } else {
          frameDoc.document.write(`<tr><td colspan="2">No Observations Found</td></tr>`);
        }

        frameDoc.document.write(`</tbody></table>`);
      }
    });
  }

    // this.visitHistory?.visitOrderedData?.forEach((visitData) => {
    //   if (visitData?.category === "OBSERVATIONS") {
    //     frameDoc.document.write(`<tr`);

    //     visitData?.obs?.forEach((ob) => {
    //       frameDoc.document.write(`<tr><td> ${ob?.concept?.display} </td><td>
    //         ${ob?.value?.display ? ob?.value?.display : ob?.value}
    //         </td></tr>`);
    //     });
    //     frameDoc.document.write(`</tr>`);
    //   }
    // });

    //......Checking both provisional & confirmed are rendered.............

    if (Array.isArray(this.visitHistory?.diagnoses?.PROVISIONAL) && this.visitHistory?.diagnoses?.PROVISIONAL.length) {
      frameDoc.document.write(`<div>
    <h4>Provisional Diagnoses</h4>
    `);
      this.visitHistory?.diagnoses?.PROVISIONAL?.forEach((diagnosis) => {
        frameDoc.document.write(`
      <p>  &nbsp;&nbsp;&nbsp; &nbsp;${diagnosis?.display}</p>
      </div>`);
      });
    }
    if (this.visitHistory?.diagnoses?.CONFIRMED?.length) {
      frameDoc.document.write(`<div>
    <h4>Confirmed Diagnoses</h4>
    `);
      this.visitHistory?.diagnoses?.CONFIRMED?.forEach((diagnosis) => {
        frameDoc.document.write(`
      <p> &nbsp; &nbsp;&nbsp; &nbsp;${diagnosis?.display}</p>
      </div>`);
      });
    }

// ......End of Rendering.............

    frameDoc.document.write(`
    <div class="footer">
  <div class="userDetails">
    <p class="name">Printed By: ${this.currentUser?.person?.display || 'Unknown User'}</p>
    <p class="signature">Signature : ..............................</p>
  </div>

  <div class="printDate">
    <p>Printed on: ${formatDateToString(new Date()) || 'N/A'}</p>
  </div>
</div>
        </div>
      </body>
    </html>`);

    frameDoc.document.close();

    setTimeout(function () {
      window.frames["frame3"].focus();
      window.frames["frame3"].print();
      document.body.removeChild(frame1);
    }, 500);
  }
}
