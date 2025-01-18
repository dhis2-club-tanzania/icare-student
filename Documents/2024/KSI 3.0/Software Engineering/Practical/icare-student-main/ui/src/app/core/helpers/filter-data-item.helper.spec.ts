import { filterDataItem } from './filter-data-item.helper';

const dataItem = {
  id: 'one',
  path: 'one/two/three',
  level: 2,
  parent: { id: 'two' },
};
describe('Given filter parameter to filter data equaling filter attribute value', () => {
  const filterList = [
    {
      attribute: 'id',
      condition: 'eq',
      filterValue: 'one',
    },
  ];

  const filterStatus = filterDataItem(dataItem, filterList);

  it('should return true if filter value matches', () => {
    expect(filterStatus).toBeTruthy();
  });
});

describe('Given filter parameter to filter data whose part is included in filter attribute value', () => {
  const filterList = [
    {
      attribute: 'path',
      condition: 'ilike',
      filterValue: 'one',
    },
  ];

  const filterStatus = filterDataItem(dataItem, filterList);

  it('should return true if filter value matches part of selected attribute type', () => {
    expect(filterStatus).toBeTruthy();
  });
});

describe('Given filter parameter to filter data with value being part filter attribute value array', () => {
  const inDataItemOne = {
    id: 'one',
    path: 'one/two/three',
    level: 2,
    parent: { id: 'two' },
  };

  const inDataItemTwo = {
    id: 'two',
    path: 'two/three',
    level: 2,
    parent: { id: 'three' },
  };

  const filterList = [
    {
      attribute: 'id',
      condition: 'in',
      filterValue: '[one,two]',
    },
  ];

  const filterStatusOne = filterDataItem(inDataItemOne, filterList);
  const filterStatusTwo = filterDataItem(inDataItemTwo, filterList);

  it('should return true if one of filter value matches selected attribute', () => {
    expect(filterStatusOne).toBeTruthy();
    expect(filterStatusTwo).toBeTruthy();
  });
});

describe('Given filter parameter to filter data that is less than filter attribute value', () => {
  const filterListLE = [
    {
      attribute: 'level',
      condition: 'le',
      filterValue: 3,
    },
  ];

  const filterListLT = [
    {
      attribute: 'level',
      condition: 'lt',
      filterValue: 3,
    },
  ];

  const filterStatusLE = filterDataItem(dataItem, filterListLE);
  const filterStatusLT = filterDataItem(dataItem, filterListLT);

  it('should return true if filter value is less than attribute type', () => {
    expect(filterStatusLE).toBeTruthy();
    expect(filterStatusLT).toBeTruthy();
  });
});

describe('Given filter parameter to filter data that is equal to filter attribute value', () => {
  const filterListLE = [
    {
      attribute: 'level',
      condition: 'le',
      filterValue: 2,
    },
  ];

  const filterListGE = [
    {
      attribute: 'level',
      condition: 'ge',
      filterValue: 2,
    },
  ];

  const filterStatusLE = filterDataItem(dataItem, filterListLE);
  const filterStatusGE = filterDataItem(dataItem, filterListGE);

  it('should return true if filter value is equal to attribute type', () => {
    expect(filterStatusLE).toBeTruthy();
    expect(filterStatusGE).toBeTruthy();
  });
});

describe('Given filter parameter to filter data that is greater than filter attribute value', () => {
  const filterListGE = [
    {
      attribute: 'level',
      condition: 'ge',
      filterValue: 1,
    },
  ];

  const filterListGT = [
    {
      attribute: 'level',
      condition: 'gt',
      filterValue: 1,
    },
  ];

  const filterStatusGE = filterDataItem(dataItem, filterListGE);
  const filterStatusGT = filterDataItem(dataItem, filterListGT);

  it('should return true if filter value is greater than attribute type', () => {
    expect(filterStatusGE).toBeTruthy();
    expect(filterStatusGT).toBeTruthy();
  });
});

describe('Given filter parameter to filter data equaling nested filter attribute value', () => {
  const filterList = [
    {
      attribute: 'parent.id',
      condition: 'eq',
      filterValue: 'two',
    },
  ];

  const filterStatus = filterDataItem(dataItem, filterList);

  it('should return true if nested filter value matches with data', () => {
    expect(filterStatus).toBeTruthy();
  });
});

describe('Given filter parameter to filter data whose part is included in filter attribute value nested filter attribute value', () => {
  const filterList = [
    {
      attribute: 'parent.id',
      condition: 'ilike',
      filterValue: 'two',
    },
  ];

  const filterStatus = filterDataItem(dataItem, filterList);

  it('should return true if filter value is part of data attribute', () => {
    expect(filterStatus).toBeTruthy();
  });
});

describe('Given filter parameter to filter data with value being part filter attribute value array', () => {
  const inDataItemOne = {
    id: 'one',
    path: 'one/two/three',
    level: 2,
    parent: { id: 'two' },
  };

  const inDataItemTwo = {
    id: 'two',
    path: 'two/three',
    level: 2,
    parent: { id: 'three' },
  };

  const filterList = [
    {
      attribute: 'parent.id',
      condition: 'in',
      filterValue: '[two,three]',
    },
  ];

  const filterStatusOne = filterDataItem(inDataItemOne, filterList);
  const filterStatusTwo = filterDataItem(inDataItemTwo, filterList);

  it('should return true if filter value is part of data attribute', () => {
    expect(filterStatusOne).toBeTruthy();
    expect(filterStatusTwo).toBeTruthy();
  });
});
