import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filterLocationByService",
})
export class FilterLocationByServicePipe implements PipeTransform {
  transform(locations: any[], service: any): any {
    if (!service) {
      return [];
    }
    const locationsWithAttributeService =
      locations.filter(
        (location) =>
          (
            location.attributes?.filter(
              (attribute) =>
                attribute?.attributeType?.display.toLowerCase() ===
                  "services" && !attribute?.voided
            ) || []
          )?.length > 0
      ) || [];
    return locationsWithAttributeService.length > 0
      ? locationsWithAttributeService.filter(
          (location) =>
            (
              location?.attributes?.filter(
                (attribute) =>
                  attribute?.attributeType?.display.toLowerCase() ==
                    "services" && attribute?.value === service.uuid
              ) || []
            )?.length > 0
        )
      : [];
  }
}
