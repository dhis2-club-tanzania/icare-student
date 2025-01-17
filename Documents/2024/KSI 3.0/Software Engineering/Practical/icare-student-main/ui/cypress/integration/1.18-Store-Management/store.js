/**
 * Scenario: Viewing stock status
 */
Then("I am in the store", (content) => {
  cy.login("admin", "Admin123");
  cy.selectRoom("Laboratory");
});
When("I navigate to store", (content) => {
  cy.selectModule("Store");
});
Then("I should view the following summary", (datatable) => {
  datatable.raw().forEach((row) => {
    row.forEach((app) => {
        console.log('App:', app);
      cy.contains(app).should("be.visible");
    });
  });
});
