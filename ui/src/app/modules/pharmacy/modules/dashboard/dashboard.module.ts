import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { pages } from "./pages";
import { components } from "./components";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { NotificationComponent } from '../../services/notification.componet'; // Import the NotificationComponent

@NgModule({
    declarations: [...pages, ...components, NotificationComponent], // Declare the NotificationComponent
    imports: [CommonModule, DashboardRoutingModule, SharedModule]
})
export class DashboardModule {}