/**
 *  Scenario: ICare Logout
 *
 */
Given("I am logged in as", (datatable) => {
  /*let username;
  let password;
  datatable.hashes().forEach((element) => {
    username = element.username;
    password = element.password;
  });
  //cy.visit("/");
  cy.login(username, password);*/
  /*cy.intercept('GET', '/openmrs/ws/rest/v1/session', { fixture: 'admin-login.json' }).as('logInAdmin');
  datatable.hashes().forEach((element) => {
    cy.get('input[placeholder="Username"]').type(element.username);
    cy.get('input[type="password"]').type(element.password);
  });
  cy.get("[data-test='icare-login-button']").should("be.visible").click();*/
});

When("I logout of ICare", () => {
  cy.get('input[data-placeholder="Search location"]').type("Registration Desk");
  cy.contains("Registration Desk").click();
  cy.get("#btn-account").click({ force: true });
  cy.get("#menu-account").get("#btn-logout").click({ force: true });
});

Then("I see the {string} button", (valueSeen) => {
  cy.contains(valueSeen).should("be.visible");
});
