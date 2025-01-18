import { RequisitionInput } from "./requisition-input.model";

import { head, sortBy, reverse, flatten } from "lodash";

export type RequisitionStatus =
  | "REQUESTED"
  | "CANCELLING"
  | "CANCELLED"
  | "REJECTING"
  | "REJECTED"
  | "ISSUING"
  | "ISSUED"
  | "RECEIVING"
  | "RECEIVED"
  | "FAILED";

export interface RequisitionStatusObject {
  requisition: { uuid: string };
  status: RequisitionStatus;
  remarks?: string;
}

export interface RequisitionObject {
  id: string;
  issueUuid?: string;
  itemUuid: string;
  name: string;
  created?: string;
  quantityRequested: number;
  quantityIssued?: number;
  targetStore: { uuid: string; name: string };
  requestingStore: { uuid: string; name: string };
  status: string;
  remarks?: string;
  crudOperationStatus?: {
    status: RequisitionStatus;
    error?: any;
  };
  issuedDate: Date;
  issueItems: any[];
}

export interface RequisitionReceiptObject {
  issue: {
    uuid: string;
  };
  receivingLocation: {
    uuid: string;
  };
  issueingLocation: {
    uuid: string;
  };
  receiptItems: {
    item: {
      uuid: string;
    };
    quantity: number;
    expiryDate?: Date;
    batch?: string;
  }[];
}

export interface RequisitionSave {
  uuid?: string;
  requestedLocation: {
    uuid: string;
  };
  requestingLocation: {
    uuid: string;
  };
  requisitionItems: Array<{
    item: {
      uuid: string;
    };
    quantity: number;
  }>;
  requisitionStatuses: RequisitionStatusObject[];
}

export interface RequisitionIssueInput {
  issueUuid: string;
  receivingLocationUuid: string;
  issueingLocationUuid: string;
  receiptItems: Array<{
    itemUuid: string;
    quantity: number;
  }>;
}

export interface RequisitionIssueSave {
  issue: {
    uuid: string;
  };
  receivingLocation: {
    uuid: string;
  };
  issueingLocation: {
    uuid: string;
  };
  receiptItems: Array<{
    item: {
      uuid: string;
    };
    quantity: number;
  }>;
}

export class Requisition {
  constructor(private requisition: any) {}

  get id(): string {
    return this.requisition?.uuid;
  }

  get name(): string {
    return this.requisition?.requisitionItems?.length
      ? this.requisition?.requisitionItems[0].item?.display
      : undefined;
  }

  get itemUuid(): string {
    return this.requisition?.requisitionItems?.length
      ? this.requisition?.requisitionItems[0].item?.uuid
      : undefined;
  }

  get created(): string {
    return this.requisition?.created || this.requisition?.dateCreated;
  }

  get issueUuid(): any {
    return head(this.requisition?.issues)?.uuid;
  }

  get issueItems(): any[] {
    return head(this.requisition?.issues)?.issueItems;
  }

