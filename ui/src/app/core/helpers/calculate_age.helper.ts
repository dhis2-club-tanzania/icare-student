import * as moment from "moment";

export function calculateAgeUsingBirthDate(birthday) {
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export function calculateDifferenceBetweenDates(
  startDate: Date,
  endDate: Date
): any {
  let difference: any = {};
  var start = moment(startDate);
  var end = moment(endDate);

  const years = start.diff(end, "year");
  end.add(years, "years");

  const months = start.diff(end, "months");
  end.add(months, "months");

  const days = start.diff(end, "days");
  difference["years"] = years;
  difference["months"] = months;
  difference["days"] = days;
  return difference;
}
