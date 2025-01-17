export interface OpenMRSGenericOrder {
  concept: string;
  orderType: string;
  action: string;
  orderer: string;
  patient: string;
  careSetting: string;
  urgency: string;
  instructions: string;
  type: string;
  department?: string;
  specimenSource?: string;
}
