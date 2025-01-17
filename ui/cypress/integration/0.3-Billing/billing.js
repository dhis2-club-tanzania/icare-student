Given("I am logged in as Registration Clerk and i open patient registration form", () => {
    cy.visit("#/registration/add");
  });
  
  When("I check", (datatable) => {
    datatable.hashes().forEach((element) => {
      cy.get('[type="Checkbox"]').checkbox(element.checkbox)
      
    });
  });
  
  When("I click on Pay by Cash button", () => {
    cy.get("button").click("Pay by Cash").should("be.visible").click();
  });

  Then("{view} pop up", (content) => {
    cy.contains(content, { timeout: 10000 }).should("be.visible");
  });


  When("I click on Confirm button", () => {
    cy.get("button").click("Confirm").should("be.visible").click();
  });
 
  Then("{view} pop up", (content) => {
    cy.contains(content, { timeout: 10000 }).should("be.visible");
  });

  When("I click on Print Receipt button", () => {
    cy.get("button").click("Print Receipt").should("be.visible").click();
  });
