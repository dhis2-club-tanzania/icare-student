import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeConversion'
})
export class TimeConversionPipe implements PipeTransform {
  transform(milliseconds: number, format: string): string {
    if (milliseconds < 0) {
      return 'Invalid input';
    }

    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);

    switch (format) {
      case 'HRS_MIN':
        return `${hours} hour(s) and ${minutes % 60} minute(s)`;
      case 'DAY_HRS':
        return `${days} day(s) and ${hours % 24} hour(s)`;
      case 'MTH_DAY':
        return `${months} month(s) and ${days % 30} day(s)`;
      default:
        return 'Invalid format';
    }
  }
}
