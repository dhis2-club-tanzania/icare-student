import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { LedgerTypeObject } from 'src/app/shared/resources/store/models/ledger-type.model';
import { BaseState, initialBaseState } from './base.state';

export interface LedgerTypeState
  extends EntityState<LedgerTypeObject>,
    BaseState {}

export const ledgerTypeAdapter: EntityAdapter<LedgerTypeObject> = createEntityAdapter<
  LedgerTypeObject
>();

export const initialledgerTypeState: LedgerTypeState = ledgerTypeAdapter.getInitialState(
  {
    ...initialBaseState,
  }
);
