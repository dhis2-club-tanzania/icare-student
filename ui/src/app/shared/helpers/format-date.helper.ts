import { monthsOfTheYear } from "../constants/constants.constants";

export function getCurrentDate() {
  const now = new Date();

  now.setMinutes(now.getMinutes());
  return (
    now.getFullYear() +
    "-" +
    formatNumber((now.getMonth() + 1).toString()) +
    "-" +
    formatNumber(now.getDate().toString()) +
    "T" +
    now.getHours() +
    ":" +
    now.getMinutes() +
    ":" +
    now.getSeconds() +
    ".000+0530"
  );
}

function formatNumber(n) {
  if (n.length == 1) {
    return "0" + n;
  } else {
    return n;
  }
}

export function formatDateToYYMMDD(dateValue, reverse: boolean = false) {
  return reverse ? (
    formatMonthOrDate(dateValue.getDate(), "d") +
    "-" +
    formatMonthOrDate(dateValue.getMonth() + 1, "m") +
    "-" +
    dateValue.getFullYear()
    
  ) : (
    dateValue.getFullYear() +
    "-" +
    formatMonthOrDate(dateValue.getMonth() + 1, "m") +
    "-" +
    formatMonthOrDate(dateValue.getDate(), "d")
  );
}

function formatMonthOrDate(value, type) {
  if (type == "m" && value.toString().length == 1) {
    return "0" + value;
  } else if (type == "d" && value.toString().length == 1) {
    return "0" + value;
  } else {
    return value;
  }
}

export function getMonthYearRepresentation(dateId) {
  return ((
    monthsOfTheYear.filter(
      (monthYear) => monthYear?.value === dateId.substring(4)
    ) || []
  ).map((monthYearFiltered) => {
    return monthYearFiltered?.name + " " + dateId.substring(0, 4);
  }) || [])[0];
}

export function dateToISOStringMidnight(date: Date) {
  const year = date.getFullYear();
  const month =
    (date.getMonth() + 1).toString().length > 1
      ? `${date.getMonth() + 1}`
      : `0${date.getMonth() + 1}`;
  const day =
    date.getDate().toString().length > 1
      ? `${date.getDate()}`
      : `0${date.getDate()}`;
  return `${year}-${month}-${day}T00:00:00.000Z`;
}


/**
 * Returns the datetime in ISO string format localized with some options.
 * @param option Object that specifies the date and timezoneOffset if provided
 * @param option.date The date to be converted by default uses the current date
 * @param option.timezoneOffset Can be true for timezone offset by default it is false
 * @param option.exactTimezoneOffset Can be true if timezone offset is true and by default it is false. It returns exactly the timezone offset value
 * @returns ISo format date with based on the local timezone
 * If date not specified, current date is being used instead
 */
export function toISOStringFormat(options: { date: Date, timezoneOffset: boolean, exactTimezoneOffset: boolean } = { date: new Date(), timezoneOffset: false, exactTimezoneOffset: false }): string {
    var tzo = options.date.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = function (num: number) {
        return (num < 10 ? '0' : '') + num;
      };
  
    const dateTimeWithOffset = options?.date.getFullYear() +
      '-' + pad(options?.date.getMonth() + 1) +
      '-' + pad(options?.date.getDate()) +
      'T' + pad(options?.date.getHours()) +
      ':' + pad(options?.date.getMinutes()) +
      ':' + pad(options?.date.getSeconds()) +
      dif + pad(Math.floor(Math.abs(tzo) / 60)) +
      ':' + pad(Math.abs(tzo) % 60)
  
    const dateTimeWithExactly = options?.date.getFullYear() +
      '-' + pad(options?.date.getMonth() + 1) +
      '-' + pad(options?.date.getDate()) +
      'T' + pad(options?.date.getHours()) +
      ':' + pad(options?.date.getMinutes()) +
      ':' + pad(options?.date.getSeconds()) +
      tzo
  
    const dateTimeByDefault = options?.date.getFullYear() +
      '-' + pad(options?.date.getMonth() + 1) +
      '-' + pad(options?.date.getDate()) +
      'T' + pad(options?.date.getHours()) +
      ':' + pad(options?.date.getMinutes()) +
      ':' + pad(options?.date.getSeconds()) +
      '.000Z'
    return options?.timezoneOffset && !options.exactTimezoneOffset ? dateTimeWithOffset :
      options?.timezoneOffset && options.exactTimezoneOffset ? dateTimeWithExactly : dateTimeByDefault;
  
}

/**
 * Formats a given date object into a string representation, using a specified format string.
 * @param date The date object
 * @param format The format string (default is 'DD-MM-YYYY')
 * @returns The formatted date string
 */
export function formatDateToString(date: Date = new Date(), format: string = 'DD-MM-YYYY'): string {
  try {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();

    return format
      .replace('YYYY', year.toString())
      .replace('MM', month.toString().padStart(2, '0'))
      .replace('DD', day.toString().padStart(2, '0'))
      .replace('hh', hours.toString().padStart(2, '0'))
      .replace('mm', minutes.toString().padStart(2, '0'))
      .replace('ss', seconds.toString().padStart(2, '0'))
      .replace('SSS', milliseconds.toString().padStart(3, '0'));
  } catch (error) {
    return '';
  }
}
