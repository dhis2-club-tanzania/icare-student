SELECT
d.name AS item,
SUM(invi.quantity) AS quantity,
SUM(pi.amount) AS price
FROM bl_payment_item pi
INNER JOIN item it ON it.item_id = pi.item_id
INNER JOIN drug d ON d.drug_id = it.drug_id AND d.retired = 0
INNER JOIN bl_payment p ON p.payment_id = pi.payment_id
INNER JOIN bl_invoice inv ON inv.invoice_id = p.invoice_id
INNER JOIN bl_invoice_item invi ON invi.item_id = pi.item_id AND invi.invoice_id = inv.invoice_id
INNER JOIN visit v ON v.visit_id = inv.visit_id
WHERE CAST(CONVERT_TZ(p.date_created,'Etc/GMT+3','GMT') AS DATE) BETWEEN :startDate AND :endDate
GROUP BY d.name;