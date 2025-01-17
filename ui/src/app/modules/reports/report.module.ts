import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { HomeComponent } from "./containers/home/home.component";
import { ReportsGeneratorComponent } from "./containers/reports-generator/reports-generator.component";
import { ReportRoutingModule } from "./report-routing.module";
import { reportComponents } from "./components";
import { reportsContainers } from "./containers";
import { reportsPages } from "./pages";

@NgModule({
  declarations: [
    HomeComponent,
    ReportsGeneratorComponent,
    ...reportComponents,
    ...reportsContainers,
    ...reportsPages,
  ],
  imports: [CommonModule, ReportRoutingModule, SharedModule],
  providers: [],
})
export class ReportModule {}
