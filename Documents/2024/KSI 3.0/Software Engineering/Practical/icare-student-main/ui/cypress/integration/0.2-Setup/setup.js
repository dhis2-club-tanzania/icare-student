import { kebabCase } from "lodash";
let loggedIn = false;
function login() {
  if (!loggedIn) {
    cy.login("admin", "Admin123");

    loggedIn = true;
  }
  cy.selectRoom("Registration Desk");
}

/**
 * Scenario: Add drug generic information
 */
Given("I have list of drugs", () => {
  cy.loadfixtures();
  cy.login("admin", "Admin123");
  cy.selectRoom("Billing");
  cy.contains("Maintenance").click();
  cy.contains("Price List").click();
});

When("I supply and save drugs list and price", datatable => {
  /*datatable.hashes().forEach(element => {
    cy.visit("/openmrs/admin/concepts/conceptDrug.form");
    cy.get('input[name="name"]').type(element.name);
    cy.get("#concept_selection").type(element.generic);
    cy.contains(element.generic)
      .last()
      .click();
    cy.contains("Save Concept Drug").click();

    cy.visit("/#/maintenance/price-list");
    cy.contains("Add Item").click();
    cy.get("#search-pricing-item-input").type(element.name);
    cy.get(".item-list")
      .contains(element.name)
      .first()
      .click();

    cy.get(`#edit-price-${kebabCase(element.name)}`).click();

    cy.get(`.item-price-input-${kebabCase(element.name)}`)
      .first()
      .clear()
      .type(element.price);

    cy.get(`#save-price-btn-${kebabCase(element.name)}`).click();
  });*/
  cy.intercept('GET', '/openmrs/ws/rest/v1/concept', { fixture: 'empty-results.json' }).as('getResults');
  cy.intercept('POST', '/openmrs/ws/rest/v1/icare/item', { fixture: 'empty-results.json' });
  datatable.hashes().forEach(element => {
    cy.contains("Add Item").click();
    cy.get('input[id="search-pricing-item-input"]').type(element.name);
    cy.get("span").contains(element.name).click();
  });
});

Then("show saved drug and updated prices", () => {});

/**
 * Add Registration fee information
 */
Given("I have registration pricing details", () => {
  cy.loadfixtures();
  cy.login("admin", "Admin123");
  cy.selectRoom("Registration Desk");
  cy.visit("/#/maintenance/price-list");
});
When("I supply and save registration pricing", datatable => {
  cy.intercept('POST', '/openmrs/ws/rest/v1/icare/item', { fixture: 'empty-results.json' });
  datatable.hashes().forEach(element => {
    cy.contains("Add Item").click();
    cy.get('input[id="search-pricing-item-input"]').type(element.name);
    cy.get("span").contains(element.name).click();
    //cy.get("button").contains("Save").click();

    cy.contains(element.name).should("be.visible");
    cy.contains(element.name).parent().find("mat-icon").contains("edit").click();
    cy.contains(element.name).parent().find("input").type(element.price);
    cy.contains(element.name).parent().find("mat-icon").contains("edit").click();
  });
});
Then("show saved registration prices", () => {

});

/**
 *   Add lab fee information
 */
Given("I have details for lab test tools components and pricing", () => {
  cy.loadfixtures();
  cy.login("admin", "Admin123");
  cy.selectRoom("Registration Desk");
  cy.visit("/#/maintenance/price-list");
});
When("I supply and save lab test tools information", (datatable) => {
  cy.intercept('POST', '/openmrs/ws/rest/v1/icare/item', { fixture: 'empty-results.json' });
  datatable.hashes().forEach(element => {
    cy.contains("Add Item").click();
    cy.get('input[id="search-pricing-item-input"]').type(element.name);
    cy.get("span").contains(element.name).click();
    //cy.get("button").contains("Save").click();

    cy.contains(element.name).should("be.visible");
    cy.contains(element.name).parent().find("mat-icon").contains("edit").click();
    cy.contains(element.name).parent().find("input").type(element.price);
    cy.contains(element.name).parent().find("mat-icon").contains("edit").click();
  });
});
And("I supply and save lab test tools pricing details", () => {});
Then("show saved lab prices", () => {});
