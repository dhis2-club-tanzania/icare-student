export function sanitizePatientsVisitsForTabularPatientListing(
  allAppointmentsData,
  paymentTypeSelected?,
  itemsPerPage?,
  currentPage?
) {
  const filteredVisitDetails =  allAppointmentsData;
  const data = filteredVisitDetails.map((appointment, index) => {
    return {
      ...appointment,
      position:
        itemsPerPage && currentPage
          ? itemsPerPage * currentPage + index + 1
          : index + 1,
      patietId: appointment.patient.display.split(" - ")[0],
      patientName: appointment.patient.display.split(" - ")[1],
      appointmentType: appointment.appointmentType.display,
      provider:appointment.timeSlot.appointmentBlock.provider.display,
      location:appointment.timeSlot.appointmentBlock.location.display,
      status:appointment.status.name,
      data: appointment,
      startTime: appointment.timeSlot.startDate,
      endTime: appointment.timeSlot.endDate,
    };
  });

  return data;
}
