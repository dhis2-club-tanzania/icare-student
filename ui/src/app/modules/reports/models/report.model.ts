import { ReportParam } from './report-params.model';

export interface Report {
  reportGroup?: string;
  id: string;
  name: string;
  parameters: ReportParam[];
  dateParameters: ReportParam[];
  locationParameters: ReportParam[];
  otherParameters: ReportParam[];
  ageParameters?: ReportParam[];
}
