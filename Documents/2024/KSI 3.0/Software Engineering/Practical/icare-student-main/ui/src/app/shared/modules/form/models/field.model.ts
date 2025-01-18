import { DropdownOption } from "./dropdown-option.model";

export class Field<T> {
  value: T;
  id: string;
  key: string;
  label: string;
  required: boolean;
  order: number;
  controlType: string;
  type: string;
  disabled: boolean;
  options: DropdownOption[];
  placeholder: string;
  min: number | string;
  max: number | string;
  hidden: boolean;
  units: string;
  rows?: number;
  conceptClass?: any;
  searchControlType?: string;
  shouldHaveLiveSearchForDropDownFields?: boolean;
  filteringItems?: any[];
  category?: string;
  searchTerm?: string;
  source?: string;
  isDiagnosis?: boolean;
  locationUuid?: string;
  multiple?: boolean;
  allowCustomDateTime?: boolean;

  constructor(
    options: {
      value?: T;
      key?: string;
      id?: string;
      label?: string;
      required?: boolean;
      order?: number;
      controlType?: string;
      type?: string;
      disabled?: boolean;
      placeholder?: string;
      options?: DropdownOption[];
      min?: number | string;
      max?: number | string;
      hidden?: boolean;
      units?: string;
      rows?: number;
      conceptClass?: any;
      searchControlType?: string;
      shouldHaveLiveSearchForDropDownFields?: boolean;
      filteringItems?: any[];
      isDiagnosis?: boolean;
      category?: string;
      searchTerm?: string;
      source?: string;
      locationUuid?: string;
      multiple?: boolean;
      allowCustomDateTime?: boolean;
    } = {}
  ) {
    this.value = options.value;
    this.key = options.key || "";
    this.id = options.id || "";
    this.label = options.label || "";
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || "";
    this.type = options.type || "";
    this.options = options.options || [];
    this.disabled = options.disabled || false;
    this.placeholder = options.placeholder;
    this.min = options.min;
    this.max = options.max;
    this.hidden = options.hidden || false;
    this.units = options.units || "";
    this.rows = options?.rows || 2;
    this.shouldHaveLiveSearchForDropDownFields =
      options.shouldHaveLiveSearchForDropDownFields;
    this.searchControlType = options.searchControlType;
    this.category = options?.category;
    this.conceptClass = options?.conceptClass;
    this.searchTerm = options?.searchTerm;
    this.source = options?.source;
    this.isDiagnosis = options?.isDiagnosis;
    this.locationUuid = options?.locationUuid;
    this.multiple = options?.multiple;
    this.allowCustomDateTime = options?.allowCustomDateTime;
  }
}
