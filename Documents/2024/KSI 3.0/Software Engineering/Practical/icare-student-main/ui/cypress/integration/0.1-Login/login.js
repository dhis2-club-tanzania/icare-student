/**
 *  Scenario: ICare Unauthorize Login
 *
 */
Given("I open the login page", () => {
  cy.visit("/#/login");
});

When("I type in", (datatable) => {
  datatable.hashes().forEach((element) => {
    cy.get("#username").type(element.username);
    cy.get("#password").type(element.password);
  });
});

And("I click on Login button", () => {
  cy.get("[data-test='icare-login-button']").should("be.visible").click();
});

And("I select a room {string}", (content) => {
  cy.get("#modal-location-selector").contains(content).should("be.visible");
  cy.contains(content).click();
});

// And("I logout of ICare", () => {
//   cy.get("#btn-account").click({ force: true });
//   cy.get("#menu-account").get("#btn-logout").click({ force: true });
// });

And("I type in the wrong credentials", (datatable) => {
  cy.intercept("GET", "/openmrs/ws/rest/v1/session", {
    sessionId: "2E5739E8F09E7B6D3D6173517B4DF897",
    authenticated: false,
  });
  datatable.hashes().forEach((element) => {
    cy.get("#username").type(element.username);
    cy.get("#password").type(element.password);
  });
});

And("I click on Login button", () => {
  cy.get("[data-test='icare-login-button']").should("be.visible").click();
});

Then("A message with {string} should be shown", (content) => {
  cy.contains(content).should("be.visible");
});
/**
 *  Scenario: ICare Login
 *
 */
When("I type in", (datatable) => {
  cy.intercept("GET", "/openmrs/ws/rest/v1/session", {
    fixture: "admin-login.json",
  }).as("logInAdmin");
  datatable.hashes().forEach((element) => {
    cy.get("#username").type(element.username);
    cy.get("#username").type(element.password);
  });
});

And("I click on Login button", () => {
  cy.get("[data-test='icare-login-button']").should("be.visible").click();
});

Then("{string} should be shown", (content) => {
  //cy.get("div#modal-location-selector").contains(content).should("be.visible");
});
When("I select a room {string}", (content) => {
  cy.get('input[placeholder="Search location"]').type(content);
  cy.contains(content).click();
});
Then("I should see the apps", (datatable) => {
  datatable.raw().forEach((row) => {
    row.forEach((app) => {
      cy.get("#page-home").contains(app).should("be.visible");
    });
  });
});
