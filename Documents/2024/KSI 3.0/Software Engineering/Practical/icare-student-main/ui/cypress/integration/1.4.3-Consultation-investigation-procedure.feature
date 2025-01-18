   #@focus
    Scenario: Ordering labs for investigations
        Given I am a doctor in the room
        And i am in consultation form
        And i click investigation/procedures
        And i click clinical chemistry    
        When i select Calcium
        And  I click on Confirm button
        Then "Saved Successfully" should be shown