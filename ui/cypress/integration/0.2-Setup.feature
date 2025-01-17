Feature: Setup Metadata


    @focus
    Scenario: Add actual drug information
        Given I have list of drugs
        When I supply and save drugs list and price
        | generic     | name          | paymentType | scheme | price |
        | Aspirin     | Aspirin 200mg | cash        | Normal | 3200  |
        Then show saved drug and updated prices

    @focus
    Scenario: Add Registration fee information
        Given I have registration pricing details
        When I supply and save registration pricing
        | name             | paymentType | scheme | price  |
        | Registration Fee | cash        | Normal | 10000  |
        #| General OPD      | cash        | Normal | 10000  |
        Then show saved registration prices

    #@focus
    Scenario: Add lab fee information
        Given I have details for lab test tools components and pricing
        When I supply and save lab test tools information
        | name             | paymentType | scheme | price  |
        | Urinalysis       | cash        | Normal | 3000   |
        And I supply and save lab pricing details
        | name             | paymentType | scheme | price  |
        | Urinalysis       | cash        | Normal | 3000   |
        Then show saved lab prices
