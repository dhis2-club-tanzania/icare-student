import { Component, Input, OnInit } from "@angular/core";
import { MatButtonToggleChange } from "@angular/material/button-toggle";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import * as _ from "lodash";
import * as Highcharts from "highcharts";
import * as moment from "moment";
import { Observable } from "rxjs";
import { AppState } from "src/app/store/reducers";
import { getProviderDetails } from "src/app/store/selectors/current-user.selectors";
import { PrintResultsModalComponent } from "../../../sample-acceptance-and-results/components/print-results-modal/print-results-modal.component";
import { SamplesService } from "src/app/shared/services/samples.service";
import {
  getAllSampleTypes,
  getCodedSampleRejectionReassons,
  getLabDepartments,
  getLabTestsContainers,
  getParentLocation,
} from "src/app/store/selectors";
import { formatDateToYYMMDD } from "src/app/shared/helpers/format-date.helper";
import {
  keyDepartmentsByTestOrder,
  keySampleTypesByTestOrder,
} from "src/app/shared/helpers/sample-types.helper";
import { generateSelectionOptions } from "src/app/shared/helpers/patient.helper";
import { ExportService } from "src/app/shared/services/export.service";
import { map } from "rxjs/operators";
import { ExportDataService } from "src/app/core/services/export-data.service";
import { MatSelectChange } from "@angular/material/select";
import { Router } from "@angular/router";
import { go } from "src/app/store/actions";

@Component({
  selector: "app-lab-reports",
  templateUrl: "./lab-reports.component.html",
  styleUrls: ["./lab-reports.component.scss"],
})
export class LabReportsComponent implements OnInit {
  @Input() configuredReports: any[];
  @Input() labConfigs: any;
  providerDetails$: Observable<any>;
  sampleTypes$: Observable<any>;
  labSamplesAndTestsContainers$: Observable<any>;
  labSamplesDepartments$: Observable<any>;
  codedSampleRejectionReasons$: Observable<any>;

  chart: any;
  selectionDates: any;
  startDate: Date;
  endDate: Date;
  loadingReport: boolean;
  departments: string[];
  groupedByDeptDataObject: any = {};
  reports = [];
  currentReport: any;
  specimenSources: any[];
  period: any;
  Totals: any = {
    all: 0,
    completed: 0,
    progress: 0,
  };
  showSubMenu: any = {};
  dateChanged: boolean = false;

  resultsLoader: any = {};
  searchingText: string = "";
  facilityDetails$: any;
  errors: any[] = [];
  constructor(
    private exportService: ExportService,
    private sampleService: SamplesService,
    private store: Store<AppState>,
    private dialog: MatDialog,
    private exportDataService: ExportDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.providerDetails$ = this.store.select(getProviderDetails);
    this.sampleTypes$ = this.store.select(getAllSampleTypes);
    this.labSamplesAndTestsContainers$ = this.store.select(
      getLabTestsContainers
    );
    this.labSamplesDepartments$ = this.store.select(getLabDepartments);
    this.codedSampleRejectionReasons$ = this.store.select(
      getCodedSampleRejectionReassons
    );

    this.reports = [...this.reports, ...this.configuredReports];
    this.currentReport = this.reports[0];
    this.facilityDetails$ = this.store.select(getParentLocation).pipe(
      map((response) => {
        // TODO: Softcode attribute type uuid
        return {
          ...response,
          logo:
            response?.attributes?.length > 0
              ? (response?.attributes?.filter(
                  (attribute) =>
                    attribute?.attributeType?.uuid ===
                    "e935ea8e-5959-458b-a10b-c06446849dc3"
                ) || [])[0]?.value
              : null,
        };
      })
    );
  }

  onGetSelectedReport(report: any): void {
    this.store.dispatch(go({ path: ["/laboratory/reports/" + report?.uuid] }));
  }

  onGetCurrentReport(selectionEvent: MatSelectChange) {
    this.currentReport = null;
    this.selectionDates = null;
    setTimeout(() => {
      this.currentReport = selectionEvent?.value;
    }, 100);
  }

  dateRangeSelect() {
    if (this.startDate && this.endDate) {
      this.onSelectPeriod(null, "custom-range");
    }
  }

