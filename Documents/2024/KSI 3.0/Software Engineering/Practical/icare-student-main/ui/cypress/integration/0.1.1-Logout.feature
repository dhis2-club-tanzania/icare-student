Feature: Login

  I want to logout  the system
 #@focus
  Scenario: Logout
    Given I am logged in as
      | username | password |
      | admin    | Admin123 |
    When I logout of ICare
    Then I see the "Login" button

