/**
 * Scenario: Register a new client
 *
 */
let loggedIn;
function login(room) {
  if (!loggedIn) {
    cy.login("clerk", "Icare123");
    //loggedIn = true;
  } else {

    cy.login("clerk", "Icare123");
    loggedIn = true;
    cy.visit("/#/");
  }
  cy.selectRoom(room);
  cy.selectModule("Registration");
}

Given("I have a new client at the {string}", room => {
  cy.loadfixtures();
  login(room);
});
let client;
When("I supply client the following client information", datatable => {
  cy.contains("Register New Patient").click();
  datatable.hashes().forEach(element => {
    client = element;
    cy.get('input[name="fname"]').type(element.firstname);
    cy.get('input[name="lname"]').type(element.lastname);
    cy.get("#sex").click();
    cy.get("mat-option")
      .contains(element.sex)
      .click();

    // cy.get('input[name="dob"]').click();
    // cy.get('button[aria-label="Open calendar"]').click();
    // cy.get(".mat-calendar-content")
    //   .contains("7/1/1995")
    //   .click();
      
    cy.get('input[name="age"]').type(element.age);

    cy.get('input[name="phone"]').type(element.phone);

    cy.get("#showMoreDetailsToggle").click();
    cy.get('input[name="village"]').type(element.village);
    cy.get('input[name="council"]').type(element.council);
  });
});

And("request for client regitration", () => {
  cy.intercept('GET', '/openmrs/ws/rest/v1/billing/payment?patient=2aee1cbe-a39a-4a54-8eb8-496e66826e96', { fixture: 'empty-array.json' });
  cy.intercept('GET', '/openmrs/ws/rest/v1/billing/invoice?patient=2aee1cbe-a39a-4a54-8eb8-496e66826e96', { fixture: 'empty-array.json' });
  cy.intercept('GET', '/openmrs/ws/rest/v1/visit?includeInactive=false&patient=2aee1cbe-a39a-4a54-8eb8-496e66826e96&v=custom%3A(uuid%2CvisitType%2Clocation%3A(uuid%2Cdisplay%2Ctags)%2CstartDatetime%2Cattributes%2CstopDatetime%2Cpatient%3A(uuid)%2Cencounters%3A(uuid%2Cform%2Clocation%2Cobs%2Corders%2Cdiagnoses%2CencounterDatetime%2CencounterType))', { fixture: 'empty-array.json' });
  cy.intercept('POST', '/openmrs/ws/rest/v1/patient', { fixture: 'patients/cash-patient.json' });
  cy.contains("Save").click();
});

Then("I should get confirmation of registration", () => {
  // TODO; Need to implement scenario fo confirmation of registration
  cy.contains("Patient Visit Form");
});
/**
 * Scenario: Register returning client
 */

Given("I have a returning client at the {string}", room => {
  cy.loadfixtures();
  login(room);
});
When("I search for client information", () => {
  //throw Error('Supplying client information not implemented')
  cy.intercept('GET', '/openmrs/ws/rest/v1/patient?identifier=Cash&v=full', { fixture: 'patients/patients.json' });
  cy.intercept('GET', '/openmrs/ws/rest/v1/billing/payment?patient=2aee1cbe-a39a-4a54-8eb8-496e66826e96', { fixture: 'empty-array.json' });
  cy.intercept('GET', '/openmrs/ws/rest/v1/billing/invoice?patient=2aee1cbe-a39a-4a54-8eb8-496e66826e96', { fixture: 'empty-array.json' });
  cy.intercept('GET', '/openmrs/ws/rest/v1/visit?includeInactive=false&patient=2aee1cbe-a39a-4a54-8eb8-496e66826e96&v=custom%3A(uuid%2CvisitType%2Clocation%3A(uuid%2Cdisplay%2Ctags)%2CstartDatetime%2Cattributes%2CstopDatetime%2Cpatient%3A(uuid)%2Cencounters%3A(uuid%2Cform%2Clocation%2Cobs%2Corders%2Cdiagnoses%2CencounterDatetime%2CencounterType))', { fixture: 'empty-array.json' });
  cy.searchPatient("Cash");
});

