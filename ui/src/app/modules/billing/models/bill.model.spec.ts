import { Bill } from './bill.model';

describe('Given I want to create and instance of Bill Model using bill details received from server', () => {
  const billDetails = {};

  const billIntance = new Bill(billDetails);

  it('should create and instance', () => {
    expect(billIntance).toBeInstanceOf(Bill);
  });
});

describe('Given I have in a bill two items with one already paid', () => {
  const billDetails = {
    patient: {
      name: 'Pending Bill',
      uuid: '711988e4-ba3f-4b0f-85a6-23797ecc2a4f'
    },
    payments: [
      {
        referenceNumber: 'CONFIRMED BY USER',
        items: [
          {
            amount: 10000,
            item: {
              name: 'Registration Fee',
              uuid: '3e409ef9-8396-40a6-a4d7-d102150e34e4'
            }
          }
        ],
        paymentType: {
          name: 'Cash',
          uuid: '00000100IIIIIIIIIIIIIIIIIIIIIIIIIIII'
        }
      }
    ],
    uuid: '0edd73c2-63fc-4686-823f-9df19cb89904',
    items: [
      {
        item: {
          name: 'Registration Fee',
          uuid: '3e409ef9-8396-40a6-a4d7-d102150e34e4'
        },
        quantity: 1,
        price: 10000,
        invoice: {
          uuid: '0edd73c2-63fc-4686-823f-9df19cb89904'
        },
        order: {
          uuid: '3fe197b1-1aed-4c2f-8e64-d24504d07335'
        }
      },
      {
        item: {
          name: 'General OPD',
          uuid: '9aa9560f-13a4-4f3b-84ab-21deddfd4b82'
        },
        quantity: 1,
        price: 10000,
        invoice: {
          uuid: '0edd73c2-63fc-4686-823f-9df19cb89904'
        },
        order: {
          uuid: '45f0d9e2-fc9a-4197-9555-881b6e222cd4'
        }
      }
    ]
  };

  const billIntance = new Bill(billDetails);

  it('should return bill instance with one pending item', () => {
    expect(billIntance.items.length).toEqual(1);
  });
});
