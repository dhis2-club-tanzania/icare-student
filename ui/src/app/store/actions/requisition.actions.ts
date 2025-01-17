import { createAction, props } from '@ngrx/store';
import { RequisitionInput } from 'src/app/shared/resources/store/models/requisition-input.model';
import {
  RequisitionIssueInput,
  RequisitionObject,
} from '../../shared/resources/store/models/requisition.model';

export const loadRequisitions = createAction('[Requisition] load requisitions');

export const loadRequisitionsFail = createAction(
  '[Requisition] load requisitions fail',
  props<{ error: any }>()
);

export const upsertRequisitions = createAction(
  '[Requisition] upsert requisitions',
  props<{ requisitions: RequisitionObject[] }>()
);

export const upsertRequisition = createAction(
  '[Requisition] upsert requisition',
  props<{ requisition: RequisitionObject }>()
);

export const createRequest = createAction(
  '[Requisition] create request',
  props<{ requisitionInput: RequisitionInput }>()
);

export const createRequestFail = createAction(
  '[Requisition] create request fail',
  props<{ error: any }>()
);

export const acceptRequisitionIssue = createAction(
  '[Requisition] accept requisition issue',
  props<{ requisitionIssueInput: RequisitionIssueInput }>()
);

export const acceptRequisitionIssueFail = createAction(
  '[Requisition] accept requisition issue fail',
  props<{ error: any }>()
);

export const acceptRequisitionIssueSuccess = createAction(
  '[Requisition] accept requisition issue success',
  props<{ requisitionId: string }>()
);

export const cancelRequisition = createAction(
  '[Requisition] cancel request',
  props<{ id: string, reason: string }>()
);

export const cancelRequisitionFail = createAction(
  '[Requisition] cancel request fail',
  props<{ id: string; error: any }>()
);

export const receiveRequisition = createAction(
  '[Requisition] receive request',
  props<{ requisition: RequisitionObject }>()
);

export const receiveRequisitionFail = createAction(
  '[Requisition] receive request fail',
  props<{ id: string; error: any }>()
);

export const rejectRequisition = createAction(
  '[Requisition] reject request',
  props<{ id: string; issueUuid: string; rejectionReason: string }>()
);

export const rejectRequisitionFail = createAction(
  '[Requisition] reject request fail',
  props<{ id: string; error: any }>()
);

export const removeRequisition = createAction(
  '[Requisition] remove requisition',
  props<{ id: string }>()
);
