SELECT (@row_number:=@row_number+1) AS "Na",TAREHE,MRN,`JINA LA MGONJWA`,`DAWA` FROM(
SELECT
		DATE_FORMAT(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'), "%d/%m/%Y %h:%i %p") AS TAREHE,
        GROUP_CONCAT(DISTINCT pi.identifier) AS MRN,
		UPPER(CONCAT(pn.given_name,' ',pn.family_name)) AS `JINA LA MGONJWA`,
		GROUP_CONCAT(DISTINCT d.name,':-',do.quantity,':-',unit.name,"(s)" SEPARATOR ';') AS `DAWA`
        -- GROUP_CONCAT(do.quantity) AS `IDADI`,
--         GROUP_CONCAT(unit.name,"(s)") AS `UNIT`

	FROM visit v

	-- Addressing names and address
	INNER JOIN person p ON p.person_id=v.patient_id
	INNER JOIN person_name pn ON p.person_id=pn.person_id AND pn.preferred =1
    INNER JOIN patient_identifier pi ON pi.patient_id = v.patient_id AND pi.identifier_type = 5


	-- Addressing vipimo vilivyoagizwa
	INNER JOIN encounter test_order_encounter ON test_order_encounter.visit_id=v.visit_id
	INNER JOIN orders test_order_order ON test_order_order.encounter_id=test_order_encounter.encounter_id

	-- Addressing Matibabu
	INNER JOIN prescription do ON do.order_id=test_order_order.order_id
    INNER JOIN concept_name unit ON unit.concept_id = do.quantity_units AND unit.concept_name_type = 'FULLY_SPECIFIED' AND unit.locale = 'en' AND unit.locale_preferred = 1
	INNER JOIN drug d ON d.drug_id=do.drug_inventory_id
    INNER JOIN st_order_status os ON os.order_id=do.order_id AND os.status = 4



	-- ADDRESSING VISIT TYPE
	WHERE  v.voided=0 AND CAST(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT') AS DATE) BETWEEN :startDate AND :endDate
	GROUP BY v.visit_id,v.date_started,`JINA LA MGONJWA`,v.uuid
	ORDER BY v.date_started ASC) AS VISITDETAILS, (SELECT @row_number:=0) AS temp
