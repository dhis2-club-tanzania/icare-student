import * as _ from 'lodash';
import { formatDateToYYMMDD } from './format-date.helper';
import { formatSingleStringToPair } from './format-dates-types.helper';

export function formatDataReportResponse(responseInfo) {
  console.log('response :: ', responseInfo);

  let reportData = {
    headers: _.map(responseInfo, (response, index) => {
      const keys = Object.keys(response);
      return {
        name: response[keys[0]],
        index: index,
      };
    }),
    reportHeades: formatReportDataKeys(Object.keys(responseInfo[0])),
    data: formatRespData(responseInfo),
  };

  // console.log("reportData", reportData);

  return reportData;
}

function formatRespData(datas) {
  return _.map(datas, (row) => {
    const keys = Object.keys(row);
    let formattedRow = {};
    _.each(keys, (key) => {
      formattedRow[key] = {
        value: row[key].indexOf(':') > -1 ? row[key].split(':')[1] : row[key],
        mapping: row[key].indexOf(':') > -1 ? row[key]?.split(':')[0] : null,
      };
    });
    return formattedRow;
  });
}

export function formatReportResponse(
  responseInfo,
  configs?: any,
  columns?: Array<any>
) {
  let reportData;
  if (configs?.isDataSet) {
    reportData = {
      headers: _.map(responseInfo, (response, index) => {
        const keys = Object.keys(response);
        return {
          name: response[keys[0]],
          index: index,
        };
      }),
      // reportHeades: formatReportDataKeys(Object.keys(responseInfo[0])),
      reportHeades: _.map(columns, (col) => {
        return {
          id: col?.name,
          name: col?.name?.split('_').join(' '),
        };
      }),
      data: formatResponseData(responseInfo, configs?.elements),
    };
  } else {
    reportData = responseInfo.map((response) => {
      return {
        response: response,
        eventDate: formatDateToYYMMDD(new Date(response?.date_of_death)),
        notes: [],
        program: '',
        programStage: '',
        orgUnit: '',
        dataValues: [
          { dataElement: 'xqH6UiBNIQC', value: '2021-04-20' },
          {
            dataElement: 'sVasJuLcPMo',
            value:
              response?.patient_first_name +
              ' ' +
              response?.middle_name +
              ' ' +
              response?.family_name,
          },
          {
            dataElement: 'UjPZIq15xs1',
            value: response?.gender === 'M' ? 'Male' : 'Female',
          },
          { dataElement: 'opXpbkyZtt7', value: null },
          { dataElement: 'JBd69xUmAod', value: null },
          { dataElement: 'kc3iDYxC7zf', value: null },
          { dataElement: 'qXBUgxyl1GD', value: null },
          { dataElement: 'FiktSOfHN6Q', value: null },
          { dataElement: 'X39ORSc1z5U', value: response?.birthdate },
          {
            dataElement: 'JJkV68Devly',
            value: response?.is_years
              ? 'Years'
              : response?.is_months
              ? 'Months'
              : response?.is_days
              ? 'Days'
              : 'Hours',
          },
          { dataElement: 'NObeVzfAMFQ', value: null },
          { dataElement: 'EtT3rwQRf9K', value: null },
          { dataElement: 'OI68JimFGOW', value: null },
          { dataElement: 'inpNqizMHIa', value: null },
          { dataElement: 'LzUOjfAyKlj', value: null },
          { dataElement: 'Q7QyAO0A95B', value: null },
          { dataElement: 'j4fAUPSok9D', value: null },
          {
            dataElement: 'Swn04dN2EwP',
            value: response?.is_years
              ? response?.age_years
              : response?.is_months
              ? response?.months
              : response?.is_days
              ? response?.days
              : 0,
          },
          {
            dataElement: 'uochSI2xLGI',
            value:
              configs && configs?.mappingUnderlyingCausesOfDeath
                ? configs?.mappingUnderlyingCausesOfDeath[
                    response?.immediate_cause_uuid
                  ]?.uid
                : null,
          },
          {
            dataElement: 'A0q2I8nTWcV',
            value:
              configs && configs?.mappingUnderlyingCausesOfDeath
                ? configs?.mappingUnderlyingCausesOfDeath[
                    response?.underlying_cause_uuid
                  ]?.Code
                : null,
          },
        ],
      };
    });
  }

  // console.log("reportData", reportData);

  return reportData;
}

function formatReportDataKeys(keys) {
  keys = [
    ..._.filter(keys, (key) => {
      return key.toLowerCase() == 'maelezo' ? true : false;
    }),
    ..._.filter(keys, (key) => {
      return key.toLowerCase() !== 'maelezo' ? true : false;
    }),
  ];

  return _.map(keys, (key) => {
    return {
      id: key,
      name: key.split('_').join(' '),
    };
  });
}