  onToggleSubMenus(e, parentReport, members) {
    e.stopPropagation();
    if (members && members?.length > 0) {
      this.showSubMenu[parentReport?.id] = this.showSubMenu[parentReport?.id]
        ? !this.showSubMenu[parentReport?.id]
        : true;
      this.currentReport = members[0];
    }
  }

  onSelectPeriod(buttonToggleChange: MatButtonToggleChange, mode?: string) {
    this.period = buttonToggleChange?.value || mode;

    if (buttonToggleChange) {
      this.startDate = null;
      this.endDate = null;
    }
    this.dateChanged = false;

    setTimeout(() => {
      switch (this.period) {
        case "ThisMonth": {
          let currentDate = moment(formatDateToYYMMDD(new Date()));
          this.selectionDates = {
            startDate: currentDate
              .startOf("month")
              .format()
              .split("T")
              .join(" ")
              .split("+")[0],
            endDate: currentDate
              .endOf("month")
              .format()
              .split("T")
              .join(" ")
              .split("+")[0],
          };
          this.dateChanged = true;
          break;
        }

        case "ThisWeek": {
          const today = formatDateToYYMMDD(new Date());
          let formattedDate = moment(
            formatDateToYYMMDD(
              new Date(
                Number(today.split("-")[0]),
                Number(today.split("-")[1]) - 1,
                Number(today.split("-")[2]) + 1
              )
            )
          );
          this.selectionDates = {
            startDate: formattedDate
              .startOf("week")
              .format()
              .split("T")
              .join(" ")
              .split("+")[0],
            endDate: formattedDate
              .endOf("week")
              .format()
              .split("T")
              .join(" ")
              .split("+")[0],
          };
          this.dateChanged = true;
          break;
        }

        case "custom-range": {
          this.selectionDates = {
            startDate: moment(formatDateToYYMMDD(this.startDate))
              .startOf("day")
              .format()
              .split("T")
              .join(" ")
              .split("+")[0],
            endDate: moment(formatDateToYYMMDD(this.endDate))
              .endOf("day")
              .format()
              .split("T")
              .join(" ")
              .split("+")[0],
          };
          this.dateChanged = true;
          break;
        }

        case "ThisYear": {
          let currentDate = moment(formatDateToYYMMDD(new Date()));
          this.selectionDates = {
            startDate: currentDate
              .startOf("year")
              .format()
              .split("T")
              .join(" ")
              .split("+")[0],
            endDate: currentDate
              .endOf("year")
              .format()
              .split("T")
              .join(" ")
              .split("+")[0],
          };
          this.dateChanged = true;
          break;
        }

        case "ToDay": {
          let currentDate = moment(formatDateToYYMMDD(new Date()));
          this.selectionDates = {
            startDate: currentDate
              .startOf("day")
              .format()
              .split("T")
              .join(" ")
              .split("+")[0],
            endDate: currentDate
              .endOf("day")
              .format()
              .split("T")
              .join(" ")
              .split("+")[0],
          };
          this.dateChanged = true;
          break;
        }
      }
      this.loadingReport = true;
    }, 100);
  }

  onResultsToPrint(
    e,
    visit,
    providerDetails,
    sampletypes,
    containers,
    departments,
    rejectionreasons,
    labConfigs
  ) {
    this.resultsLoader[visit] = { loading: true, error: false };
    this.resultsLoader["disableRestOfRows"] = true;
    e.stopPropagation();

    // console.log(visit, providerDetails, labConfigs);

    //loading sample results

    this.sampleService.getSampleByVisit(visit).subscribe((response) => {
      // process samples and open modal

      // console.log(
      //   'sample : ',
      //   response,
      //   departments,
      //   sampletypes,
      //   rejectionreasons,
      //   containers,
      //   labConfigs
      // );

      let patientsSamples = this.processResults(
        response,
        departments,
        sampletypes,
        rejectionreasons,
        containers,
        labConfigs
      );

      // console.log('processed samples :: ', patientsSamples);

      this.resultsLoader[visit] = { loading: false, error: false };
      this.resultsLoader["disableRestOfRows"] = false;

      this.dialog.open(PrintResultsModalComponent, {
        data: {
          patientDetailsAndSamples: patientsSamples,
          labConfigs: labConfigs,
          user: providerDetails,
        },
        width: "60%",
        height: "750px",
        disableClose: false,
      });
    });
  }

