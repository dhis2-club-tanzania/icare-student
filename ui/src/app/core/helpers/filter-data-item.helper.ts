export function filterDataItem(dataItem: any, filterList: any[]) {
  return (filterList || []).some((filterItem: any) => {
    const { attribute, condition, filterValue } = filterItem;
    let dataValue;
    (attribute || '')
      .split('.')
      .forEach((attributeKey: string, index: number) => {
        if (index > 0 && !dataValue) {
          return undefined;
        }
        dataValue = dataValue
          ? dataValue[attributeKey]
          : dataItem[attributeKey];
      });

    switch (condition) {
      case 'ilike':
        return (dataValue || '').indexOf(filterValue) !== -1;

      case 'eq':
        return dataValue === filterValue;

      case 'le':
        return parseInt(dataValue, 10) <= parseInt(filterValue, 10);

      case 'lt':
        return parseInt(dataValue, 10) < parseInt(filterValue, 10);

      case 'ge':
        return parseInt(dataValue, 10) >= parseInt(filterValue, 10);

      case 'gt':
        return parseInt(dataValue, 10) > parseInt(filterValue, 10);

      case 'in':
        return (filterValue || '').indexOf(dataValue) !== -1;

      default:
        return false;
    }
  });
}
