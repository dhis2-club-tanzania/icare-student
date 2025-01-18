import { ConceptCreateFull } from 'src/app/shared/resources/openmrs';
import { DropdownOption } from './dropdown-option.model';
import { Field } from './field.model';

export interface ICAREForm {
  id: string;
  uuid: string;
  name: string;
  setMembers: ICAREForm[];
  options?: DropdownOption[];
  dataType?: string;
  formClass: string;
  formField?: Field<string>;
  formFields?: Field<string>[];
  concept?: any;
  isForm?: boolean;
}
