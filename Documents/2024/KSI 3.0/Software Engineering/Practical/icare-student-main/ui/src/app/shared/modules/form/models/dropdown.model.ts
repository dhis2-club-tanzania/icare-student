import { Field } from "./field.model";

export class Dropdown extends Field<string> {
  controlType = "dropdown";
}
