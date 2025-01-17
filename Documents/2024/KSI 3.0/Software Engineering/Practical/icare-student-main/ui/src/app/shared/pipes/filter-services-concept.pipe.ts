import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterServicesConcept',
})
export class FilterServicesConceptPipe implements PipeTransform {
  transform(
    servicesConcepts: any[],
    currentServiceConfigsSelected: any,
    countOfVisits: number
  ): any {
    return (
      servicesConcepts
        .map((concept) => {
          if (
            countOfVisits >= 1 &&
            currentServiceConfigsSelected['priceListReference']
          ) {
            const matchedForRevisit =
              currentServiceConfigsSelected['priceListReference'].filter(
                (config) =>
                  config?.forRevisit &&
                  concept?.uuid === config?.conceptForPriceItem
              ) || [];
            if (matchedForRevisit.length > 0) {
              return {
                ...concept,
                display: matchedForRevisit[0]?.display,
              };
            }
          } else if (
            countOfVisits === 0 &&
            currentServiceConfigsSelected['priceListReference']
          ) {
            const matchedForRevisit =
              currentServiceConfigsSelected['priceListReference'].filter(
                (config) =>
                  config?.forRevisit === false &&
                  concept?.uuid === config?.conceptForPriceItem
              ) || [];
            if (matchedForRevisit.length > 0) {
              return {
                ...concept,
                display: matchedForRevisit[0]?.display,
              };
            }
          } else {
            return concept;
          }
        })
        .filter((serviceConcept) => serviceConcept) || []
    );
  }
}
