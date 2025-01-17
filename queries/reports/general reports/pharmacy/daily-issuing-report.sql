SELECT
d.name AS `DRUG NAME`,
issue.date_created AS `DATE ISSUED`,
l.name AS `LOCATION NAME`
FROM
st_issue_item issue_item
LEFT JOIN st_issue issue ON issue.issue_id = issue_item.issue_id
LEFT JOIN item it ON it.item_id = issue_item.item_id
LEFT JOIN drug d ON d.drug_id = it.drug_id
LEFT JOIN location l ON l.location_id = issue. issued_location_id
WHERE issue.date_created BETWEEN :startDate AND :endDate AND l.uuid =:locationUuid