  processResults(
    samplesToProcess: any,
    departments: any,
    sampleTypes: any,
    codedSampleRejectionReasons: any,
    containers: any,
    configs
  ) {
    let searchingText = "";
    let department = "";

    const keyedDepartments = keyDepartmentsByTestOrder(departments);

    // console.log('keyed depts :: ', keyedDepartments);

    const keyedSpecimenSources = keySampleTypesByTestOrder(sampleTypes);

    // console.log('keyed spec src :: ', keyedSpecimenSources);
    const samples = _.map(samplesToProcess, (sample) => {
      return {
        ...sample,
        id: sample?.label,
        specimen: (_.filter(sampleTypes, {
          id: sample?.concept?.uuid,
        }) || [])[0],
        mrn: sample?.patient?.identifiers[0]?.id,
        department: keyedDepartments[sample?.orders[0]?.order?.concept?.uuid],
        collected: true,
        reasonForRejection:
          sample?.statuses?.length > 0 &&
          _.orderBy(sample?.statuses, ["timestamp"], ["desc"])[0]?.status ==
            "REJECTED"
            ? (codedSampleRejectionReasons.filter(
                (reason) =>
                  reason.uuid ===
                  _.orderBy(sample?.statuses, ["timestamp"], ["desc"])[0]
                    ?.remarks
              ) || [])[0]
            : sample?.statuses?.length > 0 &&
              _.orderBy(sample?.statuses, ["timestamp"], ["desc"])[0]?.status ==
                "RECOLLECT"
            ? (codedSampleRejectionReasons.filter(
                (reason) =>
                  reason.uuid ===
                  _.orderBy(sample?.statuses, ["timestamp"], ["desc"])[1]
                    ?.remarks
              ) || [])[0]
            : null,
        markedForRecollection:
          sample?.statuses?.length > 0 &&
          _.orderBy(sample?.statuses, ["timestamp"], ["desc"])[0]?.status ==
            "RECOLLECT"
            ? true
            : false,
        rejected:
          sample?.statuses?.length > 0 &&
          _.orderBy(sample?.statuses, ["timestamp"], ["desc"])[0]?.status ==
            "REJECTED"
            ? true
            : false,
        rejectedBy:
          sample?.statuses?.length > 0 &&
          _.orderBy(sample?.statuses, ["timestamp"], ["desc"])[0]?.status ==
            "REJECTED"
            ? _.orderBy(sample?.statuses, ["timestamp"], ["desc"])[0]?.user
            : null,
        departmentName:
          keyedDepartments[sample?.orders[0]?.order?.concept?.uuid]
            ?.departmentName,
        collectedBy: {
          display: sample?.creator?.display?.split(" (")[0],
          name: sample?.creator?.display?.split(" (")[0],
          uid: sample?.creator?.uuid,
        },
        accepted:
          (_.filter(sample?.statuses, { status: "ACCEPTED" }) || [])?.length > 0
            ? true
            : false,
        acceptedBy: this.formatUserChangedStatus(
          (_.filter(sample?.statuses, {
            status: "ACCEPTED",
          }) || [])[0]
        ),
        acceptedAt: (_.filter(sample?.statuses, {
          status: "ACCEPTED",
        }) || [])[0]["timestamp"],
        orders: _.map(sample?.orders, (order) => {
          return {
            ...order,
            order: {
              ...order?.order,
              concept: {
                ...keyedSpecimenSources[order?.order?.concept?.uuid],
                selectionOptions:
                  keyedSpecimenSources[order?.order?.concept?.uuid]?.hiNormal &&
                  keyedSpecimenSources[order?.order?.concept?.uuid]?.lowNormal
                    ? generateSelectionOptions(
                        keyedSpecimenSources[order?.order?.concept?.uuid]
                          ?.lowNormal,
                        keyedSpecimenSources[order?.order?.concept?.uuid]
                          ?.hiNormal
                      )
                    : [],
                setMembers:
                  keyedSpecimenSources[order?.order?.concept?.uuid]?.setMembers
                    ?.length == 0
                    ? []
                    : _.map(
                        keyedSpecimenSources[order?.order?.concept?.uuid]
                          ?.setMembers,
                        (member) => {
                          return {
                            ...member,
                            selectionOptions:
                              member?.hiNormal && member?.lowNormal
                                ? generateSelectionOptions(
                                    member?.lowNormal,
                                    member?.hiNormal
                                  )
                                : [],
                          };
                        }
                      ),
                keyedAnswers: _.keyBy(
                  keyedSpecimenSources[order?.order?.concept?.uuid]?.answers,
                  "uuid"
                ),
              },
            },
            firstSignOff: false,
            secondSignOff: false,
            collected: true,
            collectedBy: {
              display: sample?.creator?.display?.split(" (")[0],
              name: sample?.creator?.display?.split(" (")[0],
              uid: sample?.creator?.uuid,
            },
            accepted:
              (_.filter(sample?.statuses, { status: "ACCEPTED" }) || [])
                ?.length > 0
                ? true
                : false,
            acceptedBy: this.formatUserChangedStatus(
              (_.filter(sample?.statuses, {
                status: "ACCEPTED",
              }) || [])[0]
            ),
            containerDetails: containers[order?.order?.concept?.uuid]
              ? containers[order?.order?.concept?.uuid]
              : null,
            testAllocations: _.map(order?.testAllocations, (allocation) => {
              return {
                ...allocation,
                firstSignOff:
                  allocation?.statuses?.length > 0 &&
                  _.orderBy(allocation?.statuses, ["timestamp"], ["desc"])[0]
                    ?.status == "APPROVED"
                    ? true
                    : false,
                secondSignOff:
                  allocation?.statuses?.length > 0 &&
                  _.orderBy(allocation?.statuses, ["timestamp"], ["desc"])[0]
                    ?.status == "APPROVED" &&
                  _.orderBy(allocation?.statuses, ["timestamp"], ["desc"])[1]
                    ?.status == "APPROVED"
                    ? true
                    : false,
                rejected:
                  allocation?.statuses?.length > 0 &&
                  _.orderBy(allocation?.statuses, ["timestamp"], ["desc"])[0]
                    ?.status == "REJECTED"
                    ? true
                    : false,
                rejectionStatus:
                  allocation?.statuses?.length > 0 &&
                  _.orderBy(allocation?.statuses, ["timestamp"], ["desc"])[0]
                    ?.status == "REJECTED"
                    ? _.orderBy(
                        allocation?.statuses,
                        ["timestamp"],
                        ["desc"]
                      )[0]
                    : null,
                results: this.formatResults(allocation?.results),
                statuses: allocation?.statuses,
                resultsCommentsStatuses: this.getResultsCommentsStatuses(
                  allocation?.statuses
                ),
                allocationUuid: allocation?.uuid,
              };
            }),
          };
        }),
        searchingText: this.createSearchingText(sample),
        priorityHigh:
          (_.filter(sample?.statuses, { status: "HIGH" }) || [])?.length > 0
            ? true
            : false,
        priorityOrderNumber:
          (_.filter(sample?.statuses, { status: "HIGH" }) || [])?.length > 0
            ? 0
            : 1,
        configs: configs,
      };
    });

    const filteredCompletedSamples =
      _.filter(
        _.orderBy(
          _.filter(samples, (sample) => {
            const completedOrders = this.getCompletedOrders(sample?.orders);
            if (
              sample?.accepted &&
              completedOrders?.length == sample?.orders?.length
            ) {
              return sample;
            }
          }),
          ["dateCreated", "priorityOrderNumber"],
          ["asc", "asc"]
        ),
        (sample) => {
          if (
            sample?.searchingText
              ?.toLowerCase()
              .indexOf(searchingText.toLowerCase()) > -1 &&
            sample?.department?.departmentName
              .toLowerCase()
              .indexOf(department?.toLowerCase()) > -1
          ) {
            return sample;
          }
        }
      ) || [];

    const groupedByMRN = _.groupBy(filteredCompletedSamples, "mrn");

    let whats = _.map(Object.keys(groupedByMRN), (key) => {
      const samplesKeyedByDepartments = _.groupBy(
        groupedByMRN[key],
        "departmentName"
      );

      return {
        mrn: key,
        patient: groupedByMRN[key][0]?.patient,
        departments: _.map(Object.keys(samplesKeyedByDepartments), (dep) => {
          return {
            departmentName: dep,
            samples: samplesKeyedByDepartments[dep],
          };
        }),
      };
    });

    // console.log('whats returned :: ', whats);

    return whats?.length > 0 ? whats[0] : null;
  }

