import { filterDataItem } from './filter-data-item.helper';

export function filterIndexDBData(data, filterParams: string[]) {
  if (!filterParams) {
    return data;
  }

  const filterList = filterParams.map((filterString: string) => {
    const splitedFilterString = filterString.split(':');
    return {
      attribute: splitedFilterString[0],
      condition: splitedFilterString[1],
      filterValue: splitedFilterString[2],
    };
  });

  return data.filter((dataItem: any) => filterDataItem(dataItem, filterList));
}
