import { Field } from './field.model';

export class DateField extends Field<string> {
  controlType = 'date';
}
