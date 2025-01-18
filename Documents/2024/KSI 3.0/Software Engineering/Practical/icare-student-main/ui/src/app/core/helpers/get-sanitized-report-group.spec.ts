import { ReportGroup } from '../models/report-group.model';
import { getSanitizedReportGroup } from './get-sanitized-report-group.helper';

describe('Given I have dataset report configuration', () => {
  const dataSetResponse = [
    {
      class:
        'org.openmrs.module.appointmentscheduling.reporting.dataset.definition.AppointmentDataSetDefinition',
      uuid: 'c1bf0730-e69e-11e3-ac10-0800200c9a66',
      name:
        'appointmentschedulingui.appointmentDataSetDefinition.dailyAppointments',
      description:
        'appointmentschedulingui.appointmentDataSetDefinition.dailyAppointments',
      parameters: [
        { name: 'date', label: 'date', type: 'java.util.Date' },
        { name: 'location', label: 'location', type: 'org.openmrs.Location' },
      ],
      links: [
        {
          rel: 'self',
          uri:
            'http://icare:8080/openmrshttp://icare:8080/openmrshttp://icare:8080/openmrs/ws/reporting/v1/reportingrest/dataSetDefinition/c1bf0730-e69e-11e3-ac10-0800200c9a66',
        },
      ],
      resourceVersion: '1.8',
    },
    {
      class:
        'org.openmrs.module.reporting.dataset.definition.SqlDataSetDefinition',
      uuid: '5f0f5cc4-37f7-435f-8d25-4b5b7e996034',
      name: 'Revenue',
      description: 'Revenue for',
      parameters: [
        { name: 'startDate', label: 'Start Date', type: 'java.util.Date' },
        { name: 'endDate', label: 'End Date', type: 'java.util.Date' },
      ],
      links: [
        {
          rel: 'self',
          uri:
            'http://icare:8080/openmrshttp://icare:8080/openmrshttp://icare:8080/openmrs/ws/reporting/v1/reportingrest/dataSetDefinition/5f0f5cc4-37f7-435f-8d25-4b5b7e996034',
        },
      ],
      resourceVersion: '1.8',
    },
  ];

  const reportGroup = getSanitizedReportGroup({
    id: 'dataSet',
    name: 'DataSets',
    reports: dataSetResponse,
  });

  it('should return report group instance', () => {
    expect(reportGroup).toBeDefined();
  });

  it('should return have reports equaling response array count', () => {
    expect(reportGroup.reports.length).toEqual(dataSetResponse.length);
  });

  it('should have report with id and name same as in response object', () => {
    expect(reportGroup.reports[0].id).toEqual(dataSetResponse[0].uuid);
    expect(reportGroup.reports[0].name).toEqual(dataSetResponse[0].name);

    expect(reportGroup.reports[1].id).toEqual(dataSetResponse[1].uuid);
    expect(reportGroup.reports[1].name).toEqual(dataSetResponse[1].name);
  });

  it('should have report parameters with sanitized type and name', () => {
    expect(reportGroup.reports[0].parameters[0].name).toEqual(
      dataSetResponse[0].parameters[0].label
    );
    expect(reportGroup.reports[0].parameters[0].type).toEqual('DATE');

    expect(reportGroup.reports[0].parameters[1].name).toEqual(
      dataSetResponse[0].parameters[1].label
    );
    expect(reportGroup.reports[0].parameters[1].type).toEqual('LOCATION');
  });
});
