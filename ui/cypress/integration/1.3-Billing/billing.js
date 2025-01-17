const {
  Before,
  After,
  Given,
  Then,
} = require("cypress-cucumber-preprocessor/steps");
let loggedIn;
function login() {
  if (!loggedIn) {
    cy.login("admin", "Admin123");
    //loggedIn = true;
  } else {
    cy.visit("/#/");
  }
}
/**
 * Scenario: Waiver for full exemption
 */
Before(() => {
  cy.loadfixtures();
  cy.login("admin", "Admin123");
  cy.selectRoom("Billing");
  cy.intercept("GET", "/openmrs/ws/rest/v1/patient?identifier=Cash&v=full", {
    fixture: "patients/patients.json",
  });
  cy.intercept("GET", "/openmrs/ws/rest/v1/patient?identifier=Insured&v=full", {
    fixture: "patients/patients.json",
  });
  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/billing/payment?patient=2aee1cbe-a39a-4a54-8eb8-496e66826e96",
    { fixture: "empty-array.json" }
  );
  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/billing/invoice?patient=2aee1cbe-a39a-4a54-8eb8-496e66826e96",
    { fixture: "visits/invoice-onregistration.json" }
  );
  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/visit?includeInactive=false&patient=2aee1cbe-a39a-4a54-8eb8-496e66826e96&v=custom%3A(uuid%2CvisitType%2Clocation%3A(uuid%2Cdisplay%2Ctags)%2CstartDatetime%2Cattributes%2CstopDatetime%2Cpatient%3A(uuid)%2Cencounters%3A(uuid%2Cform%2Clocation%2Cobs%2Corders%2Cdiagnoses%2CencounterDatetime%2CencounterType))",
    { fixture: "visits/visits-after-registration.json" }
  );
  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/billing/payment?patient=3aee1cbe-a39a-4a54-8eb8-496e66826e96",
    { fixture: "empty-array.json" }
  );
  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/billing/invoice?patient=3aee1cbe-a39a-4a54-8eb8-496e66826e96",
    { fixture: "visits/invoice-onregistration.json" }
  );
  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/visit?includeInactive=false&patient=3aee1cbe-a39a-4a54-8eb8-496e66826e96&v=custom%3A(uuid%2CvisitType%2Clocation%3A(uuid%2Cdisplay%2Ctags)%2CstartDatetime%2Cattributes%2CstopDatetime%2Cpatient%3A(uuid)%2Cencounters%3A(uuid%2Cform%2Clocation%2Cobs%2Corders%2Cdiagnoses%2CencounterDatetime%2CencounterType))",
    { fixture: "visits/visits-after-registration.json" }
  );
});
Given("client with full exemption", () => {
  cy.selectModule("Social Welfare");
  cy.searchPatient("Cash");
});

When("documents in support of full exemption have been uploaded", () => {
  // TODO: implement test for uploading file
  cy.get("#select-exemption-type").click();
  cy.get("mat-option").contains("Full Exemption").click();
});

And("I confirm acceptance of exemption", () => {
  cy.contains("Confirm Exemption").click();
  cy.contains(
    "This is to confirm that you have exempted 10000 from the client"
  ).should("be.visible");
  cy.contains("Are you sure?").should("be.visible");
  cy.intercept("POST", "/openmrs/ws/rest/v1/billing/discount", {
    fixture: "billing/discount-full.json",
  });
  cy.get("#btn-exemption-confirmed").click();
});

Then("show exemption confirmation", () => {
  cy.get("#payable-summary").should("have.value", "0");
});

/**
 * Scenario: Waiver for partial exemption
 */
Given("client with partial exemption", () => {
  cy.selectModule("Social Welfare");
  cy.get('tbody>tr').eq(0).click();
});

When("documents in support of partial exemption have been uploaded", () => {
  // TODO: implement test for uploading file
  cy.get("#select-exemption-type").click();
  cy.get("mat-option").contains("Partial Exemption").click();
});

And("I fill exemption discount", () => {
  cy.get("#input-exemption-discount-0").type(10000);
});

And("I confirm acceptance of partial exemption", () => {
  cy.get("#btn-confirm-exemption").click();
  cy.get("#dialog-exemption-confirmation")
    .contains("This is to confirm that you have exempted 10000 from the client")
    .should("be.visible");
  cy.contains("Are you sure?").should("be.visible");
  cy.intercept("POST", "/openmrs/ws/rest/v1/billing/discount", {
    fixture: "billing/discount-full.json",
  });
  cy.get("#btn-exemption-confirmed").click();
});

