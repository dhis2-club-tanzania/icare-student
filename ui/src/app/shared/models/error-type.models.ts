export interface StandardError {
  code?: string;
  message: string;
  detail?: string;
  globalErrors?: StandardError[];
}
