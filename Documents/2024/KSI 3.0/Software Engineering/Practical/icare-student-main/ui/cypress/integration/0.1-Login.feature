Feature: Login

  I want to log into the system
  @focus
  Scenario: Unauthorize Login
    Given I open the login page

    When I type in the wrong credentials
      | username | password |
      | admin    | admin123 |
    And I click on Login button
    Then A message with "Wrong username or password" should be shown

  @focus
  Scenario: Authorize Login
    Given I open the login page
    When I type in
      | username | password |
      | admin    | Admin123 |
    And I click on Login button
    #Then "Select Location" should be shown


  #@focus
  Scenario: Logout
    Given I am logged in as
      | username | password |
      | admin    | Admin123 |
    When I logout of ICare
    Then I see the "Login" button

