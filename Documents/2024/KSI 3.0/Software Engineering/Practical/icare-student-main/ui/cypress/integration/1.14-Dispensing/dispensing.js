let loggedIn;
function login() {
  if (!loggedIn) {
    cy.login("admin", "Admin123");
    loggedIn = true;
  } else {
    cy.visit("/#/");
  }
}
/**
 * Scenario: View patient drug orders from the doctor
 */
Given("I have a patient with a drug", () => {
  login();
  cy.selectRoom("Dispensing");
  cy.selectModule("Dispensing");
});

When("I view the patient information", () => {
  cy.get("tbody>tr")
    .eq(0)
    .contains("Stone")
    .click();
});


Then("I should see the drugs that have been ordered by the doctor", () => {
  cy.contains("Aspirin").should("be.visible");
});
And("view in summary the doctors diagnosis", () => {
  cy.contains("Diagnosis").should("be.visible");
});
And("the alergies that the patient might have", () => {
  cy.contains("Allergies").should("be.visible");
});

/**
 * Scenario: Calculate the amount of drugs to give the user
 */
Given("I have a drug orders of a given patient", () => {
  login();
  cy.selectRoom("Dispensing");
  cy.selectModule("Dispensing");
  cy.searchPatient("Visit");
});
When("I calculate the number of drugs to give the patient", () => {
  cy.get("#btn-drug-order-1").click();
});
Then("I should write the total quantity", () => {
  cy.get('input[name="quantity"]')
    .clear()
    .type(4);
  cy.get("#btn-update-drug-order").click();
});
And("the drug dossage for each drug", () => {});
And("see the total price of the drug orders", () => {});
And("direct the patient to the payment before dispensing", () => {});

/**
 *  Scenario: Dispense Drugs
 */
Given("that a patient has payed for a drug", () => {});
When("I dispense the drug", () => {});
Then("I should see the reduction of my stock the particular drug", () => {});

/**
 *  Scenario: View summary for nearly expiry and stockout
 */
Given("I am in the pharmacy", () => {});
When("I scan my store", () => {});
Then(
  "I should see items that are nearly expiry and nearly out of stock",
  () => {}
);