Then("show partial exemption confirmation", () => {
  cy.get("#payable-summary").should("not.have.value", "0");
});

/**
 * Scenario: Billing for uninsured client
 */
Given("I have a registered client", () => {
  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/visit?includeInactive=false&v=custom%3A(uuid%2CvisitType%2CstartDatetime%2CstopDatetime%2Cencounters%3A(orders)%2Cattributes%3A(uuid%2Cdisplay)%2Clocation%3A(uuid%2Cdisplay%2Ctags)%2Cpatient%3A(uuid%2Cdisplay%2Cidentifiers%2Cperson%2Cvoided)",
    { fixture: "billing/patient-list.json" }
  );
  cy.intercept(
    "GET",
    "http://localhost:4200/openmrs/ws/rest/v1/visit?includeInactive=false&patient=367dd40a-417c-4517-aab0-cccfd8c8d81b&v=custom%3A(uuid%2CvisitType%2Clocation%3A(uuid%2Cdisplay%2Ctags)%2CstartDatetime%2Cattributes%2CstopDatetime%2Cpatient%3A(uuid%2Cdisplay%2Cidentifiers%2Cperson%2Cvoided)%2Cencounters%3A(uuid%2Cform%2Clocation%2Cobs%2Corders%2Cdiagnoses%2CencounterDatetime%2CencounterType))",
    { fixture: "billing/patient-list.json" }
  );

  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/billing/invoice?patient=367dd40a-417c-4517-aab0-cccfd8c8d81b",
    { fixture: "billing/patient-invoice.json" }
  );

  cy.intercept(
    "GET",
    "/openmrs/ws/rest/v1/billing/payment?patient=367dd40a-417c-4517-aab0-cccfd8c8d81b",
    { fixture: "billing/patient-payment.json" }
  );
  cy.selectModule("Cashier");
  cy.contains("Cash User").click();
});

When("I specify that the client is not insured", () => {
  // TODO This is basically visit flow, need to find best way to have common source codes for this test
  // cy.wait(5000);
});

Then("generate bill", () => {
  cy.contains("Payable: 30000");
});

/**
 * Scenario: Billing for insured client
 */
Given("I have a registered insured client", () => {
  cy.selectModule("Cashier");
  cy.searchPatient("Insured");
});
When("I specify that the client is insured", () => {});
And("client has valid insurance", () => {});
Then("generate insurance claim invoice", () => {});

/**
 * Scenario: Payment for valid bill through GePG
 */
Given("a valid client bill for GePG payment", () => {
  cy.selectModule("Cashier");
  cy.searchPatient("Cash");
});

When("I generate control number for the bill", () => {
  cy.intercept("POST", "/openmrs/ws/rest/v1/billing/payment", {
    fixture: "billing/payment-cash.json",
  });
  cy.get("mat-checkbox").first().click({ multiple: true });

  cy.contains("Pay by GePG").click();
  cy.contains("This is to confirm that client will be paying").should(
    "be.visible"
  );
  cy.get("#btn-get-control-number").click();
  cy.wait(1000);
  // cy.contains("Generate (GePG) Control Number").click();
  // cy.contains("Control Number").should("be.visible");
  // cy.contains("OK").click();
  // cy.contains("Refresh GePG Payment").should("be.visible");
});
And("the client makes payment that clears the bill", () => {
  cy.contains("Confirm").click();
});
Then("print payment receipt", () => {
  cy.contains("Print Receipt");
});

/**
 *  Scenario: Payment for valid bill by cash
 */

Given("a valid client bill", () => {
  cy.selectModule("Cashier");
  cy.searchPatient("Cash");
});

When("I confirm acceptance of cash", () => {
  cy.get(".checkbox-bill-confirm").click({ multiple: true });
  cy.get(".btn-confirm-payment").contains("Pay by Cash").click();
  cy.contains("This is to confirm that you have received").should("be.visible");
  cy.intercept("POST", "/openmrs/ws/rest/v1/billing/payment", {
    fixture: "billing/payment-cash.json",
  });
  cy.contains("Confirm").click();
});
And("the cash clears the bill", () => {
  cy.contains("Bill Payment Receipt").should("be.visible");
});
Then("print payment receipt", () => {
  cy.contains("Print Receipt").click();
});
