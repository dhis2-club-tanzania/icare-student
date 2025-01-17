Feature: Consultation
    As a clinician, I want to provide consultation services to the client and decide on a course of action for assessment and improvement of the client's health.

    #@focus
    Scenario: Triage for not paid patient
        Given a registered client
        And client has a pending bill
        When I get the client details
        Then receive an alert on the pending payment
    
    #@focus
    Scenario: Triage for unstable patient
        Given a registered paid client
        And client has no pending bill
        When vital signs suggests an emergency condition
        Then send client to clinician on unstable basis

    @focus
    Scenario: Doctor consulting a new patient
        Given I am a doctor in the room
        And a paid patient is in for consultation
        And client has no pending bill
        When vital signs suggests an emergency condition
        Then send client to clinician on unstable basis

    #@focus
    Scenario: Triage for stable patient
        Given a registered client
        And client has no pending bill
        When vital signs suggests no emergency condition
        Then add client to service queue
    #@focus
    Scenario: Service for unstable client requiring no investigation
        Given a client with unstable condition
        When client history is taken
        And client history suggests no further investigation
        Then record the required client treatment
    #@focus
    Scenario: Service for unstable client requiring investigation
        Given a client with unstable condition
        When client history is taken
        And client history suggests further investigation
        Then order the required investigation
    #@focus
    Scenario: Service for stable client requiring no investigation
        Given a client with stable condition
        When client history is taken
        And client history suggests no further investigation
        Then record the required client treatment
    #@focus
    Scenario: Service for stable client requiring investigation
        Given a client with stable condition
        When client history is taken
        And client history suggests further investigation
        Then order the required investigation
    #focus
    Scenario: Decision for clear lab results
        Given lab results for the client
        When the results suggets no further investigation
        Then record the required client treatment

    #@focus
    Scenario: Decision for lab results suggesting further investigation
        Given lab results for the client
        When the results suggets further investigation
        Then order the required investigation

    #@focus
    Scenario: Filling in Diagnoses
        Given I am a doctor in the room
        And a paid patient is in for consultation
        And client has no pending bill
        And i am in consultation form
        And i click Diagnosis
        When i fill in the following information
         |  diagnosis                  | diagnosis-non-coded | certainty     |rank        |condition         |
         |  (b54) unspecified malaria  |  malaria            | PROVISIONAL   |Primary     | Severe           |
        And  I click on Save button
        Then  "Successfully Saved Diagnoses " should be shown

    #@focus
    Scenario: Update in Diagnoses
        Given I am a doctor in the room
        And a paid patient is in for consultation
        And client has no pending bill
        And i am in consultation form
        And i click Diagnosis
        When i fill in the following information
         |  diagnosis                              | diagnosis-non-coded | certainty     |rank        |condition         |
         |  B53.1 Malaria due to simian plasmodia  |  malaria            | CONFIRMED   |Primary     | Severe           |
        And  I click on Save button
        Then  "Successfully Saved Diagnoses " should be shown

   #@focus
    Scenario: Ordering labs for investigations
        Given I am a doctor in the room
        And i am in consultation form
        And i click investigation/procedures
        And i click clinical chemistry    
        When i select Calcium
        And  I click on Confirm button
        Then "Saved Successfully" should be shown

   #@focus
    Scenario: Prescribing medication
        Given I am a doctor in the room
        And i am in consultation form
        And i click Prescription   
        When i select 
         |  Drug name | Dose     | Dosing unit|Frequency   |Duration|Duration Units|Route|
         |  Asprin    | malaria  |Ampule(s)   |Twice daily |13      | Days         |Oral |
        And  I click on Add button
        Then "Prescription Saved Successfully" should be shown

