import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatIsoStrDateForDisplay',
})
export class FormatIsoStrDateForDisplayPipe implements PipeTransform {
  transform(isoStringifiedDate: string, args: any[]): any {
    return isoStringifiedDate.indexOf('T') > -1
      ? isoStringifiedDate.split('T')[0] +
          ' ' +
          (
            isoStringifiedDate
              .split('T')[1]
              .split(':')
              .map((timeSection, index) => {
                if (index < 2) {
                  return timeSection;
                } else {
                  return timeSection.split('.')[0];
                }
              })
              .filter((timePart) => timePart) || []
          ).join(':')
      : isoStringifiedDate;
  }
}
