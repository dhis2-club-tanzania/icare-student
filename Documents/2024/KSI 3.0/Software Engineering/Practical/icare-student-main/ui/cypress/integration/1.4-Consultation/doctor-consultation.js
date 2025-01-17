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
    cy.selectRoom("Clinical doctor");
    cy.intercept('GET', '/openmrs/ws/rest/v1/patient?identifier=Cash&v=full', { fixture: 'patients/patients.json' });
  });
  Given("I am a doctor in the room", () => {
    cy.intercept('GET', '/openmrs/ws/rest/v1/visit', { fixture: 'consultation/visits-current.json' });
    cy.intercept('GET', '/openmrs/ws/rest/v1/billing/payment?patient=2aee1cbe-a39a-4a54-8eb8-496e66826e96', { fixture: 'empty-array.json' });
    cy.intercept('GET', '/openmrs/ws/rest/v1/billing/invoice?patient=2aee1cbe-a39a-4a54-8eb8-496e66826e96', { fixture: 'visits/invoice-onregistration.json' });
    //cy.reload();
    cy.selectModule("Clinic");
    cy.intercept('GET','')
    
  });
  // And("a paid patient is in for consultation", () => {
  //   cy.contains("Cash User").click();
  // });
  // When("I get the client details", () => {
  //   cy.contains("Cash");
  //   cy.contains("User");
  // });
  
  // Then("receive an alert on the pending payment", () => {
    
  // });