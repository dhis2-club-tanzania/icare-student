export function constructMessagesForDrugs(
  data,
  days,
  frequency,
  dosePerIntake,
  startingDateTime
): any {
  console.log("data", data);
  let messages = [];
  if (days && frequency && dosePerIntake && startingDateTime) {
    for (
      let count = 0;
      count < Number(days) * Number(frequency?.frequencyPerDay);
      count++
    ) {
      const hours = count * Number(24 / Number(frequency?.frequencyPerDay));
      const currentDate = addHoursToTheDate(startingDateTime, hours);
      messages = [
        ...messages,
        {
          message:
            "Haloo, unakumbushwa kutumia " +
            dosePerIntake +
            " cha " +
            data?.drug +
            " saa " +
            currentDate.toTimeString().substring(0, 5),
          dateTime: addHoursToTheDate(startingDateTime, hours),
          status: "WAITING",
          phoneNumber: data?.generalMetadataConfigurations?.facilityPhoneNumber,
          recipient: data?.patientPhoneAttribute,
        },
      ];
    }
  }
  return messages;
}

function addHoursToTheDate(date: Date, hours: number): Date {
  return new Date(new Date(date).setHours(date.getHours() + hours));
}
