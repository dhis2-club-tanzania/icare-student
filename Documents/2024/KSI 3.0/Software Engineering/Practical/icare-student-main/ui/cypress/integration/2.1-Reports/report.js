/**
 * Scenario: Viewing OPD Summary Report
 */
Then("I have a OPD report to produce", (content) => {
    cy.login("admin", "Admin123");
    cy.selectRoom("Registration Desk");
    
  });
  When("I navigate to reports", (content) => {
    cy.contains("Reports").click();
  });
  And("select the OPD Report", (content) => {
    cy.contains("Data").click();
    cy.get('mat-select').click();
    cy.contains("OPD").click();
  });
  