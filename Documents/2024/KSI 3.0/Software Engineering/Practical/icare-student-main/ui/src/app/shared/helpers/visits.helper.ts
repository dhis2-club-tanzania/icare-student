import * as _ from "lodash";

export function getEncountersForLabSample(details) {
  let encounters = [];
  _.map(details, (detail) => {
    _.map(detail.encounters, (encounter) => {
      if (encounter.display && encounter.display.indexOf("LAB_SAMPLE") > -1) {
        encounters = [
          ...encounters,
          { patient: detail.patient, ...encounter, visitUuid: detail.uuid },
        ];
      }
    });
  });
  return encounters;
}

// Consultation
export function getEncountersForConsultation(details) {
  let encounters = [];
  _.each(details, (detail) => {
    if (detail.encounters) {
      _.each(detail.encounters, (encounter) => {
        if (
          encounter.display &&
          encounter.display.indexOf("Consultation") > -1
        ) {
          encounters = [
            ...encounters,
            { patient: detail.patient, ...encounter, visitUuid: detail.uuid },
          ];
        }
      });
    }
  });
  return encounters;
}

export function getPatientsEncounteredLab(data) {
  const info = _.map(data, (patient, index) => {
    return {
      id: patient.patient.uuid,
      names: patient.patient.display,
      position: index + 1,
      action: patient,
    };
  });
  return _.uniqBy(info, "id");
}

export function formatVisitsDetails(visits) {
  return _.map(visits, (visit) => {
    return {
      id: visit.uuid,
      ...visit,
    };
  });
}

export function getVisitsByEncounterTypeWhereThereAreOrders(
  visits,
  encounterType
) {
  let filteredVisits = [];
  _.map(visits, (visit) => {
    _.map(visit.encounters, (encounter) => {
      if (
        encounter.display &&
        encounter.display.indexOf(encounterType) > -1 &&
        encounter.orders.length > 0
      ) {
        filteredVisits = [
          ...filteredVisits,
          { ...visit, patientUuid: visit.patient.uuid },
        ];
      }
    });
  });
  return _.uniqBy(filteredVisits, "uuid");
}

export function getPatientsByVisits(visits) {
  let data = [];
  _.map(
    _.orderBy(
      getVisitsByEncounterTypeWhereThereAreOrders(visits, "Consultation"),
      ["visitStartDatetime"],
      ["desc"]
    ),
    (visit, index) => {
      // if (!visit.stopDatetime && !visit.voided) {

      // }

      data = [
        ...data,
        {
          position: data.length + 1,
          ...visit,
          id: visit.id,
          names: visit?.patient.display.split(" - ")[1],
          patientId: visit?.patient.display.split(" - ")[0],
          mrNo: visit?.patient.display.split(" - ")[0],
          status: "",
          orderDate: visit?.startDatetime.substring(0, 10),
          remarks: "",
          searchingText:
            visit?.patient?.display +
            "-" +
            visit?.patient?.person?.age +
            "-" +
            visit?.patient?.person?.gender,
        },
      ];
    }
  );
  return _.orderBy(_.uniqBy(data, "id"), ["startDatetime"], ["asc"]);
}

export function getFormattedEncountersByEncounterTypeFromVisit(
  visit,
  encounterTypeUuid
) {
  return _.orderBy(
    (
      visit?.encounters?.filter(
        (encounter) => encounter?.encounterType?.uuid === encounterTypeUuid
      ) || []
    )?.map((encounter) => {
      return {
        ...encounter,
        obsKeyedByConcept: _.keyBy(
          encounter.obs?.map((observation) => {
            return {
              ...observation,
              conceptKey: observation?.concept?.uuid,
              valueIsObject: observation?.value?.uuid ? true : false,
            };
          }),
          "conceptKey"
        ),
      };
    }),
    ["encounterDatetime"],
    ["asc"]
  );
}

