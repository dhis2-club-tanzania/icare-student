/* tslint:disable:no-unused-variable */

import { of } from 'rxjs';
import { StockBatch } from '../models/stock-batch.model';
import { StockObject } from '../models/stock.model';
import { StockService } from './stock.service';

const sampleStocks = [
  {
    expiryDate: '2020-12-27',
    item: {
      unit: 'Capsules',
      creator: {
        display: 'Super User (admin)',
        uuid: '1010d442-e134-11de-babe-001e378eb67e',
      },
      dateCreated: '2020-12-27T00:00:00.000+0300',
      concept: {
        display: 'bandage',
        uuid: '444xb1yz-1011-487z-868y-acc38ebc6252',
      },
      display: 'bandage',
      voided: false,
      uuid: '8o00d43570-8y37-11f3-1234-08002007777',
    },
    quantity: 100,
    batch: 'batch-xyz',
    location: {
      display: 'store A',
      uuid: '44939999-d333-fff2-9bff-61d11117c22e',
    },
  },
];

const sampleStockOuts = [
  {
    unit: 'Capsules',
    creator: {
      display: 'Super User (admin)',
      uuid: '1010d442-e134-11de-babe-001e378eb67e',
    },
    dateCreated: '2020-12-27T00:00:00.000+0300',
    concept: {
      display: 'syringe',
      uuid: '344ab1zz-x011-487z-868y-acc38ebc6252',
    },
    display: 'syringe',
    voided: false,
    uuid: '8777d43571-yy77-11ff-2244-08002007777',
  },
];

describe('Given stock statuses list', () => {
  let httpClientSpy: {
    get: jasmine.Spy;
  };
  let stockService: StockService;
  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('NgxOpenmrsHttpclientServiceService', [
      'get',
    ]);

    httpClientSpy.get.and.returnValue(of(sampleStocks));

    stockService = new StockService(httpClientSpy as any);
  });

  it('should return list of stocks for given stocks', () => {
    stockService.getAvailableStocks().subscribe((stocks) => {
      const stock: StockObject = stocks[0];
      expect(stock?.id).toEqual(sampleStocks[0].item.uuid);
      expect(stock?.name).toEqual(sampleStocks[0].item.display);
      expect(stock?.quantity).toEqual(sampleStocks[0].quantity);

      expect(stock?.batches[0].batchNo).toEqual(sampleStocks[0].batch);
      expect(stock?.batches[0].expiryDate).toEqual(sampleStocks[0].expiryDate);
      expect(stock?.batches[0]?.quantity).toEqual(sampleStocks[0]?.quantity);
      expect(stock?.batches[0]?.location.name).toEqual(
        sampleStocks[0].location.display
      );
    });
  });
});

describe('Given stocked out list', () => {
  let httpClientSpy: {
    get: jasmine.Spy;
  };
  let stockService: StockService;
  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('NgxOpenmrsHttpclientServiceService', [
      'get',
    ]);

    httpClientSpy.get.and.returnValue(of(sampleStockOuts));

    stockService = new StockService(httpClientSpy as any);
  });

  it('should return list of stocked outs for given stocked out items', () => {
    stockService.getStockOuts().subscribe((stocks) => {
      const stock: StockObject = stocks[0];
      expect(stock?.id).toEqual(sampleStockOuts[0].uuid);
      expect(stock?.name).toEqual(sampleStockOuts[0].display);
      expect(stock?.quantity).toEqual(0);

      expect(stock?.batches?.length).toEqual(0);
    });
  });
});
