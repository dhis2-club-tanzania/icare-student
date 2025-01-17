import { sortBy, head, reverse, groupBy } from "lodash";
import { ObservationObject } from "../resources/observation/models/obsevation-object.model";

// TODO: Rename to keyedObservationsByConcept since tha actual process is keying
export function groupObservationByConcept(observations: ObservationObject[]) {
  const groupedObservations = {};
  // const formattedObservations = observations?.map((observation) => {
  //   return {
  //     ...observation,
  //     conceptOrder:
  //       observation?.concept?.uuid +
  //       (observation?.order?.uuid ? "-" + observation?.order?.uuid : ""),
  //   };
  // });
  // console.log(groupBy(formattedObservations, "conceptOrder"));
  (observations || []).forEach((observation) => {
    if (observation?.concept?.uuid) {
      const conceptObservation =
        groupedObservations[
          observation.concept.uuid +
            (observation?.order?.uuid ? "-" + observation?.order?.uuid : "")
        ];
      const conceptObservations = reverse(
        sortBy(
          [...(conceptObservation?.history || []), observation],
          "observationDatetime"
        )
      );

      groupedObservations[
        observation.concept.uuid +
          (observation?.order?.uuid ? "-" + observation?.order?.uuid : "")
      ] = {
        uuid: observation.concept.uuid,
        order: observation?.order?.uuid,
        latest: head(conceptObservations),
        history: conceptObservations,
        observationDatetime: head(conceptObservations)?.observationDatetime,
      };
    }
  });
  return groupedObservations;
}