  getCompletedOrders(orders) {
    return (
      _.filter(orders, (order) => {
        if (
          order?.testAllocations?.length > 0 &&
          order?.testAllocations[0]?.secondSignOff
        ) {
          return order;
        }
      }) || []
    );
  }

  formatUserChangedStatus(statusDetails) {
    if (statusDetails)
      return {
        ...statusDetails,
        user: {
          display: statusDetails?.user?.name?.split(" (")[0],
          name: statusDetails?.user?.name?.split(" (")[0],
          uuid: statusDetails?.user?.uuid,
        },
      };
    return null;
  }

  createSearchingText(sample) {
    return (
      sample?.label +
      "-" +
      sample?.patient?.givenName +
      sample?.patient?.middleName +
      sample?.patient?.familyName +
      sample?.patient?.identifiers[0]?.id +
      _.map(sample?.orders, (order) => {
        return order?.order?.concept?.display;
      }).join("-")
    );
  }

  getResultsCommentsStatuses(statuses) {
    return _.filter(statuses, (status) => {
      if (status?.status != "APPROVED" && status?.status != "REJECTED") {
        return status;
      }
    });
  }

  formatResults(results) {
    // console.log(results);
    return _.orderBy(
      _.map(results, (result) => {
        return {
          value: result?.valueText
            ? result?.valueText
            : result.valueCoded
            ? result?.valueCoded?.uuid
            : result?.valueNumeric?.toString(),
          ...result,
          resultsFedBy: {
            name: result?.creator?.display
              ? result?.creator?.display.split("(")[0]
              : "",
            uuid: result?.creator?.uuid,
          },
        };
      }),
      ["dateCreated"],
      ["asc"]
    );
  }

