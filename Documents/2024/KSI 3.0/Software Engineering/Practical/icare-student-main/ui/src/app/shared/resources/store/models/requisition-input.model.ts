export interface RequisitionInput {
  code?: string;
  requestedLocationUuid: string;
  requestingLocationUuid?: string;
  items: Array<{
    itemUuid: string;
    quantity: number;
    requisitionItemStatus?: [
      {
        status: string;
      }
    ];
  }>;
  requisitionStatuses: [
    {
      status: string;
    }
  ];
}
