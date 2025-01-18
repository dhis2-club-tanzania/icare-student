SELECT
    sp.label AS "lab_no",
    DATE_FORMAT(CONVERT_TZ(sp.date_time, 'Etc/GMT+3', 'GMT'), "%d/%m/%Y %h:%i %p") AS "reg_date",
    pi.identifier AS "file_no",
    (SELECT GROUP_CONCAT( DISTINCT CASE WHEN ob.concept_id = 220298 THEN cn.name ELSE NULL END)
         FROM obs ob
         INNER JOIN encounter e ON e.encounter_id = ob.encounter_id
         INNER JOIN concept c ON c.concept_id = ob.value_coded
         INNER JOIN concept_name cn ON cn.concept_id = c.concept_id and cn.concept_name_type = 'FULLY_SPECIFIED'
         WHERE e.visit_id = sp.visit_id
        ) AS "priority",
    (SELECT GROUP_CONCAT(DISTINCT CASE WHEN va.attribute_type_id=7 THEN l.name ELSE NULL END)
        FROM visit v
        LEFT JOIN visit_attribute va ON va.visit_id = v.visit_id
        LEFT JOIN location l on l.uuid = va.value_reference
        WHERE  v.visit_id = sp.visit_id
		) AS "health_facility",
    (SELECT GROUP_CONCAT(DISTINCT UPPER(pa.address1))
        FROM visit v
        INNER JOIN person p ON p.person_id=v.patient_id
        LEFT JOIN person_address pa ON p.person_id=pa.person_id AND pa.preferred =1
        WHERE  v.visit_id = sp.visit_id
    ) AS "address",
    CASE WHEN (TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'))) =0 AND (TIMESTAMPDIFF(MONTH,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'))) =0 THEN CONCAT((TIMESTAMPDIFF(DAY,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'))),' ',"Day(s)") WHEN (TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'))) =0 AND (TIMESTAMPDIFF(MONTH,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'))) !=0 THEN CONCAT((TIMESTAMPDIFF(MONTH,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'))),' ',"Month(s)") ELSE CONCAT((TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'))),' ',"Year(s)") END AS "age_years",
    CONCAT((TIMESTAMPDIFF(DAY,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')))) AS "age_days",
    DATE_FORMAT(CONVERT_TZ(p.birthdate	,'Etc/GMT+3','GMT'), "%d/%m/%Y ") AS "date_of_birth",
    CASE WHEN p.gender='M' THEN 'M' WHEN p.gender='F' THEN 'F' ELSE 'UNKNOWN' END AS "sex",

--    (SELECT GROUP_CONCAT( DISTINCT CASE WHEN spstatus.status = 'COLLECTED_ON' THEN spstatus.remarks ELSE NULL END)
--        FROM lb_sample_status spstatus
--        WHERE spstatus.sample_id = sp.sample_id
--    ) AS "collected_on",
--
    (SELECT GROUP_CONCAT( DISTINCT CASE WHEN ob.concept_id = 220300 THEN ob.value_datetime ELSE NULL END)
         	FROM obs ob
         	INNER JOIN encounter e ON e.encounter_id = ob.encounter_id
            WHERE e.visit_id = sp.visit_id
        ) AS "collected_on",

    (SELECT GROUP_CONCAT( DISTINCT CASE WHEN ob.concept_id = 220299 THEN UPPER(ob.value_text) ELSE NULL END)
            FROM obs ob
            INNER JOIN encounter e ON e.encounter_id = ob.encounter_id
            WHERE e.visit_id = sp.visit_id
    ) AS "collected_by",

    (SELECT GROUP_CONCAT( DISTINCT CASE WHEN ob.concept_id = 220311 THEN ob.value_datetime ELSE NULL END)
     	FROM obs ob
     	INNER JOIN encounter e ON e.encounter_id = ob.encounter_id
        WHERE e.visit_id = sp.visit_id
    ) AS "received_on",

    (SELECT GROUP_CONCAT( DISTINCT CASE WHEN ob.concept_id = 220333 THEN UPPER(ob.value_text) ELSE NULL END)
         FROM obs ob
         INNER JOIN encounter e ON e.encounter_id = ob.encounter_id
         WHERE e.visit_id = sp.visit_id
        ) AS "received_by",
--    (SELECT GROUP_CONCAT( DISTINCT  spstatus.remarks)
--        FROM lb_sample_status spstatus
--     	 WHERE spstatus.sample_id = sp.sample_id AND spstatus.status = 'DELIVERED_ON'
--    ) AS "delivered_on",
--
--    (SELECT GROUP_CONCAT( DISTINCT  UPPER(spstatus.remarks))
--        FROM lb_sample_status spstatus
--     	 WHERE spstatus.sample_id = sp.sample_id AND spstatus.status = 'DELIVERED_BY'
--    ) AS "delivered_by",
--    (SELECT GROUP_CONCAT( DISTINCT cn.name)
--        FROM lb_sample_status spstatus
--        INNER JOIN concept c ON c.uuid = spstatus.remarks
--		INNER JOIN concept_name cn ON cn.concept_id = c.concept_id and cn.concept_name_type = 'FULLY_SPECIFIED'
--        WHERE spstatus.sample_id = sp.sample_id AND spstatus.category = 'CONDITION'
--    ) AS "specimen_condition",

    (SELECT GROUP_CONCAT( DISTINCT CASE WHEN ob.concept_id = 220315 THEN cn.name ELSE NULL END)
        FROM obs ob
        INNER JOIN encounter e ON e.encounter_id = ob.encounter_id
        INNER JOIN concept c ON c.concept_id = ob.value_coded
		INNER JOIN concept_name cn ON cn.concept_id = c.concept_id and cn.concept_name_type = 'FULLY_SPECIFIED'
        WHERE e.visit_id = sp.visit_id
    ) AS "transport_condition",

--    (SELECT GROUP_CONCAT( DISTINCT cn.name )
--        FROM lb_sample_status spstatus
--        INNER JOIN concept c ON c.uuid = spstatus.remarks
--		INNER JOIN concept_name cn ON cn.concept_id = c.concept_id and cn.concept_name_type = 'FULLY_SPECIFIED'
--        WHERE spstatus.sample_id = sp.sample_id AND spstatus.status = 'TRANSPORT_TEMPERATURE'
--    ) AS "transport_temperature",

    (SELECT GROUP_CONCAT(DISTINCT diagnosis_concept_name.name)
     	FROM visit v
		INNER JOIN encounter diagnosis_encounter ON diagnosis_encounter.visit_id=v.visit_id
      	INNER JOIN encounter_diagnosis ed ON ed.encounter_id=diagnosis_encounter.encounter_id
      	INNER JOIN concept diagnosis_concept ON ed.diagnosis_coded=diagnosis_concept.concept_id
      	INNER JOIN concept_name diagnosis_concept_name ON diagnosis_concept_name.concept_id=diagnosis_concept.concept_id AND diagnosis_concept_name.concept_name_type='FULLY_SPECIFIED'
        WHERE v.visit_id = sp.visit_id
    ) AS "icd_10",

    (SELECT GROUP_CONCAT(DISTINCT va.value_reference)
     	FROM visit v
        INNER JOIN visit_attribute va ON va.visit_id = v.visit_id
        WHERE va.visit_id = v.visit_id AND va.attribute_type_id = 16 AND v.visit_id = sp.visit_id
    ) AS "refering_doctor",
    (SELECT GROUP_CONCAT(DISTINCT va.value_reference)
        FROM visit v
        INNER JOIN visit_attribute va ON va.visit_id = v.visit_id
        WHERE va.visit_id = v.visit_id AND va.attribute_type_id = 18 AND v.visit_id = sp.visit_id
    ) AS "refering_doctor_email",
    (SELECT GROUP_CONCAT(DISTINCT va.value_reference)
        FROM visit v
        INNER JOIN visit_attribute va ON va.visit_id = v.visit_id
        WHERE va.visit_id = v.visit_id AND va.attribute_type_id = 17 AND v.visit_id = sp.visit_id
    ) AS "refering_doctor_phone",
    test_order_concept_name.name AS test

	FROM lb_sample sp
    INNER JOIN visit v ON v.visit_id = sp.visit_id
    INNER JOIN person p ON p.person_id=v.patient_id
    INNER JOIN patient_identifier pi ON pi.patient_id = v.patient_id AND pi.identifier_type=5

    -- Addressing vipimo vilivyoagizwa
	INNER JOIN encounter test_order_encounter ON test_order_encounter.visit_id=v.visit_id
	INNER JOIN orders test_order_order ON test_order_order.encounter_id=test_order_encounter.encounter_id
	INNER JOIN order_type ot ON ot.order_type_id=test_order_order.order_type_id AND ot.name='Test Order'
	INNER JOIN concept test_order_concept ON test_order_concept.concept_id=test_order_order.concept_id
	INNER JOIN concept_name test_order_concept_name ON test_order_concept_name.concept_id=test_order_concept.concept_id AND test_order_concept_name.concept_name_type='FULLY_SPECIFIED'
    WHERE v.voided=0 AND CAST(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT') AS DATE) BETWEEN :startDate AND :endDate
	GROUP BY sp.sample_id,test,file_no;