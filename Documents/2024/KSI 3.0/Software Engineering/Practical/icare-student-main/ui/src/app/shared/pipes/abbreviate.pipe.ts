import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abbreviate',
})
export class AbbreviatePipe implements PipeTransform {
  transform(name: string): any {
    const abbreviatedName: any[] = [];
    let count = 0;
    if (name) {
      for (let i = 0; i <= name.length - 1; i++) {
        if (i === 0) {
          abbreviatedName.push(name[i].toUpperCase());
        } else {
          if (name[i] === ' ') {
            count = i;
            abbreviatedName.push(name[count + 1].toUpperCase());
          }
        }
      }
    }

    return abbreviatedName.join('');
  }
}
