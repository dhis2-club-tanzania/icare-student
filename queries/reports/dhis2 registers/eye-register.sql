SELECT `HUDHURIO LA KWANZA`,(@row_number:=@row_number+1) AS "Na",TAREHE,`NAMBA YA HUDHURIO`,`JINA LA MGONJWA`,`MAHALI ANAISHI`,UMRI,`JINSIA YA MGONJWA`,`UZITO(kg)`,`UREFU(cm)`,`VISUAL ACUITY GRADING IN THE BETTER EYE(RE) (PRESENTING)`,`VISUAL ACUITY GRADING IN THE BETTER EYE(LE) (PRESENTING)`,`VIPIMO`,`MATOKEO YA VIPIMO`,DIAGNOSIS,`MATIBABU`,`MATOKEO YA MAHUDHURIO`,`MALIPO` FROM(
SELECT
		CASE WHEN COUNT(othervisit.visit_id)> 0  THEN '' ELSE '*' END AS `HUDHURIO LA KWANZA`,
		DATE_FORMAT(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'), "%d/%m/%Y %h:%i %p") AS TAREHE,
        pi.identifier AS `NAMBA YA HUDHURIO`,
		UPPER(CONCAT(pn.given_name,' ',pn.family_name)) AS `JINA LA MGONJWA`,
		CONCAT(pa.city_village,',',pa.state_province,' - ',pa.address1) AS `MAHALI ANAISHI`,
		DATE_FORMAT(FROM_DAYS(DATEDIFF(v.date_started, p.birthdate)), '%Y') + 0 AS UMRI,
		CASE WHEN p.gender='M' THEN 'Me'  ELSE 'Ke' END AS `JINSIA YA MGONJWA`,
		GROUP_CONCAT(DISTINCT CASE WHEN ob2.concept_id='165861' THEN ob2.value_numeric  ELSE null END) AS `UZITO(kg)`,
		GROUP_CONCAT(DISTINCT CASE WHEN ob2.concept_id='165860' THEN ob2.value_numeric  ELSE null END) AS `UREFU(cm)`,
        GROUP_CONCAT(DISTINCT CASE WHEN ob2.concept_id='167014' THEN value_coded_concept_name.name ELSE NULL END) AS `VISUAL ACUITY GRADING IN THE BETTER EYE(RE) (PRESENTING)`,
        GROUP_CONCAT(DISTINCT CASE WHEN ob2.concept_id='167028' THEN value_coded_concept_name.name ELSE NULL END) AS `VISUAL ACUITY GRADING IN THE BETTER EYE(LE) (PRESENTING)`,
		GROUP_CONCAT(DISTINCT CASE WHEN ot.name='Test Order' THEN test_order_concept_name.name ELSE NULL END) AS `VIPIMO`,
		GROUP_CONCAT(DISTINCT CASE WHEN test_result_concept_name.name IS NULL THEN CONCAT(test_order_concept_name.name,'-[',test_result_concept_name2.name,'-',ob.value_text,']') ELSE CONCAT(test_order_concept_name.name,'-',test_result_concept_name.name) END)AS `MATOKEO YA VIPIMO`,
		GROUP_CONCAT(DISTINCT CASE WHEN ed.certainty='CONFIRMED' THEN diagnosis_concept_name.name ELSE NULL END) AS DIAGNOSIS,
		GROUP_CONCAT(DISTINCT d.name) AS `MATIBABU`,
		GROUP_CONCAT(DISTINCT result_encounter_type.name) AS `MATOKEO YA MAHUDHURIO`,
		GROUP_CONCAT(DISTINCT payment_concept_name.name)AS `MALIPO`
	FROM visit v
    -- INNER JOIN visit_type vt ON vt.visit_type_id=v.visit_type_id
	-- Addressing names and address
	INNER JOIN person p ON p.person_id=v.patient_id
	INNER JOIN person_name pn ON p.person_id=pn.person_id AND pn.preferred =1
    INNER JOIN patient_identifier pi ON pi.patient_id=p.person_id AND (pi.identifier_type = 3 OR pi.identifier_type=5)
	LEFT JOIN person_address pa ON p.person_id=pa.person_id AND pa.preferred =1

	-- Addressing hudhuriao la kwanza
	LEFT JOIN visit othervisit ON p.person_id=othervisit.patient_id
	AND othervisit.visit_id <> v.visit_id AND othervisit.date_started < v.date_started  AND YEAR(othervisit.date_started)=YEAR(v.date_started)
	-- Addressing vipimo vilivyoagizwa
	LEFT JOIN encounter test_order_encounter ON test_order_encounter.visit_id=v.visit_id
	LEFT JOIN orders test_order_order ON test_order_order.encounter_id=test_order_encounter.encounter_id
	LEFT JOIN order_type ot ON ot.order_type_id=test_order_order.order_type_id
	LEFT JOIN concept test_order_concept ON test_order_concept.concept_id=test_order_order.concept_id
	LEFT JOIN concept_name test_order_concept_name ON test_order_concept_name.concept_id=test_order_concept.concept_id AND test_order_concept_name.concept_name_type='FULLY_SPECIFIED'
	-- Addressing Matokeo ya vipimo
	LEFT JOIN obs ob ON ob.order_id=test_order_order.order_id
	LEFT JOIN concept_name test_result_concept_name ON test_result_concept_name.concept_id=ob.value_coded AND test_result_concept_name.concept_name_type = 'FULLY_SPECIFIED'
    LEFT JOIN concept_name test_result_concept_name2 ON test_result_concept_name2.concept_id=ob.concept_id AND test_result_concept_name2.concept_name_type = 'FULLY_SPECIFIED'
	-- Addressing other vitals obs
	 LEFT JOIN obs ob2 ON ob2.encounter_id=test_order_encounter.encounter_id
     LEFT JOIN concept_name value_coded_concept_name ON value_coded_concept_name.concept_id=ob2.value_coded AND value_coded_concept_name.concept_name_type = 'FULLY_SPECIFIED'
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
	LEFT JOIN visit_attribute va ON va.visit_id = v.visit_id AND va.attribute_type_id=1
	LEFT JOIN concept visit_attribute_concept ON va.value_reference=visit_attribute_concept.uuid
	LEFT JOIN concept_name payment_concept_name ON payment_concept_name.concept_id=visit_attribute_concept.concept_id AND payment_concept_name.concept_name_type = 'FULLY_SPECIFIED'

	-- ADDRESSING VISIT TYPE
	WHERE v.location_id=45 AND v.voided=0 AND CAST(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT') AS DATE) BETWEEN '2022-11-01' AND '2023-11-30'
	GROUP BY v.visit_id,v.date_started,`JINA LA MGONJWA`,`MAHALI ANAISHI`,v.uuid,`NAMBA YA HUDHURIO`
	ORDER BY v.date_started ASC) AS VISITDETAILS, (SELECT @row_number:=0) AS temp
