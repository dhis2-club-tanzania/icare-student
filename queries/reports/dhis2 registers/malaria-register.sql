SELECT (@row_number:=@row_number+1) AS "Na",TAREHE,`JINA LA MGONJWA`,`MAHALI ANAISHI`,`JINSIA YA MGONJWA`,UMRI,MATOKEO_MRDT,MATOKEO_BS,`MALIPO` FROM(
SELECT
DATE_FORMAT(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'), "%d/%m/%Y %h:%i %p") AS TAREHE,
CASE WHEN pn.middle_name IS NOT NULL THEN UPPER(CONCAT(pn.given_name,' ',pn.middle_name,' ',pn.family_name)) ELSE UPPER(CONCAT(pn.given_name,' ',pn.family_name)) END AS `JINA LA MGONJWA`,
CASE WHEN pa.state_province IS NOT NULL THEN UPPER(CONCAT(pa.city_village,',',pa.state_province,' - ',pa.address1)) ELSE UPPER(CONCAT(pa.address2,',',pa.county_district,' - ',pa.address4)) END AS `MAHALI ANAISHI`,
GROUP_CONCAT(DISTINCT CASE WHEN p.gender='M' THEN 'Me'  ELSE 'Ke' END) AS `JINSIA YA MGONJWA`,
CASE WHEN (TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'))) =0 AND (TIMESTAMPDIFF(MONTH,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'))) =0 THEN CONCAT((TIMESTAMPDIFF(DAY,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'))),' ',"Day(s)") WHEN (TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'))) =0 AND (TIMESTAMPDIFF(MONTH,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'))) !=0 THEN CONCAT((TIMESTAMPDIFF(MONTH,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'))),' ',"Month(s)") ELSE CONCAT((TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'))),' ',"Year(s)") END AS UMRI,
'' AS MATOKEO_MRDT,
GROUP_CONCAT(DISTINCT(cn.name)) AS MATOKEO_BS,
GROUP_CONCAT(DISTINCT CASE WHEN vat.name='PaymentCategory' THEN payment_concept_name.name ELSE NULL END)AS `MALIPO`FROM  visit v-- Addressing names and address
LEFT JOIN person p ON p.person_id=v.patient_id
LEFT JOIN person_name pn ON p.person_id=pn.person_id and pn.preferred=1
LEFT JOIN person_address pa ON p.person_id=pa.person_id and pa.preferred=1-- Addressing orders for
LEFT JOIN encounter order_encounter ON order_encounter.visit_id=v.visit_id
INNER JOIN orders order_order ON order_order.encounter_id=order_encounter.encounter_id AND (order_order.concept_id = 166048)
LEFT JOIN lb_test_allocation lbta on lbta.order_id = order_order.order_id
-- 	INNER JOIN lb_test_allocation_status lbtas ON lbtas.test_allocation_id = lbta.test_allocation_id AND lbtas.status='APPROVED'
LEFT JOIN lb_test_result lbrs on lbrs.test_allocation_id = lbta.test_allocation_id
LEFT JOIN concept_name cn ON cn.concept_id=lbrs.value_coded_concept_id AND cn.concept_name_type = 'FULLY_SPECIFIED'-- MALIPO
LEFT JOIN visit_attribute va ON va.visit_id = v.visit_id
LEFT JOIN visit_attribute_type vat ON va.attribute_type_id=vat.visit_attribute_type_id
LEFT JOIN concept visit_attribute_concept ON va.value_reference=visit_attribute_concept.uuid
LEFT JOIN concept_name payment_concept_name ON payment_concept_name.concept_id=visit_attribute_concept.concept_id WHERE (CAST(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT') AS DATE)) BETWEEN "2023-01-01" AND "2023-03-28" AND v.voided=0
GROUP BY TAREHE,`JINA LA MGONJWA`,`MAHALI ANAISHI`,v.uuid UNION ALL SELECT
DATE_FORMAT(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'), "%d/%m/%Y %h:%i %p") AS TAREHE,
CASE WHEN pn.middle_name IS NOT NULL THEN UPPER(CONCAT(pn.given_name,' ',pn.middle_name,' ',pn.family_name)) ELSE UPPER(CONCAT(pn.given_name,' ',pn.family_name)) END AS `JINA LA MGONJWA`,
CASE WHEN pa.state_province IS NOT NULL THEN UPPER(CONCAT(pa.city_village,',',pa.state_province,' - ',pa.address1)) ELSE UPPER(CONCAT(pa.address2,',',pa.county_district,' - ',pa.address4)) END AS `MAHALI ANAISHI`,
GROUP_CONCAT(DISTINCT CASE WHEN p.gender='M' THEN 'Me'  ELSE 'Ke' END) AS `JINSIA YA MGONJWA`,
CASE WHEN (TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'))) =0 AND (TIMESTAMPDIFF(MONTH,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'))) =0 THEN CONCAT((TIMESTAMPDIFF(DAY,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'))),' ',"Day(s)") WHEN (TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'))) =0 AND (TIMESTAMPDIFF(MONTH,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'))) !=0 THEN CONCAT((TIMESTAMPDIFF(MONTH,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'))),' ',"Month(s)") ELSE CONCAT((TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'))),' ',"Year(s)") END AS UMRI,
GROUP_CONCAT(DISTINCT (cn.name)) AS MATOKEO_MRDT,
'' AS MATOKEO_BS,
GROUP_CONCAT(DISTINCT CASE WHEN vat.name='PaymentCategory' THEN payment_concept_name.name ELSE NULL END)AS `MALIPO`FROM  visit v-- Addressing names and address
LEFT JOIN person p ON p.person_id=v.patient_id
LEFT JOIN person_name pn ON p.person_id=pn.person_id and pn.preferred=1
LEFT JOIN person_address pa ON p.person_id=pa.person_id and pa.preferred=1-- Addressing orders for
LEFT JOIN encounter order_encounter ON order_encounter.visit_id=v.visit_id
INNER JOIN orders order_order ON order_order.encounter_id=order_encounter.encounter_id AND (order_order.concept_id = 215764)
LEFT JOIN lb_test_allocation lbta on lbta.order_id = order_order.order_id
-- INNER JOIN lb_test_allocation_status lbtas ON lbtas.test_allocation_id = lbta.test_allocation_id AND lbtas.status='APPROVED'
LEFT JOIN lb_test_result lbrs on lbrs.test_allocation_id = lbta.test_allocation_id
LEFT JOIN concept_name cn ON cn.concept_id=lbrs.value_coded_concept_id AND cn.concept_name_type = 'FULLY_SPECIFIED'-- MALIPO
LEFT JOIN visit_attribute va ON va.visit_id = v.visit_id
LEFT JOIN visit_attribute_type vat ON va.attribute_type_id=vat.visit_attribute_type_id
LEFT JOIN concept visit_attribute_concept ON va.value_reference=visit_attribute_concept.uuid
LEFT JOIN concept_name payment_concept_name ON payment_concept_name.concept_id=visit_attribute_concept.concept_id WHERE (CAST(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT') AS DATE)) BETWEEN "2023-01-01" AND "2023-03-28" AND v.voided=0
GROUP BY v.visit_id,TAREHE,`JINA LA MGONJWA`,`MAHALI ANAISHI`
ORDER BY TAREHE ASC) AS MALARIATESTDETAILS, (SELECT @row_number:=0) AS temp