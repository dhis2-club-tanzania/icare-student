export function getSanitizedReportParamType(paramType: string): string {
  if (paramType.includes('Date')) {
    return 'DATE';
  }

  if (paramType.includes('Location')) {
    return 'LOCATION';
  }

  if (paramType.includes('Boolean')) {
    return 'BOOLEAN';
  }

  return '';
}
