export function sanitizePatientsVisitsForTabularPatientListing(
  allAppointmentsData,
  paymentTypeSelected?,
  itemsPerPage?,
  currentPage?
) {
  const filteredVisitDetails = paymentTypeSelected
    ? allAppointmentsData.filter(
        (visitData) => visitData?.visit?.paymentType === paymentTypeSelected
      )
    : allAppointmentsData;
  const data = filteredVisitDetails.map((visitDetails, index) => {
    return {
      ...visitDetails?.visit,
      position:
        itemsPerPage && currentPage
          ? itemsPerPage * currentPage + index + 1
          : index + 1,
      patietId: visitDetails?.appointment.patient.display.split(" - ")[0],
      patientName: visitDetails?.appointment.patient.display.split(" - ")[1],
      appointmentType: visitDetails.appointment.appointmentType.display,
      provider:visitDetails.appointment.timeSlot.appointmentBlock.provider.display,
      location:visitDetails.appointment.timeSlot.appointmentBlock.location.display,
      status:visitDetails.appointment.status.name,
      data: visitDetails,
      startTime: visitDetails.appointment.timeSlot.startDate,
      endTime: visitDetails.appointment.timeSlot.endDate,
    };
  });

  return paymentTypeSelected
    ? data?.filter((row) => row.paymentType === paymentTypeSelected)
    : data;
}
