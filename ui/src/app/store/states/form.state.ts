import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { ICAREForm } from 'src/app/shared/modules/form/models/form.model';
import { ObservationObject } from 'src/app/shared/resources/observation/models/obsevation-object.model';
import { BaseState, initialBaseState } from './base.state';

export interface FormState extends EntityState<ICAREForm>, BaseState {}

export const formAdapter: EntityAdapter<ICAREForm> = createEntityAdapter<
  ICAREForm
>();

export const initialFormState: FormState = formAdapter.getInitialState({
  ...initialBaseState,
});
