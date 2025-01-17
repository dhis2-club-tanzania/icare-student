export interface BaseState {
  loading: boolean;
  loaded: boolean;
  hasError: boolean;
  error: any;
}

export const initialBaseState: BaseState = {
  loading: false,
  loaded: false,
  hasError: false,
  error: null,
};

export const loadingBaseState: BaseState = {
  ...initialBaseState,
  loading: true,
};

export const loadedBaseState: BaseState = {
  ...loadingBaseState,
  loading: false,
  loaded: true,
};

export const errorBaseState: BaseState = {
  ...loadingBaseState,
  loading: false,
  hasError: true,
};
