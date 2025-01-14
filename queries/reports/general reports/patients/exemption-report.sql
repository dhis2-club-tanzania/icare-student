SELECT (@row_number:=@row_number+1) AS "NA",`TAREHE`,`JINA_LA_MGONJWA`,`KIASI` FROM(
SELECT
GROUP_CONCAT(DISTINCT DATE_FORMAT(v.date_started, "%d/%m/%Y %h:%i %p")) AS `TAREHE`,
CONCAT(pn.given_name,' ',pn.family_name) AS `JINA_LA_MGONJWA`,
SUM(disc_inv.amount) AS `KIASI`

FROM visit v

-- Addressing names and address
INNER JOIN person p ON p.person_id=v.patient_id
INNER JOIN person_name pn ON p.person_id=pn.person_id AND pn.preferred = 1

-- Addressing invoices
INNER JOIN bl_invoice inv ON inv.visit_id=v.visit_id
INNER JOIN bl_discount_invoice_item disc_inv ON disc_inv.invoice_id=inv.invoice_id

WHERE CAST(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT') AS DATE) BETWEEN :startDate AND :endDate
GROUP BY v.visit_id,CONCAT(pn.given_name,' ',pn.family_name)) AS VISITDETAILS, (SELECT @row_number:=0) AS temp