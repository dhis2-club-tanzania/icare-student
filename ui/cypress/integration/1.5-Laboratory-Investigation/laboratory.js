/**
 * Scenario: As a hospital lab attendant,
    I want to perform tests for patients in the hospital
    and provide results that are approved
 */

Given("I have a patient", () => {
  cy.login("admin", "Admin123");
  cy.selectRoom("Laboratory");
  cy.selectModule("Laboratory");
});

When("I view the patient information", () => {
  cy.searchPatient("jesse lai");
});

Then("I should see the samples that the patient should provide", () => {
  cy.get(".samples-to-collect").contains("Sample / Specimen source");
  cy.wait(1200);
});

/**
 * Scenario: View patient test order
 */
Given("I have a patient to be tested", () => {
  cy.get(".samples-to-collect").contains("Sample / Specimen source");
  cy.wait(200);
});

When("I give a patient a phlebotomy", () => {
  cy.get(".samples-to-collect").contains("Sample / Specimen source");
});
And("Register the sample label", () => {
  cy.get(".generate-sample-id-btn").click({ multiple: true });
  cy.get(".priority-checkbox").click({ multiple: true });
  cy.wait(100);
});
Then("I should collect the patient sample", () => {
  cy.get(".collect-sample-btn").click({ multiple: true });
  cy.wait(100);
});

/**
 * Scenario: Sample rejection
 */

Given("I have a sample", () => {
  cy.contains("Sample acceptance").click();
});
When("I reject the sample", () => {
  cy.contains("Samples waiting acceptance").click();
  cy.get("tbody>tr")
    .eq(0)
    .contains("Reject")
    .click();
});
Then("Provide a reason for rejecting a sample", () => {
  cy.get("textarea")
    .type("The sample seems to have contamination")
    .trigger("change");
  cy.wait(100);
  cy.get(".save-rejection-btn").click();
  cy.contains("Rejected samples").click();
});

/**
 * Scenario: Allocation of sample tests
 */

Given("I have a sample", () => {
  cy.contains("Sample acceptance").click();
});
When("I accept the sample that it is ready for testing", () => {
  cy.contains("Samples waiting acceptance").click();
  cy.get(".sample-acceptance-trs")
    .first()
    .contains("Accept")
    .click();
  cy.contains("Accepted samples").click();
});
Then("I should allocate the sample to the appropriate technician", () => {
  cy.contains("Tests allocation, Worklist & Results").click();
  cy.contains("Tests allocation");
  cy.wait(1000);
  cy.get(".allocate-test-btn").click();
  cy.get("mat-select")
    .first()
    .click();
  cy.get("mat-option")
    .first()
    .click();

  cy.get(".save-technician-btn")
    .first()
    .click();
  cy.get(".close-dialog-btn").click();
});

/**
 * Scenario: Establish technician worklist
 */

Given("I have tests allocated to a technician", () => {
  cy.contains("Technician worklist").click();
});
When("I have a sample and a test to perform", () => {
  cy.get("mat-select")
    .first()
    .click();
  cy.get("mat-option")
    .first()
    .click();
});
Then("I should be able to set a container or kit and label it", () => {
  cy.get(".save-test-container")
    .first()
    .click();
  cy.get(".close-dialog-btn").click();
});
