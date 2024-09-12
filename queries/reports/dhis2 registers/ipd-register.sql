SELECT (@row_number:=@row_number+1) AS "NA",`JINA_LA_MGONJWA`,`NAMBA_YA_JALADA`,`JINSIA_YA_MGONJWA`,UMRI,`MAHALI_ANAISHI`,`TAREHE_YA_KULAZWA`,`DIAGNOSIS_KABLA_YA_KUTHIBITISHWA`,`VIPIMO_VILIVYOAGIZWA`,`MATOKEO_YA_VIPIMO`,`CONFIRMED_DIAGNOSIS`,`MATIBABU`,`MATOKEO_YA_MWISHO`,`TAREHE_YA_MATOKEO_YA_MWISHO`,`MALIPO` FROM(
SELECT

	UPPER(CONCAT(pn.given_name,' ',pn.family_name)) AS `JINA_LA_MGONJWA`,
	GROUP_CONCAT(DISTINCT CASE WHEN p.gender='M' THEN 'Me'  ELSE 'Ke' END) AS `JINSIA_YA_MGONJWA`,
    pi.identifier AS `NAMBA_YA_JALADA`,
	DATE_FORMAT(FROM_DAYS(DATEDIFF(v.date_started, p.birthdate)), '%Y') + 0 AS UMRI,
	CONCAT(pa.city_village,',',pa.state_province,' - ',pa.address1) AS `MAHALI_ANAISHI`,
	DATE_FORMAT(v.date_started, "%d/%m/%Y %h:%i %p") AS `TAREHE_YA_KULAZWA`,
	GROUP_CONCAT(DISTINCT diagnosis_concept_name.name) AS `DIAGNOSIS_KABLA_YA_KUTHIBITISHWA`,
	GROUP_CONCAT(DISTINCT CASE WHEN ot.name='Test Order' THEN test_order_concept_name.name ELSE NULL END) AS `VIPIMO_VILIVYOAGIZWA`,
	GROUP_CONCAT(DISTINCT CASE WHEN test_result_concept_name.name IS NULL THEN ob.value_text ELSE test_result_concept_name.name END)AS `MATOKEO_YA_VIPIMO`,
	GROUP_CONCAT(DISTINCT CASE WHEN ed.certainty='CONFIRMED' THEN diagnosis_concept_name.name ELSE NULL END) AS `CONFIRMED_DIAGNOSIS`,
	GROUP_CONCAT(DISTINCT d.name) AS `MATIBABU`,
	GROUP_CONCAT(DISTINCT result_encounter_type.name) AS `MATOKEO_YA_MWISHO`,
	DATE_FORMAT(v.date_stopped,"%d/%m/%Y %h:%i %p") AS `TAREHE_YA_MATOKEO_YA_MWISHO`,
	GROUP_CONCAT(DISTINCT CASE WHEN vat.name='PaymentCategory' THEN payment_concept_name.name ELSE NULL END)AS `MALIPO`
	from visit v

-- Addressing names and address
INNER JOIN person p ON p.person_id=v.patient_id
INNER JOIN person_name pn ON p.person_id=pn.person_id
INNER JOIN patient_identifier pi ON pi.patient_id=p.person_id AND (pi.identifier_type = 3 OR pi.identifier_type=5)
LEFT JOIN person_address pa ON p.person_id=pa.person_id

-- Addressing vipimo vilivyoagizwa
LEFT JOIN encounter test_order_encounter ON test_order_encounter.visit_id=v.visit_id
LEFT JOIN orders test_order_order ON test_order_order.encounter_id=test_order_encounter.encounter_id
LEFT JOIN order_type ot ON ot.order_type_id=test_order_order.order_type_id
LEFT JOIN concept test_order_concept ON test_order_concept.concept_id=test_order_order.concept_id
LEFT JOIN concept_name test_order_concept_name ON test_order_concept_name.concept_id=test_order_concept.concept_id AND test_order_concept_name.concept_name_type='FULLY_SPECIFIED'

-- Addressing Matokeo ya vipimo
LEFT JOIN obs ob ON ob.order_id=test_order_order.order_id
LEFT JOIN concept_name test_result_concept_name ON test_result_concept_name.concept_id=ob.value_coded AND test_result_concept_name.concept_name_type = 'FULLY_SPECIFIED'

-- Addressing Diagnosis
LEFT JOIN encounter diagnosis_encounter ON diagnosis_encounter.visit_id=v.visit_id
LEFT JOIN encounter_diagnosis ed ON ed.encounter_id=diagnosis_encounter.encounter_id
LEFT JOIN concept diagnosis_concept ON ed.diagnosis_coded=diagnosis_concept.concept_id
LEFT JOIN concept_name diagnosis_concept_name ON diagnosis_concept_name.concept_id=diagnosis_concept.concept_id

-- Addressing Matibabu
LEFT JOIN prescription do ON do.order_id=test_order_order.order_id
LEFT JOIN drug d ON d.drug_id=do.drug_inventory_id

-- MATOKEO
-- LEFT JOIN encounter result_encounter ON result_encounter.visit_id=v.visit_id
LEFT JOIN encounter_type result_encounter_type ON diagnosis_encounter.encounter_type=result_encounter_type.encounter_type_id
AND (result_encounter_type.encounter_type_id =1 OR result_encounter_type.encounter_type_id =2 OR result_encounter_type.encounter_type_id =22)

-- MALIPO
 LEFT JOIN visit_attribute va ON va.visit_id = v.visit_id
 LEFT JOIN visit_attribute_type vat ON va.attribute_type_id=vat.visit_attribute_type_id
 LEFT JOIN concept visit_attribute_concept ON va.value_reference=visit_attribute_concept.uuid
 LEFT JOIN concept_name payment_concept_name ON payment_concept_name.concept_id=visit_attribute_concept.concept_id

 -- ADDRESSING IPD ENCOUNTER
LEFT JOIN encounter visit_encounter ON visit_encounter.visit_id=v.visit_id
INNER JOIN encounter_type visit_encounter_type ON visit_encounter.encounter_type=visit_encounter_type.encounter_type_id AND visit_encounter_type.encounter_type_id = 2

-- ADDRESSING VISIT TYPE
LEFT JOIN visit_type vt ON vt.visit_type_id=v.visit_type_id

WHERE (v.date_started BETWEEN :startDate AND :endDate)
GROUP BY v.visit_id,`JINA_LA_MGONJWA`,`MAHALI_ANAISHI`,`NAMBA_YA_JALADA`
ORDER BY v.date_started ASC) AS VISITDETAILS, (SELECT @row_number:=0) AS temp
