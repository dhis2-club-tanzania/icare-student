import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'searchTests',
})
export class SearchTestsPipe implements PipeTransform {
  transform(arr: any[], searchText: string, fieldName?: string): any[] {
    if (!arr) return [];
    if (!searchText) return arr;
    searchText = searchText.toLowerCase();
    function formatSetMembers(members) {
      let stringifiedNames = '';
      _.each(members, (member) => {
        stringifiedNames += member.name + ' ';
      });
      return stringifiedNames;
    }

    return _.filter(arr, (arrayItem) => {
      return (
        arrayItem.name.toLowerCase().includes(searchText.toLowerCase()) ||
        formatSetMembers(arrayItem.setMembers)
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
    });
  }
}
