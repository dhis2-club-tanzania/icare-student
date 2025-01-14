import { orderBy, keyBy } from "lodash";

export function validateFormFields(rules: any[], values: any): any {
  rules = orderBy(rules, ["priority"], ["asc"]);
  let validationIssues = [];
  rules?.forEach((rule) => {
    if (rule) {
      // console.log("match(/#{.+?}/g)", rule?.condition?.match(/#{.+?}/g));
      rule?.condition?.match(/#{.+?}/g);
      if (
        rule?.condition?.indexOf("=") === -1 &&
        rule?.condition?.indexOf(">") > -1
      ) {
        const dataType = rule?.field?.dataType;
        const violated = evaluateLeftGreaterThanRight(
          rule?.condition,
          values,
          dataType
        );
        validationIssues = violated
          ? [
              ...validationIssues,
              {
                message: rule?.message,
                action: rule?.action,
                field: rule?.field?.concept,
              },
            ]
          : validationIssues;
      } else if (
        rule?.condition?.indexOf("=") === -1 &&
        rule?.condition?.indexOf("<") > -1
      ) {
        const dataType = rule?.field?.dataType;
        const violated = evaluateLeftLessThanRight(
          rule?.condition,
          values,
          dataType
        );
        validationIssues = violated
          ? [
              ...validationIssues,
              {
                message: rule?.message,
                action: rule?.action,
                field: rule?.field?.concept,
              },
            ]
          : validationIssues;
      }
    }
  });
  return keyBy(validationIssues, "field");
}

function evaluateLeftLessThanRight(
  expression: string,
  values: any,
  dataType?: string
): boolean {
  let leftExpression = expression?.split("<")[0];
  let rightExpression = expression?.split("<")[1];

  const leftSideReferences = leftExpression.match(/#{.+?}/g);
  const rightSideReferences = rightExpression.match(/#{.+?}/g);

  leftSideReferences?.forEach((reference) => {
    const referenceUuid = reference?.replace("#{", "").replace("}", "");
    const val = values[referenceUuid] ? values[referenceUuid] : 0;
    leftExpression = leftExpression.replace(reference, val);
  });

  const leftSideValue =
    leftSideReferences?.length > 1 ? eval(leftExpression) : leftExpression;

  rightSideReferences?.forEach((reference) => {
    const referenceUuid = reference?.replace("#{", "").replace("}", "");
    const val = values[referenceUuid] ? values[referenceUuid] : 0;
    rightExpression = rightExpression.replace(reference, val);
  });

  const rightSideValue =
    rightSideReferences?.length > 1 ? eval(rightExpression) : rightExpression;

  if (
    (dataType === "DATE" || dataType === "DATETIME") &&
    new Date(leftSideValue) > new Date(rightSideValue)
  ) {
    return true;
  } else if (leftSideValue > rightSideValue) {
    return true;
  } else {
    return false;
  }
}

function evaluateLeftGreaterThanRight(
  expression: string,
  values: any,
  dataType?: string
): boolean {
  let leftExpression = expression?.split(">")[0];
  let rightExpression = expression?.split(">")[1];

  const leftSideReferences = leftExpression.match(/#{.+?}/g);
  const rightSideReferences = rightExpression.match(/#{.+?}/g);

  leftSideReferences?.forEach((reference) => {
    const referenceUuid = reference?.replace("#{", "").replace("}", "");
    const val = values[referenceUuid] ? values[referenceUuid] : 0;
    leftExpression = leftExpression.replace(reference, val);
  });

  const leftSideValue =
    leftSideReferences?.length > 1 ? eval(leftExpression) : leftExpression;

  rightSideReferences?.forEach((reference) => {
    const referenceUuid = reference?.replace("#{", "").replace("}", "");
    const val = values[referenceUuid] ? values[referenceUuid] : 0;
    rightExpression = rightExpression.replace(reference, val);
  });

  const rightSideValue =
    rightSideReferences?.length > 1 ? eval(rightExpression) : rightExpression;

  if (
    (dataType === "DATE" || dataType === "DATETIME") &&
    new Date(leftSideValue) < new Date(rightSideValue)
  ) {
    return true;
  } else if (leftSideValue < rightSideValue) {
    return true;
  } else {
    return false;
  }
}
