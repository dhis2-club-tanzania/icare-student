import { Pipe, PipeTransform } from '@angular/core';
import { indexOf } from 'lodash';

@Pipe({
  name: 'filterFormsByLocation',
})
export class FilterFormsByLocationPipe implements PipeTransform {
  transform(forms: any[], location: any): any {
    if (!location) {
      return [];
    }
    return (
      forms.filter((form) => indexOf(location?.forms, form?.id) > -1) || []
    );
  }
}
