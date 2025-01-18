import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LandingComponent, LoginComponent } from "./containers";
import { ModulesComponent } from "./containers/modules/modules.component";
import { AuthGuard } from "./guards/auth-guard.guard";

const routes: Routes = [
  {
    path: "",
    component: LandingComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        component: ModulesComponent,
      },
      {
        path: "nursing",
        loadChildren: () =>
          import("../modules/nursing/nursing.module").then(
            (m) => m.NursingModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "counselor",
        loadChildren: () =>
          import("../modules/nursing/nursing.module").then(
            (m) => m.NursingModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "vertical-programs",
        loadChildren: () =>
          import("../modules/vertical-programs/vertical-program.module").then(
            (m) => m.VerticalProgramsModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "clinic",
        loadChildren: () =>
          import("../modules/clinic/clinic.module").then((m) => m.ClinicModule),
        canActivate: [AuthGuard],
      },
      {
        path: "diagnostic",
        loadChildren: () =>
          import("../modules/clinic/clinic.module").then((m) => m.ClinicModule),
        canActivate: [AuthGuard],
      },
      {
        path: "laboratory",
        loadChildren: () =>
          import("../modules/laboratory/laboratory.module").then(
            (m) => m.LaboratoryModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "dispensing",
        loadChildren: () =>
          import("../modules/dispensing/dispensing.module").then(
            (m) => m.DispensingModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "store",
        loadChildren: () =>
          import("../modules/store/store.module").then((m) => m.StoreModule),
        canActivate: [AuthGuard],
      },
      {
        path: "registration",
        loadChildren: () =>
          import("../modules/registration/registration.module").then(
            (m) => m.RegistrationModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "billing",
        loadChildren: () =>
          import("../modules/billing/billing.module").then(
            (m) => m.BillingModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "e-claim",
        loadChildren: () =>
          import("../modules/e-claim/e-claim.module").then(
            (m) => m.EClaimModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "interactive-reports",
        loadChildren: () =>
          import("../modules/reports/report.module").then(
            (m) => m.ReportModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "social-worker",
        loadChildren: () =>
          import("../modules/social-worker/social-worker.module").then(
            (m) => m.SocialWorkerModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "maintenance",
        loadChildren: () =>
          import("../modules/maintenance/maintenance.module").then(
            (m) => m.MaintenanceModule
          ),
      },
      {
        path: "inpatient",
        loadChildren: () =>
          import("../modules/inpatient/inpatient.module").then(
            (m) => m.InpatientModule
          ),
      },
      {
        path: "theatre",
        loadChildren: () =>
          import("../modules/theatre/theatre.module").then(
            (m) => m.TheatreModule
          ),
      },
      {
        path: "mortuary",
        loadChildren: () =>
          import("../modules/mortuary/mortuary.module").then(
            (m) => m.MortuaryModule
          ),
      },
      {
        path: "theatre",
        loadChildren: () =>
          import("../modules/theatre/theatre.module").then(
            (m) => m.TheatreModule
          ),
      },
      {
        path: "radiology",
        loadChildren: () =>
          import("../modules/radiology/radiology.module").then(
            (m) => m.RadiologyModule
          ),
      },
      {
        path: "dhis2",
        loadChildren: () =>
          import("../modules/dhis2/dhis2.module").then((m) => m.DHIS2Module),
      },
    ],
  },
  {
    path: "login",
    component: LoginComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      relativeLinkResolution: "legacy",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
