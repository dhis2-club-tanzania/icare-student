import { Pipe, PipeTransform } from '@angular/core';
import { TableActionOption } from '../models/table-action-options.model';

@Pipe({
  name: 'hideActionOption',
})
export class HideActionOptionPipe implements PipeTransform {
  transform(actionOptions: TableActionOption[], optionsToHide: string[]): any {
    return (actionOptions || []).filter(
      (actionOption) => !optionsToHide?.includes(actionOption.actionCode)
    );
  }
}
