// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add("login", (username, password) => {
  cy.visit("/#/login");
  cy.get("#username").type(username);
  cy.get("#password").type(password);
  cy.get("[data-test='icare-login-button']").should("be.visible").click();
  cy.get("#modal-location-selector")
    .contains("Select Location")
    .should("be.visible");
});
Cypress.Commands.add("selectRoom", (room) => {
  cy.get('input[data-placeholder="Search location"]').type(room);
  cy.contains(room).click();
});

Cypress.Commands.add("selectModule", (module) => {
  cy.get("#icare-modules").contains(module).should("be.visible").click();
});

Cypress.Commands.add("searchPatient", (patientName) => {
  cy.get("#registration-search-patient").click()
  cy.get("#input-search-patient").type(patientName);
  cy.get("#patient-search-list").contains(patientName).click();
});

Cypress.Commands.add("selectPatient", (patientName)=>{
  cy.get().click()
});

Cypress.Commands.add("loadfixtures", () => {
  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/concept/00000100IIIIIIIIIIIIIIIIIIIIIIIIIIII",
    { fixture: "cash-concept.json" }
  ).as("getCashConcept");
  cy.intercept("GET", "/openmrs/ws/rest/v1/location?v=full", {
    fixture: "location-full.json",
  }).as("getLocationFull");
  cy.intercept("GET", "/openmrs/ws/rest/v1/encountertype", {
    fixture: "encountertypes.json",
  }).as("getEncounterTypes");
  cy.intercept("GET", "/openmrs/ws/rest/v1/icare/item", {
    fixture: "items.json",
  }).as("getItems");
  cy.intercept("GET", "/openmrs/ws/rest/v1/icare/itemprice", {
    fixture: "item-price.json",
  }).as("getItemPrice");
  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/user/84ee6acb-1e75-11eb-8bc7-0242c0a85003",
    { fixture: "admin-user.json" }
  ).as("getAdminUser");
  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/provider?user=84ee6acb-1e75-11eb-8bc7-0242c0a85003",
    { fixture: "admin-provider.json" }
  ).as("getAdminProvider");
  cy.intercept("GET", "/openmrs/ws/rest/v1/session", {
    fixture: "admin-login.json",
  }).as("logInAdmin");
  cy.intercept("GET", "/openmrs/ws/rest/v1/drug", { fixture: "drugs.json" }).as(
    "getDrugs"
  );

  cy.intercept("GET", "/openmrs/ws/rest/v1/patientidentifiertype?v=full", {
    fixture: "patientidentifiertypes.json",
  }).as("getpatientidentifiertypes");

  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/systemsetting?q=facility.code&v=full",
    { fixture: "settings-facility-code.json" }
  );
  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/systemsetting?q=patient.autoFilledPatientIdentifierType&v=full",
    { fixture: "settings-auto-filled-patient-identifier.json" }
  );

  cy.intercept("GET", "/openmrs/ws/rest/v1/personattributetype?v=full", {
    fixture: "personattributetypes.json",
  });
  cy.intercept("GET", "/openmrs/ws/rest/v1/visittype", {
    fixture: "visittypes.json",
  });

  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/concept/00000003333IIIIIIIIIIIIIIIIIIIIIIIII?v=custom:(uuid,display,setMembers:(uuid,display,answers:(uuid,display),setMembers:(uuid,display)))",
    { fixture: "concepts/services.json" }
  );
  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/concept/00000004444IIIIIIIIIIIIIIIIIIIIIIIII?v=custom:(uuid,display,setMembers:(uuid,display,answers:(uuid,display),setMembers:(uuid,display)))",
    { fixture: "concepts/payment-categories.json" }
  );
  cy.intercept("GET", "/openmrs/ws/rest/v1/concept", {
    fixture: "concepts.json",
  }).as("getConcepts");

  //Patient Info

  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/patient/2aee1cbe-a39a-4a54-8eb8-496e66826e96?v=full",
    { fixture: "patients/cash-patient.json" }
  );
});

Cypress.Commands.add("loadformfixtures", () => {
  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/form/a000cb34-9ec1-4344-a1c8-f692232f6edd",
    { fixture: "forms/vitals.json" }
  );
  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/form/8d8c6092-cbcc-4cb7-9250-fae61c8952d5",
    { fixture: "forms/pre-operative-list.json" }
  );
  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/form/329e765a-e238-4bf2-95ea-f29ed8794bf4",
    { fixture: "forms/post-operative-list.json" }
  );
  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/form/d5a59a6c-87f7-4edf-a74a-5902adcce67f",
    { fixture: "forms/discharge-details.json" }
  );
  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/form/d4441d5e-1bbf-46c2-af35-f9cd8737e2e8",
    { fixture: "forms/surgeon.json" }
  );
  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/form/f9a1949f-d5f0-44eb-89db-82d15b617f97",
    { fixture: "forms/post-operative-orders.json" }
  );
  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/form/73964b4d-67ed-40df-ac50-e9eaecbbd424",
    { fixture: "forms/exemption-categories.json" }
  );
  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/form/23251ebf-a82f-4f8b-9506-faee0b31770d",
    { fixture: "forms/vct-pitc.json" }
  );
  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/form/2b0eff7f-26c5-4580-9ca5-a9ba587a7ef2",
    { fixture: "forms/regista-ya-huduma-ya-upimaji-na-ushauri-nasaha.json" }
  );
  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/form/6565b3d3-06ad-479d-be28-0f8df4f23926",
    {
      fixture:
        "forms/matumizi-ya-vitendanishi-na-uhakiki-ubora-wa-upimaji-vvu.json",
    }
  );
  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/form/0b9285a5-d291-43ea-a2aa-d69ff5e6426c",
    { fixture: "forms/ctc-kinga-tiba-baada-ya-madhara.json" }
  );
  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/form/bb939a62-4e51-40a4-a75e-e1f36084a2da",
    { fixture: "forms/muuguzi.json" }
  );
  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/form/638fbe1d-0bbd-435a-8587-d24ad6bfde86",
    { fixture: "forms/follow-up.json" }
  );
  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/form/adacaa81-d424-4825-bb84-3bf15fdb23dc",
    { fixture: "forms/follow-up-itega.json" }
  );
  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/form/6e8d607e-4fd1-4922-afb5-a1ab22df38d8",
    { fixture: "forms/health-social-worker-counselor.json" }
  );
  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/form/589ec4cb-5972-4659-9b32-81439ec08a35",
    {
      fixture:
        "forms/discussion-topics-for-continues-health-eduaction-ctc-client.json",
    }
  );
  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/form/2e2745cf-8bc3-48ba-8bb3-fb62d45610ff",
    { fixture: "forms/hiv-status-of-family-household-members.json" }
  );
  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/form/afe848ee-35bc-4a93-97c6-e764931e44ba",
    { fixture: "forms/occupational-therapy-assessment.json" }
  );
});
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
