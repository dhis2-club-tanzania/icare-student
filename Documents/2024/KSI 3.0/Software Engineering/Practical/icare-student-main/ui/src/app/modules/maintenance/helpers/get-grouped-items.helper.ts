import { keys } from 'lodash';
import { Textbox } from 'src/app/shared/modules/form/models/text-box.model';
import { ItemPrice } from '../models/item-price.model';

export function getGroupedItems(
  itemPrices: ItemPrice[],
  paymentSchemes
): any[] {
  const groupedItems = {};
  (itemPrices || []).forEach((itemPrice) => {
    const previousItem = groupedItems[itemPrice?.uuid];

    paymentSchemes.forEach((paymentScheme) => {
      const isCurrentScheme =
        itemPrice?.paymentScheme?.uuid === paymentScheme?.uuid;

      groupedItems[itemPrice?.uuid] = previousItem
        ? {
            ...(previousItem || {}),
            paymentSchemes: {
              ...previousItem?.paymentSchemes,
              [`${paymentScheme?.uuid}_${itemPrice?.uuid}`]: {
                value: isCurrentScheme ? itemPrice?.price : '',
                formField: new Textbox({
                  id: `${paymentScheme?.uuid}_${itemPrice?.uuid}`,
                  label: `Price`,
                  key: `${paymentScheme?.uuid}_${itemPrice?.uuid}`,
                  value: (isCurrentScheme ? itemPrice?.price : '')?.toString(),
                }),
              },
            },
          }
        : {
            uuid: itemPrice?.uuid,
            display: itemPrice?.display,
            paymentType: itemPrice?.paymentType,
            paymentSchemes: {
              [`${paymentScheme?.uuid}_${itemPrice?.uuid}`]: {
                value: isCurrentScheme ? itemPrice?.price : '',
                formField: new Textbox({
                  id: `${paymentScheme?.uuid}_${itemPrice?.uuid}`,
                  label: `Price`,
                  key: `${paymentScheme?.uuid}_${itemPrice?.uuid}`,
                  value: (isCurrentScheme ? itemPrice?.price : '')?.toString(),
                }),
              },
            },
          };
    });
  });

  return keys(groupedItems).map((key) => groupedItems[key]);
}
