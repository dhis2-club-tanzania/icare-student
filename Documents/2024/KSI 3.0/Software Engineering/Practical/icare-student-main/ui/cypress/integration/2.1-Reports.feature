Feature: Report 
    As a hospital staff,
    I want to view various reports
    @focus
    Scenario: Viewing OPD Summary Report
        Given I have a OPD report to produce
        When I navigate to reports
        And select the OPD Report
        And select the period
        And select the Sex
        And select the Age Group
        Then I should view a summary of OPD users