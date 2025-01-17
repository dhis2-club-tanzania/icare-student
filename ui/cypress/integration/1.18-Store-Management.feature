Feature: Store
    As a hospital staff,
    I want to manage stock
    @focus
    Scenario: Viewing stock summary status
        Given I am in the store
        When I navigate to store
        Then I should view the following summary
            | Requested | Nearly Expired | Expired | Nearly Stocked Out | Stocked Out |

    @focus
    Scenario: Viewing stock status of an item
        Given i am in the store
        When when I navigate to store 
        And search an item
        Then I should view a list of available batches
        And the expiry dates
        And the quantity in stock

    @focus
    Scenario: Requesting items from another store
        Given i am in the store
        When When I select a store
        And pick items that I need in my store
        And request the items
        Then I should receive confirmation that the request is sent
    @focus
    Scenario: Issue items to another store
        Given i am in the store
        When When I see a request from another store
        And specify the quantity of each item that I want to issue to the store
        And issue the items
        Then I should receive confirmation that the issued items is sent
    @focus
    Scenario: Keep a ledger of the ins and outs of items
        Given i am in the store
        When I want to register a ledger
        And specify the item, batch, expiry date and quantity of each item
        And register the ledger entry
        Then I should receive confirmation that the ledger is registered
    @focus
    Scenario: View Transactions done
        Given i want to view transactions
        When When I navigate to view transactions
        Then I should see the transactions that have been made