export function getGenericDrugPrescriptionsFromVisit(
  visit,
  genericPrescriptionOrderType
) {
  return _.flatten(
    visit?.encounters
      ?.map((encounter) => {
        return (
          encounter?.orders.filter(
            (order) => order.orderType?.uuid === genericPrescriptionOrderType
          ) || []
        )?.map((genericDrugOrder) => {
          let formulatedDescription = encounter?.obs
            ?.map((ob) => {
              if (ob?.comment === null) {
                return ob;
              }
            })
            .filter((ob) => ob);
          return {
            ...genericDrugOrder,
            formulatedDescription: formulatedDescription,
            obs: _.keyBy(
              encounter?.obs?.map((observation) => {
                return {
                  ...observation,
                  conceptKey: observation?.concept?.uuid,
                  valueIsObject: observation?.value?.uuid ? true : false,
                };
              }),
              "conceptKey"
            ),
          };
        });
      })
      ?.filter((order) => order)
  );
}
export function arrangeVisitDataChronologically(
  visit: any,
  orderDirection: string = "desc",
  specificDrugConceptUuid?: string,
  prescriptionArrangementFields?: any
) {

  // let encountersByProvider = {};
  // Restructure object to collect all related encounters in a single day
  // encountersByProvider = {
  //   ...encountersByProvider,
  //   encounters: visit?.encounters?.reduce(
  //     (encounters, encounter) => ({
  //       ...encounters,
  //       [`${encounter.encounterProviders[0].uuid}|${
  //         getStringDate(new Date(encounter.encounterDatetime)).date
  //       }`]:
  //         `${encounter.encounterProviders[0].uuid}|${
  //           getStringDate(new Date(encounter.encounterDatetime)).date
  //         }` in encounters
  //           ? encounters[
  //               `${encounter.encounterProviders[0].uuid}|${
  //                 getStringDate(new Date(encounter.encounterDatetime)).date
  //               }`
  //             ].concat(encounter)
  //           : [encounter],
  //     }),
  //     []
  //   ),
  // };

  // Find Observations and orders in a particular visit
  let visitData = {
    observations: _.flatten(
      visit?.observations?.map((observation) => {
        const obs = _.groupBy(
          _.flatten(
            observation?.fields
              ?.map((field) => {
                if (field?.formFields) {
                  return _.flatten(
                    field.formFields
                      .map((formField) => {
                        if (formField?.key in observation?.obs) {
                          return _.flatten(
                            observation?.obs[formField?.key]?.map((ob) => {
                              return {
                                ...ob,
                                obsDatetime: ob?.obsDatetime || ob?.encounter?.encounterDatetime,
                                date: getStringDate(new Date(ob?.obsDatetime || ob?.encounter?.encounterDatetime))
                                  .date,
                                time: getStringDate(new Date(ob?.obsDatetime || ob?.encounter?.encounterDatetime))
                                  .time,
                              };
                            })
                          );
                        }
                      })
                      .filter((observation) => observation)
                  );
                } else {
                  if (field?.formField?.key in observation?.obs) {
                    return _.flatten(
                      observation?.obs[field?.formField?.key]?.map((ob) => {
                        return {
                          ...ob,
                          obsDatetime: ob?.obsDatetime || ob?.encounter?.encounterDatetime,
                          date: getStringDate(new Date(ob?.obsDatetime || ob?.encounter?.encounterDatetime)).date,
                          time: getStringDate(new Date(ob?.obsDatetime || ob?.encounter?.encounterDatetime)).time,
                        };
                      })
                    );
                  }
                }
              })
              .filter((observation) => observation)
          ),
          "obsDatetime"
        );
        const groupedObs = Object.keys(obs)?.map((key) => {
          return {
            form: observation.form,
            obs: obs[key],
            obsDatetime: obs[key][0]?.obsDatetime,
            date: getStringDate(new Date(obs[key][0]?.obsDatetime)).date,
            time: getStringDate(new Date(obs[key][0]?.obsDatetime)).time,
            provider: obs[key][0]?.provider?.display?.split("-")[1],
            category: "OBSERVATIONS",
          };
        });
        return _.flatten(groupedObs);
      })
    ),
    drugs: visit?.drugs?.map((drugOrder) => {
      return {
        ...drugOrder,
        name: drugOrder.obs[specificDrugConceptUuid]
          ? drugOrder.obs[specificDrugConceptUuid]?.comment
          : drugOrder?.display,
        description: `${
          drugOrder.obs[prescriptionArrangementFields["1"]?.uuid]?.value
            ?.display
            ? drugOrder.obs[prescriptionArrangementFields["1"]?.uuid]?.value
                ?.display
            : drugOrder.obs[prescriptionArrangementFields["1"]?.uuid]?.value
        } (${
          drugOrder.obs[prescriptionArrangementFields["2"]?.uuid]?.value
            ?.display
            ? drugOrder.obs[prescriptionArrangementFields["2"]?.uuid]?.value
                ?.display
            : drugOrder.obs[prescriptionArrangementFields["2"]?.uuid]?.value
        }) ${
          drugOrder.obs[prescriptionArrangementFields["3"]?.uuid]?.value
            ?.display
            ? drugOrder.obs[prescriptionArrangementFields["3"]?.uuid]?.value
                ?.display
            : drugOrder.obs[prescriptionArrangementFields["3"]?.uuid]?.value
        } ${
          drugOrder.obs[prescriptionArrangementFields["4"]?.uuid]?.value
            ?.display
            ? drugOrder.obs[prescriptionArrangementFields["4"]?.uuid]?.value
                ?.display
            : drugOrder.obs[prescriptionArrangementFields["4"]?.uuid]?.value
        } ${
          drugOrder.obs[prescriptionArrangementFields["5"]?.uuid]?.value
            ?.display
            ? drugOrder.obs[prescriptionArrangementFields["5"]?.uuid]?.value
                ?.display
            : drugOrder.obs[prescriptionArrangementFields["5"]?.uuid]?.value
        } ${
          drugOrder.obs[prescriptionArrangementFields["6"]?.uuid]?.value
            ?.display
            ? drugOrder.obs[prescriptionArrangementFields["6"]?.uuid]?.value
                ?.display
            : drugOrder.obs[prescriptionArrangementFields["6"]?.uuid]?.value
        }`,
        date: getStringDate(new Date(drugOrder.dateActivated)).date,
        time: getStringDate(new Date(drugOrder.dateActivated)).time,
        provider: drugOrder?.orderer?.display?.split('-')[1],
        category: "DRUG_ORDER",
      };
    }),
    labOrders: visit?.labOrders?.map((order) => {
      return {
        ...order,
        date: getStringDate(new Date(order?.order?.dateActivated)).date,
        time: getStringDate(new Date(order?.order?.dateActivated)).time,
        provider: order?.order?.orderer?.display?.split("-")[1],
        category: "LAB_ORDER",
      };
    }),
    radiologyOrders: visit?.radiologyOrders?.map((order) => {
      return {
        ...order,
        date: getStringDate(new Date(order?.order?.dateActivated)).date,
        time: getStringDate(new Date(order?.order?.dateActivated)).time,
        provider: order?.order?.orderer?.display?.split("-")[1],
        category: "RADIOLOGY_ORDER",
      };
    }),
    procedureOrders: visit?.procedureOrders?.map((order) => {
      return {
        ...order?.order,
        date: getStringDate(new Date(order?.order?.dateActivated)).date,
        time: getStringDate(new Date(order?.order?.dateActivated)).time,
        provider: order?.order?.orderer?.display?.split("-")[1],
        category: "PROCEDURE_ORDER",
      };
    }),
  };

  let remadeVisitObject = {
    visitStartDateTime: {
      date: getStringDate(new Date(visit?.startDatetime)).date,
      time: getStringDate(new Date(visit?.startDatetime)).time,
    },
    visitStopDateTime: {
      date: visit?.stopDatetime
        ? getStringDate(new Date(visit?.stopDatetime)).date
        : null,
      time: visit?.stopDatetime
        ? getStringDate(new Date(visit?.stopDatetime)).time
        : null,
    },
    category: "VISIT",
    visitOrderedData: _.orderBy(
      _.flatten(
        Object.keys(visitData).map((key) => {
          return visitData[key];
        })
      ),
      ["date", "time"],
      [orderDirection, orderDirection]
    ),
    diagnoses: _.groupBy(
      visit?.diagnoses?.map((diagnosis) => diagnosis?.diagnosisDetails),
      "certainty"
    ),
  };

  return remadeVisitObject;
}

function getStringDate(date: Date, separator?: string) {
  separator = separator || "-";
  return {
    date: `${date.getDate()}${separator}${
      (date.getMonth() + 1).toString().length > 1
        ? date.getMonth() + 1
        : `0${date.getMonth() + 1}`
    }${separator}${date.getFullYear()}`,
    time: `${
      (date.getHours() || 0) < 10 ? "0" + date.getHours() : "" + date.getHours()
    }:${
      (date.getMinutes() || 0) < 10
        ? "0" + date.getMinutes()
        : "" + date.getMinutes()
    }:${
      (date.getSeconds() || 0) < 10
        ? "0" + date.getSeconds()
        : "" + date.getSeconds()
    }`,
  };
}
