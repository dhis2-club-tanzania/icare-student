import { Field } from "./field.model";

export class PhoneNumber extends Field<string> {
  controlType = "phoneNumber";
}