function formatResponseData(dataRows, elements) {
  /*console.log(
    'formatted rows :: ',
    _.map(dataRows, (row) => {
      const keys = Object.keys(row);
      let formattedRow = {};
      _.each(keys, (key) => {
        const value =
          row[key].indexOf(':') > -1 ? row[key].split(':')[1] : row[key];
        formattedRow[key] = {
          value:
            key !== 'Maelezo' ? value : value.replace('HMIS Diagnosis - ', ''),
          mapping: row[key].indexOf(':') > -1 ? row[key]?.split(':')[0] : null,
          dataElement:
            row[key].indexOf(':') > -1
              ? row[key]?.split(':')[0].split('-')[0]
              : '',
        };
      });
      return formattedRow;
    })
  ); */
  return _.map(dataRows, (row) => {
    const keys = Object.keys(row);
    let formattedRow = {};
    _.each(keys, (key) => {
      const value =
        row[key].indexOf(':') > -1 ? row[key].split(':')[1] : row[key];
      formattedRow[key] = {
        value:
          key !== 'Maelezo' ? value : value.replace('HMIS Diagnosis - ', ''),
        mapping: row[key].indexOf(':') > -1 ? row[key]?.split(':')[0] : null,
        dataElement:
          row[key].indexOf(':') > -1
            ? row[key]?.split(':')[0].split('-')[0]
            : '',
      };
    });
    return formattedRow;
  });
}

export function createDHIS2Object(
  reportDetails,
  period?,
  reportConfigs?,
  facilityConfigs?
) {
  const orderedLogs =
    reportDetails?.logs && reportDetails?.logs?.length > 0
      ? _.orderBy(
          reportDetails?.logs.filter((log) => log?.period === period?.id) || [],
          ['timestamp'],
          ['desc']
        )
      : [];
  const sentReport =
    reportDetails?.logs &&
    reportDetails?.logs?.length > 0 &&
    orderedLogs &&
    orderedLogs?.length > 0
      ? JSON.parse(orderedLogs[0]?.payload)
      : null;
  let now = new Date();
  let formattedObject;
  if (reportConfigs?.isDataSet) {
    formattedObject = {
      dataSet: reportConfigs?.dataSet,
      completeDate: !sentReport
        ? now.getFullYear() +
          '-' +
          formatSingleStringToPair((now.getMonth() + 1).toString()) +
          '-' +
          now.getDate()
        : sentReport?.completeDate,
      period: period?.id,
      orgUnit: facilityConfigs?.uuid,
      dataValues: getDataValues(reportDetails?.data),
    };
  } else {
    formattedObject = {
      eventDate: reportDetails.eventDate,
      notes: [],
      program: reportConfigs?.program,
      programStage: reportConfigs?.programStage,
      orgUnit: facilityConfigs?.uuid,
      dataValues: reportDetails?.dataValues.filter(
        (dataValue) => dataValue?.value
      ),
    };
  }

  // console.log("formattedObject", formattedObject);
  return formattedObject;
}

function getDataValues(dhis2Data) {
  // console.log(dhis2Data);
  // return null;
  let data = [];
  _.map(dhis2Data, (dataRow) => {
    _.map(Object.keys(dataRow), (key) => {
      if (dataRow[key]['value'] && dataRow[key]['mapping']) {
        data = [
          ...data,
          {
            dataElement: dataRow[key]['mapping'].split(':')[0].split('-')[0],
            categoryOptionCombo: dataRow[key]['mapping']
              .split(':')[0]
              .split('-')[1],
            value: dataRow[key]['value'],
            comment: null,
          },
        ];
      }
    });
    // if (key.indexOf(":") > -1) {

    // } else {
    //   return undefined;
    // }
  });
  return _.filter(data, (dataValue) => {
    if (dataValue?.value && Number(dataValue?.value) > 0) {
      return dataValue;
    }
  });
}

export function addComparisonBetweenCurrentDataAndDataSent(
  combinedResponse,
  periodId
) {
  const orderedLogs =
    combinedResponse?.logs && combinedResponse?.logs?.length > 0
      ? _.orderBy(
          combinedResponse?.logs.filter((log) => log?.period === periodId) ||
            [],
          ['timestamp'],
          ['desc']
        )
      : [];
  let sentDataValues = [];
  const sentReport =
    combinedResponse?.logs &&
    combinedResponse?.logs?.length > 0 &&
    orderedLogs &&
    orderedLogs?.length > 0
      ? JSON.parse(orderedLogs[0]?.payload)
      : null;
  if (sentReport) {
    sentDataValues = sentReport?.dataValues;
  }

  return {
    ...combinedResponse,
    data:
      combinedResponse && combinedResponse?.data
        ? combinedResponse?.data.map((dataRow) => {
            const dataColumns = Object.keys(dataRow).map((key) => {
              let matchedDataValueSent;
              if (dataRow[key]?.mapping && sentDataValues.length > 0) {
                matchedDataValueSent = (sentDataValues.filter(
                  (dataValue) =>
                    dataValue?.dataElement ===
                      dataRow[key]?.mapping.split('-')[0] &&
                    dataValue?.categoryOptionCombo ===
                      dataRow[key]?.mapping.split('-')[1] &&
                    dataValue?.value === dataRow[key]?.value &&
                    dataRow[key]?.value !== '0'
                ) || [])[0];
              }

              return {
                key: key,
                value: dataRow[key]?.value,
                mapping: dataRow[key]?.mapping,
                dataElement: dataRow[key]?.dataElement,
                changed: !sentReport
                  ? false
                  : matchedDataValueSent || dataRow[key]?.value === '0'
                  ? false
                  : true,
                matchedDataValue: matchedDataValueSent,
              };
            });
            return _.keyBy(dataColumns, 'key');
          })
        : [],
  };
}
