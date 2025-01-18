import { Dropdown } from 'src/app/shared/modules/form/models/dropdown.model';
import { Textbox } from 'src/app/shared/modules/form/models/text-box.model';

export interface DrugOrderMetadata {
  orderType: any;
  drugsConceptsList: any;
  dosingUnits: any;
  drugOrderFrequencies: any;
  drugRoutes: any;
  durationUnits: any;
  drugs: any;
  stockedDrugs: any[];
  drugFormField: Dropdown;
  doseField: Textbox;
  dosingUnitsField: Dropdown;
  drugOrderFrequencyField: Dropdown;
  drugRoutesField: Dropdown;
  durationUnitsFormField: Dropdown;
  doseDurationField: Textbox;
  genericNameField: Dropdown;
  orderReasonField: Textbox;
  instructionField: Textbox;
  quantityField: Textbox;
  durationFormFields: any[];
  doseFormFields: any[];
}
