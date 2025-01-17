Feature: Price List configuration
    As a system administrator I want to be able to add price information for all billable services,
    sessions, drugs etc for different payment schemes accepted by the hospital

    @focus
    Scenario: Add new pricing item for price configuration
        Given I want to configure pricing details for new item
        When I enter details for new item
        And save details for new item
        Then show newly added item in pricing list

    @focus
    Scenario: Add pricing item for available item
        Given I want to configure pricing for available item
        When I search for existing item
        And select for pricing configuration
        Then show added item in pricing list

    @focus
    Scenario: Configure price for an item
        Given I have a pricing item
        When I supply pricing details to the item
        And I confirm pricing changes
        Then item in the list should display new pricing details

