import { RequisitionInput } from './requisition-input.model';
import {
  Requisition,
  RequisitionIssueInput,
  RequisitionObject,
} from './requisition.model';

describe('Given requisition input', () => {
  const sampleRequisitionInput: RequisitionInput = {
    requestedLocationUuid: 'requested_location_uuid',
    requestingLocationUuid: 'requesting_location_uuid',
    items: [
      {
        itemUuid: 'item_uuid',
        quantity: 10,
      },
    ],
  };

  const requestObject = Requisition.createRequisition(sampleRequisitionInput);
  it('should return requisition object allowed by request api', () => {
    expect(requestObject.requestedLocation.uuid).toEqual(
      sampleRequisitionInput.requestedLocationUuid
    );
    expect(requestObject.requestingLocation.uuid).toEqual(
      sampleRequisitionInput.requestingLocationUuid
    );

    expect(requestObject.requisitionItems[0].item.uuid).toEqual(
      sampleRequisitionInput.items[0].itemUuid
    );

    expect(requestObject.requisitionItems[0].quantity).toEqual(
      sampleRequisitionInput.items[0].quantity
    );

    expect(requestObject.requisitionStatuses.length).toEqual(0);
  });
});

describe('Given requisition issue input for accepting issued requisition', () => {
  const sampleRequisitionIssueInput: RequisitionIssueInput = {
    issueUuid: 'issue_uuid',
    issueingLocationUuid: 'issueing_location',
    receivingLocationUuid: 'receiving_location',
    receiptItems: [
      {
        itemUuid: 'item_uuid',
        quantity: 30,
      },
    ],
  };

  const requisitionIssueObject = Requisition.createRequisitionIssue(
    sampleRequisitionIssueInput
  );
  it('should return requisition issue object accepted by recieve api', () => {
    expect(requisitionIssueObject.issue.uuid).toEqual(
      sampleRequisitionIssueInput.issueUuid
    );

    expect(requisitionIssueObject.issueingLocation.uuid).toEqual(
      sampleRequisitionIssueInput.issueingLocationUuid
    );

    expect(requisitionIssueObject.receivingLocation.uuid).toEqual(
      sampleRequisitionIssueInput.receivingLocationUuid
    );

    expect(requisitionIssueObject.receiptItems[0].item.uuid).toEqual(
      sampleRequisitionIssueInput.receiptItems[0].itemUuid
    );

    expect(requisitionIssueObject.receiptItems[0].quantity).toEqual(
      sampleRequisitionIssueInput.receiptItems[0].quantity
    );
  });
});

describe('Given a requisition id for requisition to cancel', () => {
  const requestStatus = Requisition.createRequisitionStatusObject(
    'cancellable_requistion',
    '',
    'CANCELLED'
  );
  it('should requisition object accepted by request api', () => {
    expect(requestStatus.requisition.uuid).toEqual('cancellable_requistion');
    expect(requestStatus.status).toEqual('CANCELLED');
    expect(requestStatus.remarks).toBeDefined();
  });
});
