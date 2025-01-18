SELECT l.name as "ISSUED STORE",d.name as "DRUG", SUM(issue_item.quantity) as "QUANTITY"
	FROM st_issue issue 
	LEFT JOIN st_issue_item issue_item ON issue.issue_id = issue_item.issue_id
	LEFT JOIN item item ON item.item_id = issue_item.item_id
	LEFT JOIN drug d ON d.drug_id = item.drug_id
	LEFT JOIN location l ON l.location_id = issue.issued_location_id
GROUP BY issue.issued_location_id, d.name
