const {
  Before,
  After,
  Given,
  Then
} = require("cypress-cucumber-preprocessor/steps");
/**
 * Scenario: Triage for not paid patient
 */
 Before(() => {
  cy.loadfixtures();
  cy.login("admin", "Admin123");
  cy.selectRoom("Nurse Room");
  cy.intercept('GET', '/openmrs/ws/rest/v1/patient?identifier=Cash&v=full', { fixture: 'patients/patients.json' });
});
Given("a registered client", () => {
  cy.intercept('GET', '/openmrs/ws/rest/v1/visit', { fixture: 'consultation/visits-current.json' });
  cy.intercept('GET', '/openmrs/ws/rest/v1/billing/payment?patient=2aee1cbe-a39a-4a54-8eb8-496e66826e96', { fixture: 'empty-array.json' });
  cy.intercept('GET', '/openmrs/ws/rest/v1/billing/invoice?patient=2aee1cbe-a39a-4a54-8eb8-496e66826e96', { fixture: 'visits/invoice-onregistration.json' });
  cy.reload();
  cy.selectModule("Nursing");
});
And("client has a pending bill", () => {
  cy.contains("Cash User").click();
});
When("I get the client details", () => {
  cy.contains("Cash");
  cy.contains("User");
});

Then("receive an alert on the pending payment", () => {
  
});

/**
 * Scenario: Triage for unstable patient
 */
 Given("a registered paid client", () => {
  cy.intercept('GET', '/openmrs/ws/rest/v1/billing/invoice?patient=2aee1cbe-a39a-4a54-8eb8-496e66826e96', { fixture: 'empty-array.json' });
  cy.intercept('GET', '/openmrs/ws/rest/v1/billing/payment?patient=2aee1cbe-a39a-4a54-8eb8-496e66826e96', { fixture: 'consultation/payment-made.json' });
  cy.intercept('GET', '/openmrs/ws/rest/v1/visit?includeInactive=false&patient=2aee1cbe-a39a-4a54-8eb8-496e66826e96', { fixture: 'consultation/visits-patient.json' });
  cy.intercept('GET', '/openmrs/ws/rest/v1/visit', { fixture: 'consultation/visits-current.json' });
  cy.intercept('GET', '/openmrs/ws/rest/v1/encounter', { fixture: 'consultation/encounter-nursing.json' });
  cy.loadformfixtures();
  cy.reload();
  cy.selectModule("Nursing");
});
And("client has no pending bill", () => {
  cy.contains("Cash User").click();
});
When("vital signs suggests an emergency condition", () => {
  cy.get('app-capture-form-data input[type="number"]').eq(0).type('50');
  cy.get('app-capture-form-data input[type="number"]').eq(1).type('160');
  cy.get('app-capture-form-data input[type="number"]').eq(2).type('38');
  cy.get('app-capture-form-data input[type="number"]').eq(3).type('140');
  cy.contains("Abnormal");
  cy.get('app-capture-form-data input[type="number"]').eq(4).type('80');
  cy.get("mat-select").click();
  cy.contains("Sitting").click();
});



Then("send client to clinician on unstable basis", () => {
  cy.intercept('POST', '/openmrs/ws/rest/v1/obs', { fixture: 'consultation/obs-results.json' });
  cy.contains("Save").click();
});
