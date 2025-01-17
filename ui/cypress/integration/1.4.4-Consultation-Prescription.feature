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