import { DropdownOption } from "./dropdown-option.model";
import { Field } from "./field.model";

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
  groupedFields?: any;
  unGroupedFields?: any;
  searchControlType?: string;
  shouldHaveLiveSearchForDropDownFields?: Boolean;
  concept?: any;
  isForm?: boolean;
  required?: boolean;
}
