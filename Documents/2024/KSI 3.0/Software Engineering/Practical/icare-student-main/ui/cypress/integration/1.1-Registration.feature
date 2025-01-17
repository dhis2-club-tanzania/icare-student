Feature: Registration

  I want to register a new patient

  @focus
  Scenario: Register a new client
    Given I have a new client at the "Registration Desk"
    When I supply client the following client information
      | firstname | lastname | sex  |age|phone      | village | council |
      | Oswald    | Moshi    | Male |26 |0643823412 | Moshi  | Council |
    And request for client regitration
    Then I should get confirmation of registration


  @focus
  Scenario: Register returning client
    Given I have a returning client at the "Registration Desk"
    When I search for client information
    Then I should get information about past client visits

  @focus
  Scenario: Start client visit
    Given I have a registered client at the "Registration Desk"
    When I select OPD service
    And allocate service room
    And select payment method
    And select payment scheme
    Then client visit should be created
    And client should be allocated to a service room
    And bill should be generated
  
  @focus
  Scenario: Start Insured client visit
    Given I have a registered insured client at the "Registration Desk"
    When I send the client to the doctor
    And select NHIF insurance
    And set the insurance number "2736482352"
    And start a visit
    Then client visit should be created
    And client should be allocated to a service room
    And bill should be generated

  @focus
  Scenario: Update client visit
    Given I want to update client visit in "Registration Desk"
    When I search for the client
    And allocate another service room
    And update the visit
    Then client visit should be update
