 SELECT
sp.label AS "lab_no",

        (SELECT GROUP_CONCAT(DISTINCT  UPPER(va.value_reference))
FROM visit v
            INNER JOIN visit_attribute va ON va.visit_id = v.visit_id
            WHERE sp.visit_id = v.visit_id AND va.attribute_type_id=16
        )AS "request_doctor",
        ( SELECT GROUP_CONCAT(DISTINCT l.name)
FROM visit v
            INNER JOIN visit_attribute va ON va.visit_id = v.visit_id
            INNER JOIN location l on l.uuid = va.value_reference
            WHERE sp.visit_id = v.visit_id AND va.attribute_type_id = 7
        ) AS "health_facility",

        UPPER(CONCAT(pn.given_name,' ',pn.family_name)) AS `patient_name`,
        pi.identifier AS "file_no",
        CASE WHEN (TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'))) =0 AND (TIMESTAMPDIFF(MONTH,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'))) =0 THEN CONCAT((TIMESTAMPDIFF(DAY,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'))),' ',"Day(s)") WHEN (TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'))) =0 AND (TIMESTAMPDIFF(MONTH,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'))) !=0 THEN CONCAT((TIMESTAMPDIFF(MONTH,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'))),' ',"Month(s)") ELSE CONCAT((TIMESTAMPDIFF(YEAR,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT'))),' ',"Year(s)") END AS "age_years",
        CONCAT((TIMESTAMPDIFF(DAY,p.birthdate,CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT')))) AS "age_days",
        DATE_FORMAT(CONVERT_TZ(p.birthdate ,'Etc/GMT+3','GMT'), "%d/%m/%Y ") AS "date_of_birth",
        CASE WHEN p.gender='M' THEN 'M' WHEN p.gender='F' THEN 'F' ELSE 'UNKNOWN' END AS "sex",
        (SELECT GROUP_CONCAT(DISTINCT UPPER(pa.address1))
FROM visit v
            INNER JOIN person p ON p.person_id=v.patient_id
            INNER JOIN person_address pa ON p.person_id=pa.person_id AND pa.preferred =1
            WHERE sp.visit_id = v.visit_id

        )AS "address",

      DATE_FORMAT(CONVERT_TZ(sp.date_time ,'Etc/GMT+3','GMT'), "%d/%m/%Y %h:%i %p") AS "reg_date",

      (SELECT GROUP_CONCAT( DISTINCT CASE WHEN ob.concept_id = 220300 THEN ob.value_datetime ELSE NULL END)
              FROM obs ob
              INNER JOIN encounter e ON e.encounter_id = ob.encounter_id
              WHERE e.visit_id = sp.visit_id
        ) AS "collected_on",

      (SELECT GROUP_CONCAT( DISTINCT CASE WHEN ob.concept_id = 220311 THEN ob.value_datetime ELSE NULL END)
             FROM obs ob
             INNER JOIN encounter e ON e.encounter_id = ob.encounter_id
              WHERE e.visit_id = sp.visit_id
        ) AS "received_on",

        (SELECT GROUP_CONCAT(DISTINCT diagnosis_concept_name.name)
FROM visit v
INNER JOIN encounter diagnosis_encounter ON diagnosis_encounter.visit_id=v.visit_id
INNER JOIN encounter_diagnosis ed ON ed.encounter_id=diagnosis_encounter.encounter_id
INNER JOIN concept diagnosis_concept ON ed.diagnosis_coded=diagnosis_concept.concept_id
INNER JOIN concept_name diagnosis_concept_name ON diagnosis_concept_name.concept_id=diagnosis_concept.concept_id AND diagnosis_concept_name.concept_name_type='FULLY_SPECIFIED'
WHERE v.visit_id = sp.visit_id
        ) AS "icd_10",

(SELECT GROUP_CONCAT(DISTINCT u.username)
FROM lb_sample_status spstatus
            INNER JOIN users u on u.user_id = spstatus.user_id
            WHERE spstatus.sample_id = sp.sample_id AND spstatus.category = 'HAS_RESULTS'

        )AS "result_input_by",

        (SELECT MAX( DISTINCT DATE_FORMAT(CONVERT_TZ(spstatus.timestamp,'Etc/GMT+3','GMT'), "%d/%m/%Y %h:%i %p") )
FROM lb_sample_status spstatus
            WHERE spstatus.sample_id = sp.sample_id AND spstatus.category = 'HAS_RESULTS'
        ) AS"result_input_date",

(SELECT GROUP_CONCAT(DISTINCT u.username )
FROM lb_sample_status spstatus
            INNER JOIN users u on u.user_id = spstatus.user_id
            WHERE spstatus.sample_id = sp.sample_id AND spstatus.category = 'RESULT_AUTHORIZATION'

        ) AS "result_verified_by",

       ( SELECT GROUP_CONCAT( DISTINCT DATE_FORMAT(CONVERT_TZ(spstatus.timestamp,'Etc/GMT+3','GMT'), "%d/%m/%Y %h:%i %p"))
FROM lb_sample_status spstatus
            INNER JOIN users u on u.user_id = spstatus.user_id
            WHERE spstatus.sample_id = sp.sample_id AND spstatus.category = 'RESULT_AUTHORIZATION'
       ) AS"result_verified_date",

        (SELECT GROUP_CONCAT(DISTINCT instrument_name.name)
FROM lb_sample_order so
INNER JOIN lb_test_allocation testalloc ON so.order_id = testalloc.order_id
INNER JOIN lb_test_result test_result ON test_result.test_allocation_id = testalloc.test_allocation_id
INNER JOIN concept_name instrument_name ON test_result.instrument_id = instrument_name.concept_id AND instrument_name.concept_name_type='FULLY_SPECIFIED'
            WHERE so.sample_id = sp.sample_id
        )AS "instrument",

        test_order_concept_name.name  AS test,
       (SELECT GROUP_CONCAT(DISTINCT CASE WHEN results_name.name IS NULL AND test_result.value_text IS NOT NULL THEN test_result.value_text WHEN results_name.name IS NULL AND test_result.value_numeric IS NOT NULL AND testalloc_name.name = "HIV - Viral Load" THEN test_result.value_numeric  ELSE results_name.name END)

        ) AS "lab_result"

FROM lb_sample sp
      INNER JOIN lb_sample_status spstatus ON spstatus.sample_id = sp.sample_id AND (spstatus.category = 'HAS_RESULTS' OR spstatus.category = 'RESULT_AUTHORIZATION')
INNER JOIN lb_sample_status spstatus2 ON spstatus2.sample_id = sp.sample_id
LEFT JOIN concept c ON c.uuid = spstatus2.remarks
LEFT JOIN concept_name cn ON cn.concept_id = c.concept_id and cn.concept_name_type = 'FULLY_SPECIFIED'
      INNER JOIN visit v ON v.visit_id = sp.visit_id

         -- Addressing names and address
      INNER JOIN person p ON p.person_id=v.patient_id
      INNER JOIN person_name pn ON p.person_id=pn.person_id AND pn.preferred =1
        INNER JOIN patient_identifier pi ON pi.patient_id = v.patient_id AND pi.identifier_type=5


         -- Addressing user
INNER JOIN users u on u.user_id = spstatus.user_id

      -- Addressing vipimo vilivyoagizwa
      INNER JOIN encounter test_order_encounter ON test_order_encounter.visit_id=v.visit_id
      INNER JOIN orders test_order_order ON test_order_order.encounter_id=test_order_encounter.encounter_id
      INNER JOIN order_type ot ON ot.order_type_id=test_order_order.order_type_id AND ot.name='Test Order'
      INNER JOIN concept test_order_concept ON test_order_concept.concept_id=test_order_order.concept_id
      INNER JOIN concept_name test_order_concept_name ON test_order_concept_name.concept_id=test_order_concept.concept_id AND test_order_concept_name.concept_name_type='FULLY_SPECIFIED'

        -- Addressing instrument
        INNER JOIN lb_test_allocation testalloc ON testalloc.order_id = test_order_order.order_id
        INNER JOIN concept_name testalloc_name ON testalloc_name.concept_id = testalloc.concept_id AND testalloc_name.concept_name_type = 'FULLY_SPECIFIED'
        INNER JOIN (
            SELECT ta.test_allocation_id, MAX(tr.date_created) AS latest_date_created,MAX(tr.test_result_id) AS test_result_id
            FROM lb_test_allocation ta
            INNER JOIN lb_test_result tr ON ta.test_allocation_id = tr.test_allocation_id
            GROUP BY ta.test_allocation_id
        ) AS latest_test_result  ON testalloc.test_allocation_id = latest_test_result.test_allocation_id
        INNER JOIN lb_test_result test_result ON test_result.test_result_id = latest_test_result.test_result_id AND test_result.date_created = latest_test_result.latest_date_created

        -- Addressing results
        LEFT JOIN obs ob ON ob.order_id=test_order_order.order_id
        LEFT JOIN concept_name results_name ON results_name.concept_id = test_result.value_coded_concept_id AND results_name.concept_name_type='FULLY_SPECIFIED'

WHERE CAST(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT') AS DATE) BETWEEN :startDate AND :endDate
GROUP BY sp.sample_id,test,file_no,`patient_name`;
