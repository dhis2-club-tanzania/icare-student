import { flatten, head, reverse, sortBy } from "lodash";
import { RequisitionStatus } from "./requisition.model";

export interface IssuingObject {
  id: string;
  name: string;
  requisitionUuid: string;
  itemUuid: string;
  quantityRequested: number;
  quantityIssued?: number;
  requestingLocation: any;
  requestedLocation: any;
  status: string;
  remarks: string;
  crudOperations?: {
    status: RequisitionStatus;
    error?: any;
  };
  requestDate?: Date;
}

export interface IssueStatusObject {
  issue: {
    uuid: string;
  };
  remarks: string;
  status: string;
}

export interface IssueInput {
  requisitionUuid: string;
  issuingLocationUuid?: string;
  issuedLocationUuid?: string;
  issueItems?: Array<{
    itemUuid: string;
    quantity: number;
  }>;
}

export interface IssueStatusInput {
  issueUuid: string;
  status: string;
  remarks?: string;
}

export interface IssueSave {
  requisition: {
    uuid: string;
  };
  issuedLocation: {
    uuid: string;
  };
  issueingLocation: {
    uuid: string;
  };
  issueItems: Array<{
    item: {
      uuid: string;
    };
    quantity: number;
  }>;
}

export class Issuing {
  constructor(private issue: any) {}

  get id(): string {
    return this.issue?.uuid;
  }
  get requisitionUuid(): string {
    return this.id;
  }
  get itemUuid(): string {
    return this.issue?.requisitionItems[0]?.item?.uuid;
  }

  get name(): string {
    return this.issue?.requisitionItems[0]?.item?.display;
  }

  get requestDate(): Date {
    return new Date(this.issue?.created);
  }

  get latestIssueItem(): any {
    return head(
      reverse(
        sortBy(
          flatten(
            this.issue?.issues.map((issue) =>
              (issue?.issueItems || []).map((issueItem) => ({
                ...issueItem,
                created: issue?.created,
              }))
            ),
            "created"
          )
        )
      )
    );
  }

  get quantityRequested(): number {
    if (this.issue?.requisitionItems.length != 0) {
      return this.issue?.requisitionItems[0]?.quantity || 0;
    } else {
      return 0;
    }
  }

  get quantityIssued(): number {
    return this.latestIssueItem?.quantity;
  }

  get requestingLocation(): { uuid: string; name: string } {
    return {
      uuid: this.issue?.requestingLocation?.uuid,
      name: this.issue?.requestingLocation?.display,
    };
  }

  get requestedLocation(): { uuid: string; name: string } {
    return {
      uuid: this.issue?.requestedLocation?.uuid,
      name: this.issue?.requestedLocation?.display,
    };
  }

  get status(): string {
    const requisitionIssues: any[] = this.issue?.issues;

    if (requisitionIssues?.length === 0) {
      const requisitionStatus = head(this.issue?.requisitionStatuses);

      return requisitionStatus?.status || "PENDING";
    }

    return "ISSUED";
  }

  get remarks(): string {
    return this.issue?.issueStatuses
      ? this.issue?.issueStatuses[0].remarks
      : "";
  }

  toJson(): IssuingObject {
    return {
      id: this.id,
      name: this.name,
      requisitionUuid: this.requisitionUuid,
      itemUuid: this.itemUuid,
      quantityRequested: this.quantityRequested,
      quantityIssued: this.quantityIssued,
      requestingLocation: this.requestingLocation,
      requestedLocation: this.requestedLocation,
      status: this.status,
      remarks: this.remarks,
      requestDate: this.requestDate,
    };
  }

  static createIssue(issueInput: IssueInput): IssueSave {
    if (!issueInput) {
      return null;
    }

    return {
      requisition: { uuid: issueInput.requisitionUuid },
      issuedLocation: { uuid: issueInput.issuedLocationUuid },
      issueingLocation: { uuid: issueInput.issuingLocationUuid },
      issueItems: (issueInput.issueItems || []).map((issueItem: any) => {
        return {
          item: { uuid: issueItem.itemUuid },
          quantity: issueItem.quantity,
          batch: issueItem?.batch,
          expiryDate: issueItem?.expiryDate,
        };
      }),
    };
  }

  static createIssueStatusObject(
    issueStatusInput: IssueStatusInput
  ): IssueStatusObject {
    if (!issueStatusInput) {
      return null;
    }

    return {
      issue: { uuid: issueStatusInput.issueUuid },
      status: issueStatusInput.status,
      remarks: issueStatusInput.remarks,
    };
  }
}
