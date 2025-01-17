Feature: Laboratory
    As a hospital lab attendant,
    I want to perform tests for patients in the hospital 
    and provide results that are approved
    
    @focus
    Scenario: View patient test order
        Given I have a patient
        When I view the patient information
        Then I should see the samples that the patient should provide
    
    @focus
    Scenario: Collecting patient sample
        Given I have a patient to be tested
        When I give a patient a phlebotomy
        And Register the sample label
        Then I should collect the patient sample

    @focus
    Scenario: Sample rejection
        Given I have a sample
        When I reject the sample
        Then Provide a reason for rejecting a sample
    
    @focus
    Scenario: Allocation of sample tests
        Given I have a sample
        When I accept the sample that it is ready for testing
        Then I should allocate the sample to the appropriate technician

    @focus
    Scenario: Establish technician worklist
    Given I have tests allocated to a technician
    When I have a sample and a test to perform
    Then I should be able to set a container or kit and label it
    
    @focus
    Scenario: Provide test results
        Given I have the results for a test
        When I provide the result of the test
        And the result is approved by 2 different people
        Then I should inform the doctor of the results
    
    #@focus
    Scenario: Store sample for future use
        Given I have a sample
        When I enter it into the storage unit
        Then I should be confident that it is safe for later use