export function calculateFieldValueFromCalculationExpression(
  values: any,
  autoCalculationAttribute: any
): any {
  const expression = autoCalculationAttribute?.value;
  let calculatedValue;
  if (expression?.indexOf("#{LOG10") > -1) {
    const pattern = /#{LOG10\((.*?)\)}/;
    let match = expression.match(pattern);

    let referenceId = "";
    if (match) {
      referenceId = match[1];
    }
    if (values[referenceId]?.value) {
      calculatedValue = Math.log10(values[referenceId]?.value);
    }
  }

  return calculatedValue;
}

export function identifyFieldIdsFromExpressions(expression: string): string[] {
  let ids = [];
  const pattern = /#{LOG10\((.*?)\)}/;
  let match = expression.match(pattern);

  if (match) {
    ids = [...ids, match[1]];
  }
  return ids;
}
