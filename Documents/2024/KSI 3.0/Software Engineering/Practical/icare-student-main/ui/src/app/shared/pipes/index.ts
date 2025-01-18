import { AbbreviatePipe } from "./abbreviate.pipe";
import { FilterByPipe } from "./filter-by.pipe";
import { SearchItemPipe } from "./search-item.pipe";
import { HideActionOptionPipe } from "./hide-action-option.pipe";
import { WithLoadingPipe } from "./with-loading.pipe";
import { NumberToWordsPipe } from "./number-to-words.pipe";
import { FilterLocationByServicePipe } from "./filter-location-by-service.pipe";
import { FilterFormsByServiceProvidedPipe } from "./filter-forms-by-service-provided.pipe";
import { FilterFormsByLocationPipe } from "./filter-forms-by-location.pipe";
import { FilterServicesConceptPipe } from "./filter-services-concept.pipe";
import { FormatIsoStrDateForDisplayPipe } from "./format-iso-str-date-for-display.pipe";
import { FilterDiagnosesPipe } from "./filter-diagnoses.pipe";
import { UpdatePrivilegesWithSelectedAttributePipe } from "./update-privileges-with-selected-attribute.pipe";
import { UpdateRolesWithSelectedAttributePipe } from "./update-roles-with-selected-attribute.pipe";
import { SanitizeDangerousUrlPipe } from "./sanitize-dangerous-url.pipe";
import { SearchTestDetailsPipe } from "./search-test-details.pipe";
import { CreateLabFieldsPipe } from "./create-lab-fields.pipe";
import { FilterResultsByResultGroupPipe } from "./filter-results-by-result-group.pipe";
import { FormatLabelCharCountDisplayPipe } from "./format-label-char-count-display.pipe";
import { FilterOrdersByOrderPipe } from "./filter-orders-by-order.pipe";
import { GetAssociatedFieldsPipe } from "./get-associated-fields.pipe";

export const sharedPipes: any[] = [
  FilterByPipe,
  WithLoadingPipe,
  AbbreviatePipe,
  SearchItemPipe,
  HideActionOptionPipe,
  NumberToWordsPipe,
  FilterLocationByServicePipe,
  FilterFormsByServiceProvidedPipe,
  FilterFormsByLocationPipe,
  FilterServicesConceptPipe,
  FormatIsoStrDateForDisplayPipe,
  FilterDiagnosesPipe,
  UpdatePrivilegesWithSelectedAttributePipe,
  UpdateRolesWithSelectedAttributePipe,
  SanitizeDangerousUrlPipe,
  SearchTestDetailsPipe,
  CreateLabFieldsPipe,
  FilterResultsByResultGroupPipe,
  FormatLabelCharCountDisplayPipe,
  FilterOrdersByOrderPipe,
  GetAssociatedFieldsPipe,
];
