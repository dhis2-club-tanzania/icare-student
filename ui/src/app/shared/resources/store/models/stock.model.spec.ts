import { LedgerInput } from './ledger-input.model';
import { Stock } from './stock.model';

describe('Given ledger input', () => {
  const sampleLedgerInput: LedgerInput = {
    batchNo: 'BATCH-XYZ',
    itemUuid: 'item_uuid',
    ledgerTypeUuid: 'ledger_type_uuid',
    quantity: 10,
    buyingPrice: 100,
    remarks: 'okay',
    locationUuid: 'location_uuid',
    expiryDate: '2020-12-01',
  };
  const stockLedger = Stock.createLedger(sampleLedgerInput);

  it('should return stock ledger object allowed by ledger api', () => {
    expect(stockLedger.batchNo).toEqual(sampleLedgerInput.batchNo);
    expect(stockLedger.item.uuid).toEqual(sampleLedgerInput.itemUuid);
    expect(stockLedger.expiryDate).toEqual(sampleLedgerInput.expiryDate);
    expect(stockLedger.ledgerType.uuid).toEqual(
      sampleLedgerInput.ledgerTypeUuid
    );
    expect(stockLedger.location.uuid).toEqual(sampleLedgerInput.locationUuid);
    expect(stockLedger.buyingPrice).toEqual(sampleLedgerInput.buyingPrice);
    expect(stockLedger.quantity).toEqual(sampleLedgerInput.quantity);
  });
});

describe('Given null ledger input', () => {
  const stockLedger = Stock.createLedger(null);
  it('should return null store ledger', () => {
    expect(stockLedger).toBeNull();
  });
});
