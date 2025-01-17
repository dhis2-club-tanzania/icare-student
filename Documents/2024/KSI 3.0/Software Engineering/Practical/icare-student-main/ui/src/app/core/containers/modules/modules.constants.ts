export interface ICAREApp {
  id?: string;
  icon?: string;
  image?: string;
  name: string;
  path?: string;
  modules?: Array<{ path: string; hidePatientSearch?: boolean }>;
  hidden?: boolean;
  considerLocationRoute?: boolean;
  order?: number;
}

export const ICARE_APPS: ICAREApp[] = [
  {
    name: "Home",
    modules: [{ path: "/", hidePatientSearch: true }],
    hidden: true,
    order: 0,
  },
  {
    name: "Registration",
    id: "registration",
    icon: "person_add",
    image: "assets/material/register.png",
    path: "/registration",
    order: 1,
    modules: [
      {
        path: "/registration/home",
        hidePatientSearch: true,
      },
      { path: "/registration/add", hidePatientSearch: true },
    ],
  },
  {
    name: "Clinic",
    id: "clinic",
    image: "assets/material/clinic.png",
    icon: "pregnant_woman",
    path: "/clinic",
    order: 3,
  },
  {
    name: "Nursing",
    id: "nursing",
    icon: "pregnant_woman",
    image: "assets/material/triage.png",
    path: "/nursing",
    order: 2,
  },
  {
    name: "Diagnostic",
    id: "diagnostic",
    image: "assets/material/stethoscope.png",
    icon: "pregnant_woman",
    path: "/diagnostic",
    order: 20,
  },
  {
    name: "Counselor",
    id: "counselor",
    image: "assets/material/counselor.png",
    icon: "pregnant_woman",
    path: "/counselor",
    order: 20,
  },
  {
    name: "Therapy Clinic",
    id: "therapy_clinic",
    image: "assets/material/therapy.png",
    icon: "pregnant_woman",
    path: "/clinic",
    order: 20,
  },
  {
    name: "Programs",
    id: "vertical_programs",
    image: "assets/material/programs.png",
    icon: "pregnant_woman",
    path: "/vertical-programs",
    order: 20,
  },
  {
    name: "Radiology",
    id: "radiology",
    image: "assets/material/radiology.png",
    icon: "",
    path: "/radiology",
    order: 17,
  },
  {
    name: "VCT",
    id: "vct",
    image: "assets/material/vct.png",
    icon: "pregnant_woman",
    path: "/nursing",
    order: 20,
  },
  {
    name: "Theatre",
    id: "theatre",
    image: "assets/material/theater.png",
    icon: "pregnant_woman",
    path: "/theatre",
    order: 20,
  },
  {
    name: "Motuary",
    id: "mortuary",
    image: "assets/material/stethoscope.png",
    icon: "pregnant_woman",
    path: "/mortuary",
    order: 21,
  },
  {
    name: "Dispensing",
    id: "dispensing",
    image: "assets/material/dispensing.png",
    icon: "store",
    path: "./dispensing",
    order: 7,
  },
  {
    name: "Store",
    id: "store",
    image: "assets/material/store.png",
    icon: "store",
    path: "./store",
    order: 12,
  },
  {
    name: "IPD/Observation",
    id: "inpatient",
    image: "assets/material/inpatient.png",
    icon: "bed",
    path: "/inpatient",
    order: 4,
    considerLocationRoute: true,
  },
  {
    name: "Laboratory",
    id: "laboratory",
    image: "assets/material/laboratory.png",
    icon: "local_hospital",
    path: "/laboratory",
    order: 6,
  },
  {
    name: "Cashier",
    id: "billing",
    image: "assets/material/cashier.png",
    icon: "credit_card",
    path: "/billing",
    order: 5,
  },
  {
    name: "E-claim",
    id: "e-claim",
    image: "assets/material/cashier.png",
    icon: "credit_card",
    path: "/e-claim",
    order: 9,
  },
  {
    name: "Social Welfare",
    id: "billing_exemption",
    image: "assets/material/welfare.png",
    icon: "credit_card",
    path: "/billing/exemption",
    order: 8,
  },
  {
    name: "Reports",
    id: "reports",
    image: "assets/material/report.png",
    icon: "bar_chart",
    path: "/interactive-reports",
    order: 10,
  },
  {
    name: "Settings",
    id: "maintenance",
    icon: "settings",
    image: "assets/material/settings.png",
    path: "/maintenance",
    order: 11,
    modules: [
      {
        path: "/maintenance/price-list",
        hidePatientSearch: true,
      },
    ],
  },
  {
    name: "DHIS2",
    id: "dhis2",
    image: "assets/material/report.png",
    icon: "",
    path: "/dhis2",
    order: 20,
  },
];
