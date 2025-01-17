import { createAction, props } from '@ngrx/store';
import {
  IssueInput,
  IssuingObject,
} from 'src/app/shared/resources/store/models/issuing.model';

export const loadIssuings = createAction('[Issuing] load issuings');

export const loadIssuingsFail = createAction(
  '[Issuing] load issuings fail',
  props<{ error: any }>()
);

export const upsertIssuings = createAction(
  '[Issuing] upsert issuings',
  props<{ issuings: IssuingObject[] }>()
);

export const issueRequest = createAction(
  '[Issuing] issue request',
  props<{ id: string; issueInput: IssueInput }>()
);

export const issueRequestFail = createAction(
  '[Issuing] issue request fail',
  props<{ id: string; error: any }>()
);

export const rejectRequisition = createAction(
  '[Issuing] reject request',
  props<{ id: string, reason: string }>()
);

export const rejectRequisitionFail = createAction(
  '[Issuing] reject request fail',
  props<{ id: string; error: any }>()
);

export const removeIssue = createAction(
  '[Issuing] remove issue',
  props<{ id: string }>()
);
