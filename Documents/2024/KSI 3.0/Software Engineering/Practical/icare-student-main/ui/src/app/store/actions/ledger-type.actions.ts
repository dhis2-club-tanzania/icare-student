import { createAction, props } from '@ngrx/store';
import { LedgerTypeObject } from 'src/app/shared/resources/store/models/ledger-type.model';

export const loadLedgerTypes = createAction('[LedgerType] Load ledgerTypes');

export const loadLedgerTypesFail = createAction(
  '[LedgerType] Load ledgerTypes',
  props<{ error: any }>()
);

export const upsertLedgerTypes = createAction(
  '[LedgerType] upsert ledgerTypes',
  props<{ ledgerTypes: LedgerTypeObject[] }>()
);
