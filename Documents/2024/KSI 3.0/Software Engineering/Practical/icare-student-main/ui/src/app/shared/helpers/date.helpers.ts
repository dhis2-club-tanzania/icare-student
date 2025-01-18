import * as moment from "moment";

export function getDateDifferenceYearsMonthsDays(d1, d2) {
  var DateDiff = {
    inDays: function (d1, d2) {
      var t2 = d2.getTime();
      var t1 = d1.getTime();

      return (t2 - t1) / (24 * 3600 * 1000);
    },

    inWeeks: function (d1, d2) {
      var t2 = d2.getTime();
      var t1 = d1.getTime();

      return (t2 - t1) / (24 * 3600 * 1000 * 7);
    },

    inMonths: function (d1, d2) {
      var d1Y = d1.getFullYear();
      var d2Y = d2.getFullYear();
      var d1M = d1.getMonth();
      var d2M = d2.getMonth();

      return d2M + 12 * d2Y - (d1M + 12 * d1Y);
    },

    inYears: function (d1, d2) {
      return d2.getFullYear() - d1.getFullYear();
    },
  };
  var months = DateDiff.inYears(d1, d2) * 12;
  var month = DateDiff.inMonths(d1, d2) - months;
  var days = DateDiff.inYears(d1, d2) * 365;

  var dy = DateDiff.inDays(d1, d2) - days - month * 30;
  return {
    years: DateDiff.inYears(d1, d2),
    months: month,
    days: dy,
  };
}

export function getAgeInYearsMontthsDays(birthdate) {
  var DOB = new Date(birthdate);
  var today = new Date();
  var age = today.getTime() - DOB.getTime();
  var elapsed = new Date(age);
  var year = elapsed.getFullYear() - 1970;
  var month = elapsed.getMonth();
  var day = elapsed.getDate();

  return {
    years: year,
    months: month,
    days: day,
  };
}

export function compateTwoDates(date1: Date, date2: Date) {
  let year1 = date1.getFullYear();
  let month1 = date1.getMonth();
  let day1 = date1.getDate();
  let hours1 = date1.getHours() === 24 ? 0 : date1.getHours();
  let minutes1 = date1.getMinutes();
  

  let year2 = date2.getFullYear();
  let month2 = date2.getMonth();
  let day2 = date2.getDate();
  let hours2 = date2.getHours() === 24 ? 0 : date2.getHours();
  let minutes2 = date2.getMinutes();


  let date1IsGreater: boolean;
  let date2IsGreater: boolean;
  let datesEquals: boolean;

  if (year1 > year2) {
    date1IsGreater = true;
  } else if (year1 === year2 && month1 > month2) {
    date1IsGreater = true;
  } else if (year1 === year2 && month1 === month2 && day1 > day2) {
    date1IsGreater = true;
  } else if (
    year1 === year2 &&
    month1 === month2 &&
    day1 === day2 &&
    hours1 > hours2
  ) {
    date1IsGreater = true;
  } else if (
    year1 === year2 &&
    month1 === month2 &&
    day1 === day2 &&
    hours1 === hours2 &&
    minutes1 > minutes2
  ) {
    date1IsGreater = true;
  } else {
    date1IsGreater = false;
  }

  if (year2 > year1) {
    date2IsGreater = true;
  } else if (year2 === year1 && month2 > month1) {
    date2IsGreater = true;
  } else if (year2 === year1 && month2 === month1 && day2 > day1) {
    date2IsGreater = true;
  } else if (
    year2 === year1 &&
    month2 === month1 &&
    day2 === day1 &&
    hours2 > hours1
  ) {
    date2IsGreater = true;
  } else if (
    year2 === year1 &&
    month2 === month1 &&
    day2 === day1 &&
    hours2 === hours1 &&
    minutes2 > minutes1
  ) {
    date2IsGreater = true;
  } else {
    date2IsGreater = false;
  }

  datesEquals =
    year1 === year2 &&
    month1 === month2 &&
    day1 === day2 &&
    hours1 === hours2 &&
    minutes1 === minutes2
      ? true
      : false;

  return {
    date1isGreater: date1IsGreater,
    date2isGreater: date2IsGreater,
    datesEquals: datesEquals,
  };
}
