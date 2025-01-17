import { Field } from './field.model';

export class TextArea extends Field<string> {
  controlType = 'textarea';
}
