--SELECT
--ledger.date_created AS Date,
--'' AS `Receipt from / Issued to`,
--CASE WHEN lt.operation='+' THEN ledger.quantity ELSE '' END AS `Quantity Received`,
--'' AS `Quantity Issued`,
--ledger.expiry_date AS `Expiry Date`,
--CASE WHEN lt.operation='-' THEN ledger.quantity ELSE '' END AS `Losses/ Adjusments`,
--CASE WHEN lt.operation='-' THEN '' ELSE '' END AS Balance,
--ledger.remarks AS Remarks,
--user.username AS `Issued / Received By `
--FROM st_ledger ledger
--LEFT JOIN st_stock stock ON stock.item_id = ledger.item_id
--LEFT JOIN st_ledger_type lt ON lt.ledger_type_id=ledger.ledger_type_id
--LEFT JOIN users user ON user.user_id=ledger.creator
--LEFT JOIN item it ON it.item_id =ledger.item_id
---- INNER JOIN st_transaction trs ON trs.item_id=ledger.item_id AND trs.batch_no=ledger.batch_no
--LEFT JOIN location loc ON loc.location_id=ledger.location_id
--WHERE it.uuid='0e3e09b9-07ae-480a-93c7-f378fa260c2b' AND loc.uuid='4187da6a-262f-45cf-abf1-a98ae80d0b8b'
--AND ledger.date_created BETWEEN '2022-01-01' AND '2022-10-10'
--
--UNION
--
--SELECT
-- issue.date_created as Date,
-- loc.name as `Receipt from / Issued to`,
-- '' AS `Quantity Received`,
-- issue_item.quantity  AS `Quantity Issued`,
-- issue_item.expiry_date AS `Expiry Date`,
-- '' AS `Losses/ Adjusments`,
-- '' AS Balance,
-- st_status.remarks AS Remarks,
-- user.username AS `Issued / Received By `
-- FROM st_issue_item as issue_item
-- LEFT JOIN st_issue issue ON issue_item.issue_id=issue.issue_id
-- LEFT JOIN location loc ON loc.location_id=issue.issued_location_id
-- LEFT JOIN st_stock stock ON stock.item_id=issue_item.item_id
-- INNER JOIN st_issue_status st_status ON st_status.issue_id=issue.issue_id AND st_status.remarks LIKE '%received%'
-- LEFT JOIN users user ON user.user_id=st_status.creator
-- LEFT JOIN item it ON it.item_id=issue_item.item_id
-- LEFT JOIN location loc2 ON loc2.location_id=issue.issueing_location_id
-- WHERE it.uuid='0e3e09b9-07ae-480a-93c7-f378fa260c2b' AND loc2.uuid='4187da6a-262f-45cf-abf1-a98ae80d0b8b'
-- AND issue.date_created BETWEEN '2020-01-01' AND '2022-10-10'
-- ORDER BY date ASC;

--SELECT
--tr.date_created AS "date",
--tr.batch_no AS "ref_no",
--CASE WHEN tr.previous_quantity < tr.current_quantity THEN sourceloc.name WHEN tr.previous_quantity > tr.current_quantity && loc.location_id = 2  THEN 'Patient' WHEN tr.previous_quantity > tr.current_quantity THEN destloc.name END  AS "from_to",
--CASE WHEN tr.previous_quantity < tr.current_quantity THEN tr.current_quantity-tr.previous_quantity ELSE '' END AS "qty_received",
--CASE WHEN tr.previous_quantity > tr.current_quantity THEN tr.previous_quantity-tr.current_quantity ELSE '' END AS "qty_issued",
--tr.expire_date AS "expiry_date",
--tr.current_quantity AS "balance",
--'' AS "remarks",
--user.username AS "initials"
--FROM st_transaction tr
--LEFT JOIN location loc ON loc.location_id=tr.location_id
--LEFT JOIN users user ON user.user_id=tr.creator
--LEFT JOIN item it ON it.item_id =tr.item_id
--LEFT JOIN location destloc ON destloc.location_id=tr.destination_location_id
--LEFT JOIN location sourceloc ON sourceloc.location_id = tr.source_location_id
--WHERE it.uuid= :itemUuid and loc.uuid= :locationUuid and tr.date_created between :startDate and :endDate;
-- test data it.uuid= '6afcc2e5-e8e5-4fb5-ac8f-f120e6234065' and loc.location_id=2 and loc.uuid='7f65d926-57d6-4402-ae10-a5b3bcbf7986'  and tr.date_created between '2023-06-12' and '2023-12-12'

