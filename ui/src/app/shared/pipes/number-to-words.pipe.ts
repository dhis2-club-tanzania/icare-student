import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToWords',
})
export class NumberToWordsPipe implements PipeTransform {
  transform(value: number): any {
    return value;
  }
}
