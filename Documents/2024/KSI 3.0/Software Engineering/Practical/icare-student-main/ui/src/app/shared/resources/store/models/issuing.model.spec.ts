import { IssueInput, Issuing } from './issuing.model';

describe('Given I want to issue certain quantity to a requisition', () => {
  const issueInput: IssueInput = {
    requisitionUuid: 'requistion_uuid',
    issuedLocationUuid: 'issuesd_location',
    issuingLocationUuid: 'issuing_location',
    issueItems: [
      {
        itemUuid: 'item_uuid',
        quantity: 40,
      },
    ],
  };

  const issueObject = Issuing.createIssue(issueInput);
  it('should return issue request object accepted by issue api', () => {
    expect(issueObject.issuedLocation.uuid).toEqual(
      issueInput.issuedLocationUuid
    );
    expect(issueObject.issueingLocation.uuid).toEqual(
      issueInput.issuingLocationUuid
    );
    expect(issueObject.requisition.uuid).toEqual(issueInput.requisitionUuid);
    expect(issueObject.issueItems[0].item.uuid).toEqual(
      issueInput.issueItems[0].itemUuid
    );
    expect(issueObject.issueItems[0].quantity).toEqual(
      issueInput.issueItems[0].quantity
    );
  });
});
