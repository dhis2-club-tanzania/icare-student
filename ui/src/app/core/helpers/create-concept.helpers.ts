import { Textbox } from "src/app/shared/modules/form/models/text-box.model";

export function createDisplayPrecisionField(data?: any) {
  return new Textbox({
    id: "precision",
    key: "precision",
    label: "Display precision",
    type: "number",
    value: data?.displayPrecision,
  });
}
