import { Pipe, PipeTransform } from '@angular/core';
import * as numWords from 'num-words';

@Pipe({
  name: 'numberToWords',
})
export class NumberToWordsPipe implements PipeTransform {
  transform(value: number): any {
    return numWords(value);
  }
}