Then("I should get information about past client visits", () => {
  cy.contains("Cash").should("be.visible");
  cy.contains("User").should("be.visible");
  cy.contains("Male").should("be.visible"); 
});

And("I should be allowed to update visit information", () => {
  cy.contains("Patient Visit").should("be.visible");
});

/**
 * Scenario: Start client visit
 *
 */
Given("I have a registered client at the {string}", room => {
  cy.loadfixtures();
  cy.intercept('GET', '/openmrs/ws/rest/v1/patient?identifier=Cash&v=full', { fixture: 'patients/patients.json' });
  login(room);
  cy.intercept('GET', '/openmrs/ws/rest/v1/billing/payment?patient=2aee1cbe-a39a-4a54-8eb8-496e66826e96', { fixture: 'empty-array.json' });
  cy.intercept('GET', '/openmrs/ws/rest/v1/billing/invoice?patient=2aee1cbe-a39a-4a54-8eb8-496e66826e96', { fixture: 'empty-array.json' });
  cy.intercept('GET', '/openmrs/ws/rest/v1/visit?includeInactive=false&patient=2aee1cbe-a39a-4a54-8eb8-496e66826e96&v=custom%3A(uuid%2CvisitType%2Clocation%3A(uuid%2Cdisplay%2Ctags)%2CstartDatetime%2Cattributes%2CstopDatetime%2Cpatient%3A(uuid)%2Cencounters%3A(uuid%2Cform%2Clocation%2Cobs%2Corders%2Cdiagnoses%2CencounterDatetime%2CencounterType))', { fixture: 'empty-array.json' });
  cy.searchPatient("Cash");
  cy.contains("Cash").should("be.visible");
  cy.contains("User").should("be.visible");
  cy.contains("Male").should("be.visible");
});

When("I select OPD service", text => {
  cy.contains("OPD").click();
  cy.contains("General OPD").click();
});

And("allocate service room", text => {
  //TODO Need to understand why this call is needed here
  cy.intercept('GET', '/openmrs/ws/rest/v1/visit', { fixture: 'visits/previous-visits-on-registration.json' });
  cy.get('input[placeholder="Select Room"]').click();
  cy.contains("Room 1").click();
  
});
And("select payment method", () => {
  cy.contains(/^Cash$/).click();
});
And("select payment scheme", () => {
  cy.contains(/^Normal$/).click();
});
And("start a visit", text => {
  cy.intercept('POST', '/openmrs/ws/rest/v1/visit', { fixture: 'visits/visit-on-registration.json' });
  cy.intercept('GET', '/openmrs/ws/rest/v1/billing/invoice?patient=2aee1cbe-a39a-4a54-8eb8-496e66826e96', { fixture: 'visits/invoice-onregistration.json' });
  cy.intercept('GET', '/openmrs/ws/rest/v1/visit?includeInactive=false&patient=2aee1cbe-a39a-4a54-8eb8-496e66826e96&v=custom%3A(uuid%2CvisitType%2Clocation%3A(uuid%2Cdisplay%2Ctags)%2CstartDatetime%2Cattributes%2CstopDatetime%2Cpatient%3A(uuid)%2Cencounters%3A(uuid%2Cform%2Clocation%2Cobs%2Corders%2Cdiagnoses%2CencounterDatetime%2CencounterType))', { fixture: 'visits/visits-after-registration.json' });
  cy.contains("Start Visit").click();
});
Then("client visit should be created", () => {
  //cy.get("#btn-start-visit").click();
});
And("client should be allocated to a service room", () => {});
And("bill should be generated", () => {});

