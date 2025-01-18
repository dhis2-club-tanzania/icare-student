SELECT
cn.name AS item,
COUNT(pi.item_id) AS quantity,
SUM(pi.amount) AS price
FROM bl_payment_item pi
INNER JOIN item it ON it.item_id = pi.item_id
INNER JOIN concept_name cn ON cn.concept_id = it.concept_id AND cn.concept_name_type = 'FULLY_SPECIFIED'
INNER JOIN bl_payment p ON p.payment_id = pi.payment_id
INNER JOIN bl_invoice inv ON inv.invoice_id = p.invoice_id
INNER JOIN visit v ON v.visit_id = inv.visit_id
INNER JOIN encounter en ON en.visit_id = v.visit_id
INNER JOIN orders od ON od.encounter_id = en.encounter_id AND od.concept_id = it.concept_id
INNER JOIN order_type ot ON ot.order_type_id = od.order_type_id AND ot.uuid = :orderTypeUuid
WHERE CAST(CONVERT_TZ(p.date_created,'Etc/GMT+3','GMT') AS DATE) BETWEEN :startDate AND :endDate
GROUP BY cn.name;