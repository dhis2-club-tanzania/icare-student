import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterFormsByServiceProvided',
})
export class FilterFormsByServiceProvidedPipe implements PipeTransform {
  transform(forms: any[], service: any): any {
    if (!service) {
      return [];
    }
    return forms.filter((form) => form?.display === service) || [];
  }
}