/**
 * Scenario: Start insured client visit
 *
 */
 Given("I have a registered insured client at the {string}", room => {
  cy.loadfixtures();
  cy.intercept('GET', '/openmrs/ws/rest/v1/patient?identifier=Insured&v=full', { fixture: 'patients/patients.json' });
  login(room);
  cy.intercept('GET', '/openmrs/ws/rest/v1/billing/payment?patient=3aee1cbe-a39a-4a54-8eb8-496e66826e96', { fixture: 'empty-array.json' });
  cy.intercept('GET', '/openmrs/ws/rest/v1/billing/invoice?patient=3aee1cbe-a39a-4a54-8eb8-496e66826e96', { fixture: 'empty-array.json' });
  cy.intercept('GET', '/openmrs/ws/rest/v1/visit?includeInactive=false&patient=3aee1cbe-a39a-4a54-8eb8-496e66826e96&v=custom%3A(uuid%2CvisitType%2Clocation%3A(uuid%2Cdisplay%2Ctags)%2CstartDatetime%2Cattributes%2CstopDatetime%2Cpatient%3A(uuid)%2Cencounters%3A(uuid%2Cform%2Clocation%2Cobs%2Corders%2Cdiagnoses%2CencounterDatetime%2CencounterType))', { fixture: 'empty-array.json' });
  cy.searchPatient("Insured");
  cy.contains("Insured").should("be.visible");
  cy.contains("User").should("be.visible");
  cy.contains("Male").should("be.visible");
});
When("I send the client to the doctor", text => {
  cy.contains("OPD").click();
  cy.contains("General OPD").click();
  cy.intercept('GET', '/openmrs/ws/rest/v1/visit', { fixture: 'visits/previous-visits-on-registration.json' });
  cy.get('input[placeholder="Select Room"]').click();
  cy.contains("Clinical doctor").click();
  
});

And("select NHIF insurance", text => {
  cy.contains("Insurance").click();
  cy.contains("NHIF").click();
});
And("set the insurance number {string}", number => {
  cy.get('input[placeholder="Enter Text"]').type(number);
});

/**
 * Scenario: Update client visit
 *
 */
 Given("I want to update client visit in {string}", room => {
  cy.loadfixtures();
  cy.intercept('GET', '/openmrs/ws/rest/v1/patient?identifier=Cash&v=full', { fixture: 'patients/patients.json' });
  login(room);
});

When("I search for the client", text => {
  cy.intercept('GET', '/openmrs/ws/rest/v1/billing/payment?patient=2aee1cbe-a39a-4a54-8eb8-496e66826e96', { fixture: 'empty-array.json' });
  cy.intercept('GET', '/openmrs/ws/rest/v1/billing/invoice?patient=2aee1cbe-a39a-4a54-8eb8-496e66826e96', { fixture: 'visits/invoice-onregistration.json' });
  cy.intercept('GET', '/openmrs/ws/rest/v1/visit?includeInactive=false&patient=2aee1cbe-a39a-4a54-8eb8-496e66826e96&v=custom%3A(uuid%2CvisitType%2Clocation%3A(uuid%2Cdisplay%2Ctags)%2CstartDatetime%2Cattributes%2CstopDatetime%2Cpatient%3A(uuid)%2Cencounters%3A(uuid%2Cform%2Clocation%2Cobs%2Corders%2Cdiagnoses%2CencounterDatetime%2CencounterType))', { fixture: 'visits/visits-after-registration.json' });
  cy.searchPatient("Cash");
  cy.contains("Cash").should("be.visible");
  cy.contains("User").should("be.visible");
  cy.contains("Male").should("be.visible");
});

And("allocate another service room", text => {
  //TODO Need to understand why this call is needed here
  cy.intercept('GET', '/openmrs/ws/rest/v1/visit', { fixture: 'visits/previous-visits-on-registration.json' });
  cy.contains("Edit Visit").click();
  cy.get('input[placeholder="Select Room"]').click();
  cy.contains("Doctor 100").click();
});
And("update the visit", text => {
  cy.intercept('POST', '/openmrs/ws/rest/v1/visit/c466d5ac-7fdf-4099-8fdc-d7da665722c2', { fixture: 'visits/new-visit-on-registration.json' });
  cy.contains("Update Visit").click();
});
And("client visit should be update", text => {
  cy.contains("Register New Patient");
});

