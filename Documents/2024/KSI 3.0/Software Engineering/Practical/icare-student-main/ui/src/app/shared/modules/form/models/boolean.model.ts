import { Field } from './field.model';

export class Boolean extends Field<string> {
  controlType = 'boolean';
}
