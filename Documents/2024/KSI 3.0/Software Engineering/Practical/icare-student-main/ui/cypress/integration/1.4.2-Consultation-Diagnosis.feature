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