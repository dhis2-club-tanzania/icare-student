export function processDateFromMaterialInput(event) {
  let formattedDate = '';
  if (event) {
    const currentDateValue = event;
    const day = currentDateValue.getDate();
    const month = currentDateValue.getMonth() + 1;
    formattedDate =
      currentDateValue.getFullYear() +
      '-' +
      ((month < 10 ? '0' : '') + month) +
      '-' +
      ((day < 10 ? '0' : '') + day);
  }
  return formattedDate;
}