  get latestIssueItem(): any {
    return head(
      reverse(
        sortBy(
          flatten(
            this.requisition?.issues?.map((issue) =>
              (issue?.issueItems || [])?.map((issueItem) => ({
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

  get latestIssueStatus(): any {
    return head(
      reverse(
        sortBy(
          flatten(
            this.requisition?.issues?.map((issue) => {
              if (issue?.issueStatuses.length === 0) {
                return [{ created: issue?.created }];
              }

              return (issue?.issueStatuses || [])?.map((issueStatus) => ({
                ...issueStatus,
                created: issue?.created,
              }));
            }),
            "created"
          )
        )
      )
    );
  }

  get issuedDate(): Date {
    return this.requisition.issues?.length > 0
      ? new Date(this.requisition?.issues[0]?.created)
      : null;
  }

  get quantityRequested(): number {
    return this.requisition?.requisitionItems?.length
      ? this.requisition?.requisitionItems[0]?.quantity || 0
      : 0;
  }

  get quantityIssued(): number {
    return this.latestIssueItem?.quantity;
  }

  get targetStore(): { uuid: string; name: string } {
    return {
      uuid: this.requisition?.requestedLocation?.uuid,
      name: this.requisition?.requestedLocation?.display,
    };
  }

  get requestingStore(): { uuid: string; name: string } {
    return {
      uuid: this.requisition?.requestingLocation?.uuid,
      name: this.requisition?.requestingLocation?.display,
    };
  }

  get status(): RequisitionStatus {
    const isReceived = this.requisition?.issues?.some(
      (issue) => issue?.receipts?.length > 0
    );

    if (isReceived) {
      return "RECEIVED";
    }

    const latestIssueStatus = this.latestIssueStatus;

    if (!latestIssueStatus) {
      const requisitionStatus = head(this.requisition?.requisitionStatuses);

      return requisitionStatus?.status || "PENDING";
    }

    return latestIssueStatus?.status || "ISSUED";
  }

  get remarks(): string {
    return this.requisition?.requisitionStatuses?.length
      ? this.requisition?.requisitionStatuses[0]?.remarks
      : undefined;
  }

  toJson(): RequisitionObject {
    return {
      id: this.id,
      issueUuid: this.issueUuid,
      itemUuid: this.itemUuid,
      name: this.name,
      created: this.created,
      quantityRequested: this.quantityRequested,
      quantityIssued: this.quantityIssued,
      targetStore: this.targetStore,
      requestingStore: this.requestingStore,
      status: this.status,
      remarks: this.remarks,
      issuedDate: this.issuedDate,
      issueItems: this.issueItems,
    };
  }

  static createRequisition(
    requisitionInput: RequisitionInput
  ): RequisitionSave {
    if (!requisitionInput) {
      return null;
    }
    return {
      requestedLocation: { uuid: requisitionInput?.requestedLocationUuid },
      requestingLocation: { uuid: requisitionInput?.requestingLocationUuid },
      requisitionItems: requisitionInput?.items?.map((item) => {
        return {
          item: {
            uuid: item?.itemUuid,
          },
          quantity: item?.quantity,
        };
      }),
      requisitionStatuses: [],
    };
  }

  static createRequisitionIssue(
    requisitionIssueInput: RequisitionIssueInput
  ): RequisitionIssueSave {
    if (!requisitionIssueInput) {
      return null;
    }
    return {
      issue: { uuid: requisitionIssueInput?.issueUuid },
      issueingLocation: { uuid: requisitionIssueInput?.issueingLocationUuid },
      receivingLocation: { uuid: requisitionIssueInput?.receivingLocationUuid },
      receiptItems: (requisitionIssueInput?.receiptItems || [])?.map(
        (receiptItem) => {
          return {
            item: { uuid: receiptItem?.itemUuid },
            quantity: receiptItem?.quantity,
          };
        }
      ),
    };
  }

  static createRequisitionStatusObject(
    requisitionId: string,
    reason: string,
    status: RequisitionStatus
  ): RequisitionStatusObject {
    if (!requisitionId) {
      return null;
    }
    return {
      requisition: { uuid: requisitionId },
      status,
      remarks: reason,
    };
  }

  static createRequisitionReceiptObject(
    requisition: RequisitionObject
  ): RequisitionReceiptObject {
    if (!requisition) {
      return null;
    }

    return {
      issue: { uuid: requisition?.issueUuid },
      receivingLocation: {
        uuid: requisition?.requestingStore?.uuid,
      },
      issueingLocation: {
        uuid: requisition?.targetStore?.uuid,
      },
      receiptItems: requisition?.issueItems?.map((issueItem) => {
        return {
          item: { uuid: issueItem?.item?.uuid },
          quantity: Number(issueItem?.quantity),
          expiryDate: new Date(issueItem?.expiryDate),
          batch: issueItem?.batch,
        };
      }),
    };
  }
}
