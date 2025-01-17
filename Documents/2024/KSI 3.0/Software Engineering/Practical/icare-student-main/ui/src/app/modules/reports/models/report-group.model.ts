import { Report } from "./report.model";

export interface ReportGroup {
  id: string;
  name: string;
  reports: Report[];
}