--------------------------------------------------------------------------------------------------------------------------
--SELECT
--tr.date_created AS "date",
--(SELECT  si.invoice_number
--	FROM st_transaction tri
--	INNER JOIN st_stock_invoice_item sii ON sii.batch_no = tri.batch_no AND sii.item_id = tri.item_id
--    INNER JOIN st_stock_invoice si ON si.stock_invoice_id = sii.stock_invoice_id
--    WHERE tri.transaction_id=tr.transaction_id
--) AS "ref_no",
--tr.batch_no AS batch_no,
--CASE WHEN tr.previous_quantity < tr.current_quantity && loc.location_id = 50 THEN sup.name WHEN tr.previous_quantity < tr.current_quantity THEN sourceloc.name WHEN tr.previous_quantity > tr.current_quantity && loc.location_id = 2  THEN UPPER(CONCAT(pn.given_name,' ',pn.family_name)) WHEN tr.previous_quantity > tr.current_quantity THEN destloc.name END  AS "from_to",
--CASE WHEN tr.previous_quantity < tr.current_quantity THEN tr.current_quantity-tr.previous_quantity ELSE '' END AS "qty_received",
--CASE WHEN tr.previous_quantity > tr.current_quantity THEN tr.previous_quantity-tr.current_quantity ELSE '' END AS "qty_issued",
--tr.expire_date AS "expiry_date",
--tr.current_quantity AS "balance",
--'' AS "remarks",
--user.username AS "initials"
--FROM st_transaction tr
--LEFT JOIN location loc ON loc.location_id=tr.location_id
--LEFT JOIN users user ON user.user_id=tr.creator
--LEFT JOIN item it ON it.item_id =tr.item_id
--LEFT JOIN location destloc ON destloc.location_id=tr.destination_location_id
--LEFT JOIN location sourceloc ON sourceloc.location_id = tr.source_location_id
--LEFT JOIN orders od ON od.order_id = tr.order_id
--LEFT JOIN encounter ec ON ec.encounter_id = od.encounter_id
--LEFT JOIN person_name pn ON pn.person_id = ec.patient_id
--LEFT JOIN st_stock_invoice_item sii ON sii.batch_no = tr.batch_no AND sii.item_id = tr.item_id
--LEFT JOIN st_stock_invoice si ON si.stock_invoice_id = sii.stock_invoice_id
--LEFT JOIN st_supplier sup ON sup.supplier_id = si.supplier_id
--WHERE it.uuid= :itemUuid AND loc.uuid=:locationUuid  AND CAST(CONVERT_TZ(tr.date_created,'Etc/GMT+3','GMT') AS DATE) between :startDate AND :endDate
--ORDER BY tr.date_created ASC;

SELECT
tr.date_created AS "date",
(SELECT  si.invoice_number
	FROM st_transaction tri
	INNER JOIN st_stock_invoice_item sii ON sii.batch_no = tri.batch_no AND sii.item_id = tri.item_id
    INNER JOIN st_stock_invoice si ON si.stock_invoice_id = sii.stock_invoice_id
    WHERE tri.transaction_id=tr.transaction_id
) AS "ref_no",
tr.batch_no AS batch_no,
(SELECT DISTINCT CASE WHEN tra.previous_quantity < tra.current_quantity && loc.location_id = 50 THEN sup.name WHEN tra.previous_quantity < tra.current_quantity THEN sourceloc.name WHEN tra.previous_quantity > tra.current_quantity && loc.location_id = 2  THEN UPPER(CONCAT(pn.given_name,' ',pn.family_name)) WHEN tra.previous_quantity > tra.current_quantity THEN destloc.name END

FROM st_transaction tra
LEFT JOIN location destloc ON destloc.location_id=tra.destination_location_id
LEFT JOIN location sourceloc ON sourceloc.location_id = tra.source_location_id
LEFT JOIN location loc ON loc.location_id=tra.location_id
LEFT JOIN orders od ON od.order_id = tra.order_id
LEFT JOIN encounter ec ON ec.encounter_id = od.encounter_id
LEFT JOIN person_name pn ON pn.person_id = ec.patient_id AND pn.preferred =1
LEFT JOIN st_stock_invoice_item sii ON sii.batch_no = tra.batch_no AND sii.item_id = tra.item_id
LEFT JOIN st_stock_invoice si ON si.stock_invoice_id = sii.stock_invoice_id
LEFT JOIN st_supplier sup ON sup.supplier_id = si.supplier_id
WHERE tra.transaction_id = tr.transaction_id

)  AS "from_to",
CASE WHEN tr.previous_quantity < tr.current_quantity THEN tr.current_quantity-tr.previous_quantity ELSE '' END AS "qty_received",
CASE WHEN tr.previous_quantity > tr.current_quantity THEN tr.previous_quantity-tr.current_quantity ELSE '' END AS "qty_issued",
tr.expire_date AS "expiry_date",
tr.current_quantity AS "balance",
'' AS "remarks",
user.username AS "initials"
FROM st_transaction tr
LEFT JOIN location loc ON loc.location_id=tr.location_id
LEFT JOIN users user ON user.user_id=tr.creator
LEFT JOIN item it ON it.item_id =tr.item_id
LEFT JOIN location destloc ON destloc.location_id=tr.destination_location_id
LEFT JOIN location sourceloc ON sourceloc.location_id = tr.source_location_id

WHERE it.uuid= :itemUuid AND loc.uuid=:locationUuid  AND CAST(CONVERT_TZ(tr.date_created,'Etc/GMT+3','GMT') AS DATE) between :startDate AND :endDate
ORDER BY tr.date_created ASC;
