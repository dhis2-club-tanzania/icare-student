import { getAllUniqueDrugOrders } from './drug-orders.selectors';
import { BillObject } from 'src/app/modules/billing/models/bill-object.model';

describe('Given I have two drugs order and one is already paid', () => {
  const drugOrders = [
    {
      id: '6c75bc32-8eaf-4ee5-a398-3c70c37a3366',
      uuid: '5c75bc32-8eaf-4ee5-a398-3c70c37a3366',
      orderNumber: 'ORD-5',
      patientUuid: 'e1d80804-1f0d-438f-ba2d-acc643582bfb',
      concept: {
        uuid: '61617AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        display: 'Aspirin'
      },
      dateActivated: '2020-10-28T10:18:48.000+0000',
      scheduledDate: null,
      autoExpireDate: null,
      encounterUuid: '2ce115f9-ec81-43da-bb29-0423dbb3f770',
      orderer: {
        uuid: 'f9badd80-ab76-11e2-9e96-0800200c9a66',
        display: 'UNKNOWN - Super User'
      },
      orderReason: null,
      orderReasonNonCoded: null,
      orderType: 'Drug Order',
      urgency: 'ROUTINE',
      instructions: null,
      display: '(NEW) Aspirin: 10.0 Capsule Oral Every four hours',
      drugUuid: {
        uuid: 'ea7e607c-e4c6-42d6-97e5-1c90b26ba007'
      },
      dose: 10,
      doseUnits: {
        uuid: '1608AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        display: 'Capsule'
      },
      frequency: {
        uuid: '162247OFAAAAAAAAAAAAAAA',
        display: 'Every four hours'
      },
      quantity: 0,
      numRefills: 1,
      dosingInstructions: null,
      duration: null,
      durationUnits: null,
      route: {
        uuid: '160240AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        display: 'Oral'
      },
      brandName: null,
      dispenseAsWritten: false,
      type: 'drugorder'
    },
    {
      id: '6722fcd1-70ac-4c8e-9b58-65637447a35d',
      uuid: '6722fcd1-70ac-4c8e-9b58-65637447a35d',
      orderNumber: 'ORD-6',
      patientUuid: 'e1d80804-1f0d-438f-ba2d-acc643582bfb',
      concept: {
        uuid: '71617AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        display: 'Aspirin'
      },
      dateActivated: '2020-10-28T10:29:08.000+0000',
      scheduledDate: null,
      autoExpireDate: null,
      encounterUuid: '2ce115f9-ec81-43da-bb29-0423dbb3f770',
      orderer: {
        uuid: 'f9badd80-ab76-11e2-9e96-0800200c9a66',
        display: 'UNKNOWN - Super User'
      },
      orderReason: null,
      orderReasonNonCoded: null,
      orderType: 'Drug Order',
      urgency: 'ROUTINE',
      instructions: null,
      display: '(NEW) Aspirin 200mg: 10.0 Capsule Oral Every four hours',
      drugUuid: {
        uuid: 'aa7e607c-e4c6-42d6-97e5-1c90b26ba007',
        display: 'Aspirin 200mg',
        links: [
          {
            rel: 'self',
            uri:
              'http://icare:8080/openmrs/ws/rest/v1/drug/aa7e607c-e4c6-42d6-97e5-1c90b26ba007'
          }
        ]
      },
      dose: 10,
      doseUnits: {
        uuid: '1608AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        display: 'Capsule'
      },
      frequency: {
        uuid: '162247OFAAAAAAAAAAAAAAA',
        display: 'Every four hours'
      },
      quantity: 10,
      numRefills: 1,
      dosingInstructions: null,
      duration: null,
      durationUnits: null,
      route: {
        uuid: '160240AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        display: 'Oral'
      },
      brandName: null,
      dispenseAsWritten: false,
      type: 'drugorder'
    }
  ];
  const bills: any[] = [
    {
      id: 'c9eff631-73c8-47ee-ae71-dfe7cf8e504a',
      uuid: 'c9eff631-73c8-47ee-ae71-dfe7cf8e504a',
      payable: 35000,
      discount: 0,
      items: [
        {
          item: {
            name: 'Aspirin 200mg',
            uuid: '6b23af3d-5a92-43aa-b550-f490af99a084'
          },
          quantity: 10,
          price: 3500,
          invoice: {
            uuid: 'c9eff631-73c8-47ee-ae71-dfe7cf8e504a'
          },
          order: {
            uuid: '6722fcd1-70ac-4c8e-9b58-65637447a35d'
          }
        }
      ]
    }
  ];

  const uniqOrders = getAllUniqueDrugOrders.projector(drugOrders, bills);

  it('should return return status of "NOT PAID" for one item', () => {
    const unPaidOrders = uniqOrders.filter(
      order => order.paymentStatus === 'NOT_PAID'
    );
    expect(unPaidOrders.length).toEqual(1);
  });
  it('should return return status of "PAID" for one item', () => {
    const paidOrders = uniqOrders.filter(
      order => order.paymentStatus === 'PAID'
    );
    expect(paidOrders.length).toEqual(1);
  });
});
