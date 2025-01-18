
Feature: Billing
    As a hospital staff,
    I want to provide a mechanism for payment,
    or waiver of payment for services or items,
    including client payments and insurance
    @focus
    Scenario: Waiver for full exemption
        Given client with full exemption
        When documents in support of full exemption have been uploaded
        And I confirm acceptance of exemption
        Then show exemption confirmation

    @focus
    Scenario: Waiver for partial exemption
        Given client with partial exemption
        When documents in support of partial exemption have been uploaded
        And I fill exemption discount
        And I confirm acceptance of partial exemption
        Then show partial exemption confirmation

    @focus
    Scenario: Billing for uninsured client
        Given I have a registered client
        When I specify that the client is not insured
        Then generate bill

    @focus
    Scenario: Billing for insured client
        Given I have a registered insured client
        When I specify that the client is insured
        And client has valid insurance
        Then generate insurance claim invoice

    @focus
    Scenario: Payment for valid bill through GePG
        Given a valid client bill for GePG payment
        When I generate control number for the bill
        And the client makes payment that clears the bill
        Then print payment receipt

    @focus
    Scenario: Payment for valid bill by cash
        Given a valid client bill
        When I confirm acceptance of cash
        And the cash clears the bill
        Then print payment receipt

    @focus
    Scenario: Void bill payment
        Given a valid client with a request to skip payment of a bill
        When I void payment of a bill
        And I confirm voiding of a bill
        Then remove the bill for the patient
