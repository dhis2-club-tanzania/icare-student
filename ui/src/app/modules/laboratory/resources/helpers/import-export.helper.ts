import { orderBy, uniq } from "lodash";
export function generateEmptyExcelTemplate(): any {
  return null;
}

export function generateExcelTemplateWithSamples(samples: any[]): any {
  return null;
}

export function processImportedExcelFile(file: any): any {
  return "TESTING";
}

export function formulateHeadersFromExportTemplateReferences(
  references: any[]
): any {
  let formattedHeaders = {
    rowOneItems: [],
    rowTwoItems: [],
  };
  const differentCategories = uniq(
    references?.map((reference) => reference?.category)
  );
  formattedHeaders.rowOneItems = differentCategories?.map((category) => {
    return {
      key: category,
      name: category.toUpperCase(),
      colspan: (
        references?.filter((reference) => reference?.category === category) ||
        []
      )?.length,
    };
  });
  formattedHeaders.rowTwoItems = orderBy(references, ["order"], ["asc"]);
  return formattedHeaders;
}
