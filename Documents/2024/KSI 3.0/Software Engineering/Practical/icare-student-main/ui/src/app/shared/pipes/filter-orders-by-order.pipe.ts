import { Pipe, PipeTransform } from "@angular/core";
import { keyBy } from "lodash";
import { Dropdown } from "../modules/form/models/dropdown.model";
import { Textbox } from "../modules/form/models/text-box.model";

@Pipe({
  name: "filterOrdersByOrder",
})
export class FilterOrdersByOrderPipe implements PipeTransform {
  transform(orders: any, order: any): any {
    return orders?.filter(
      (orderinOrders) => orderinOrders?.uuid === order[0]?.uuid
    );
  }
}