  drawChart(categories: any, categoryName: string, data) {
    setTimeout(() => {
      this.chart = Highcharts.chart(
        "container" as any,
        {
          chart: {
            type: "column",
          },
          title: {
            text: "Turn Around time",
          },

          xAxis: {
            categories: categories.map((category) => category.name),
            crosshair: true,
          },
          yAxis: {
            min: 0,
            title: {
              text: "Minutes (min)",
            },
          },
          tooltip: {
            headerFormat:
              '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat:
              '<tr><td style="color:{series.color};padding:0"></td>' +
              '<td style="padding:0"><b>{point.y:.1f} min</b></td></tr>',
            footerFormat: "</table>",
            shared: true,
            useHTML: true,
          },
          plotOptions: {
            column: {
              pointPadding: 0.2,
              borderWidth: 0,
            },
          },
          series: [
            {
              name: categoryName,
              data: categories.map((category) =>
                this.generateValue(category, data)
              ),
            },
          ],
        } as any
      );
    }, 500);
  }

  generateValue(category, data) {
    const filteredData = category?.date?.startDate
      ? this.getTATByStartDateAndEndDate(category?.date, data)
      : _.filter(
          data,
          { Date: formatDateToYYMMDD(new Date(category?.date)) } || {}
        );
    // console.log(
    //   'formatDateToYYMMDD(new Date(category?.date))',
    //   formatDateToYYMMDD(new Date(category?.date))
    // );
    if (filteredData?.length > 0) {
      return (
        _.meanBy(filteredData, (data: any) =>
          Math.abs(data?.turn_around_time)
        ) / 8
      );
    } else {
      return null;
    }
  }

  onDownloadCSV(e) {
    e.stopPropagation();
    const table = document.getElementById("export-table");
    this.exportService.exportCSV(this.currentReport?.description, table);
  }

  onDownloadXLS(e: Event, id: string, fileName: string, type?: string) {
    e.stopPropagation();
    const table = document.getElementById("export-table");
    this.exportDataService.downloadTableToExcel(id, fileName, type);
  }

  getTATByStartDateAndEndDate(dates, allData) {
    let filteredData = [];
    _.each(allData, (data: any) => {
      if (
        formatDateToYYMMDD(new Date(data["Date"])) >= dates?.startDate &&
        formatDateToYYMMDD(new Date(data["Date"])) <= dates?.endDate
      ) {
        filteredData = [...filteredData, data];
      }
    });
    return filteredData;
  }

  onPrint(e) {
    e.stopPropagation();
    window.print();
  }
}
