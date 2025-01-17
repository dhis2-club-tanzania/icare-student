Feature: Dispensing
    As a hospital pharmacists,
    I want to provide medication to patients in the hospital
    #@focus
    Scenario: View patient drug orders from the doctor
        Given I have a patient with a drug
        When I view the patient information
        Then I should see the drugs that have been ordered by the doctor
        And view in summary the doctors diagnosis
        And the alergies that the patient might have
    
    #@focus
    Scenario: Calculate the amount of drugs to give the user
        Given I have a drug orders of a given patient
        When I calculate the number of drugs to give the patient
        Then I should write the total quantity
        And the drug dossage for each drug
        And see the total price of the drug orders
        And direct the patient to the payment before dispensing
    
    #@focus
    Scenario: Dispense Drugs
        Given that a patient has payed for a drug
        When I dispense the drug
        Then I should see the reduction of my stock the particular drug
    
    #@focus
    Scenario: View summary for nearly expiry and stockout
        Given I am in the pharmacy
        When I scan my store
        Then I should see items that are nearly expiry and nearly out of stock

    #@focus
    Scenario: Direct patient to another dispensing point with item availability
        Given I want to dispense a drug to a patient
        When I search for the drug
        And Drug the drug is out of stock
        Then I should get a suggestion of the store where it could be found
