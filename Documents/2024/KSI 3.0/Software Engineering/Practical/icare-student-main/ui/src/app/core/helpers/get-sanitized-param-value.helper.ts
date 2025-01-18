export function getSanitizedParamValue(
  value: string,
  paramType: string
): string {
  switch (paramType) {
    case 'DATE':
      return new Date(value).toISOString();
    default:
      return value;
  }
}
