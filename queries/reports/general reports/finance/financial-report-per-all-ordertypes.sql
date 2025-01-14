SELECT 'CONSULTATION'  AS 'DEPARTMENT',
SUM(invi.quantity) AS 'QUANTITY',
SUM(pi.amount) AS 'AMOUNT'

FROM bl_payment_item pi
INNER JOIN item it ON it.item_id = pi.item_id
INNER JOIN concept_name cn ON cn.concept_id = it.concept_id AND cn.concept_name_type = 'FULLY_SPECIFIED'
INNER JOIN bl_payment p ON p.payment_id = pi.payment_id
INNER JOIN bl_invoice inv ON inv.invoice_id = p.invoice_id
INNER JOIN bl_invoice_item invi ON invi.item_id = pi.item_id AND invi.invoice_id = inv.invoice_id
INNER JOIN orders od ON od.order_id = invi.order_id
INNER JOIN order_type ot ON ot.order_type_id = od.order_type_id AND ot.uuid = "iCARESTS-ADMS-1111-1111-525400e4297f"
WHERE CAST(CONVERT_TZ(p.date_created,'Etc/GMT+3','GMT') AS DATE) BETWEEN :startDate AND :endDate

UNION ALL

SELECT 'MEDICATIONS'  AS 'DEPARTMENT',
SUM(invi.quantity) AS 'QUANTITY',
SUM(pi.amount) AS 'AMOUNT'

FROM bl_payment_item pi
INNER JOIN item it ON it.item_id = pi.item_id
INNER JOIN drug d ON d.drug_id = it.drug_id AND d.retired = 0
INNER JOIN bl_payment p ON p.payment_id = pi.payment_id
INNER JOIN bl_invoice inv ON inv.invoice_id = p.invoice_id
INNER JOIN bl_invoice_item invi ON invi.item_id = pi.item_id AND invi.invoice_id = inv.invoice_id
INNER JOIN visit v ON v.visit_id = inv.visit_id
WHERE CAST(CONVERT_TZ(p.date_created,'Etc/GMT+3','GMT') AS DATE) BETWEEN :startDate AND :endDate

UNION ALL

SELECT 'PROCEDURES'  AS 'DEPARTMENT',
COUNT(pi.item_id) AS 'QUANTITY',
SUM(pi.amount) AS 'AMOUNT'

FROM bl_payment_item pi
INNER JOIN item it ON it.item_id = pi.item_id
INNER JOIN concept_name cn ON cn.concept_id = it.concept_id AND cn.concept_name_type = 'FULLY_SPECIFIED'
INNER JOIN bl_payment p ON p.payment_id = pi.payment_id
INNER JOIN bl_invoice inv ON inv.invoice_id = p.invoice_id
INNER JOIN visit v ON v.visit_id = inv.visit_id
INNER JOIN encounter en ON en.visit_id = v.visit_id
INNER JOIN orders od ON od.encounter_id = en.encounter_id AND od.concept_id = it.concept_id
INNER JOIN order_type ot ON ot.order_type_id = od.order_type_id AND ot.uuid = "4ae7f8eb-0bd5-11e8-b450-525400e4297f"
WHERE CAST(CONVERT_TZ(p.date_created,'Etc/GMT+3','GMT') AS DATE) BETWEEN :startDate AND :endDate

UNION ALL

SELECT 'RADIOLOGY'  AS 'DEPARTMENT',
SUM(invi.quantity) AS 'QUANTITY',
SUM(pi.amount) AS 'AMOUNT'

FROM bl_payment_item pi
INNER JOIN item it ON it.item_id = pi.item_id
INNER JOIN concept_name cn ON cn.concept_id = it.concept_id AND cn.concept_name_type = 'FULLY_SPECIFIED'
INNER JOIN bl_payment p ON p.payment_id = pi.payment_id
INNER JOIN bl_invoice inv ON inv.invoice_id = p.invoice_id
INNER JOIN bl_invoice_item invi ON invi.item_id = pi.item_id AND invi.invoice_id = inv.invoice_id
INNER JOIN orders od ON od.order_id = invi.order_id
INNER JOIN order_type ot ON ot.order_type_id = od.order_type_id AND ot.uuid = "8189dbdd-3f10-11e4-adec-0800271c1b75"
WHERE CAST(CONVERT_TZ(p.date_created,'Etc/GMT+3','GMT') AS DATE) BETWEEN :startDate AND :endDate

UNION ALL

SELECT 'LABORATORY' AS 'DEPARTMENT',
COUNT(pi.item_id) AS 'QUANTITY',
SUM(pi.amount) AS 'AMOUNT'

FROM bl_payment_item pi
INNER JOIN item it ON it.item_id = pi.item_id
INNER JOIN concept_name cn ON cn.concept_id = it.concept_id AND cn.concept_name_type = 'FULLY_SPECIFIED'
INNER JOIN bl_payment p ON p.payment_id = pi.payment_id
INNER JOIN bl_invoice inv ON inv.invoice_id = p.invoice_id
INNER JOIN visit v ON v.visit_id = inv.visit_id
INNER JOIN encounter en ON en.visit_id = v.visit_id
INNER JOIN orders od ON od.encounter_id = en.encounter_id AND od.concept_id = it.concept_id
INNER JOIN order_type ot ON ot.order_type_id = od.order_type_id AND ot.uuid = "52a447d3-a64a-11e3-9aeb-50e549534c5e"
WHERE CAST(CONVERT_TZ(p.date_created,'Etc/GMT+3','GMT') AS DATE) BETWEEN :startDate AND :endDate



