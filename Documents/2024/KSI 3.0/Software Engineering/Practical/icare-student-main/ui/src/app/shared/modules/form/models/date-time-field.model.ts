import { Field } from "./field.model";

export class DateTimeField extends Field<string> {
  controlType: "date-time";
}
