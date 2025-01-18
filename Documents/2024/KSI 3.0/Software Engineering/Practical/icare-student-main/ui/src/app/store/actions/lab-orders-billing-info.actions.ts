import { createAction, props } from '@ngrx/store';

export const loadLabOrdersBillingInformation = createAction(
  '[Lab Orders Billing Info] load lab order billing infos',
  props<{ parameters: any }>()
);

export const addLoadedLabOrdersBillingInfo = createAction(
  '[Lab Orders Billing Info] add loaded details',
  props<{ ordersBillingInfo: any }>()
);

export const loadingLabOrderBillingInfoFails = createAction(
  '[Lab Orders Billing Info] loading lab orders billing infos fails',
  props<{ error: any }>()
);

export const getBillingInfoByVisitUuid = createAction(
  '[Billing info] get lab billing info by visit uuid',
  props<{ visitUuid: string }>()
);

export const getBillingInfoBymRNo = createAction(
  '[Billing info] get lab billing info by mrNo',
  props<{ mrn: string; visitsParameters: any }>()
);
