SELECT test,health_facility,number_of_requests,number_of_rejects,ROUND((number_of_rejects/number_of_requests)*100,2) AS percentage_of_rejects,rejection_reason
FROM(
 SELECT
		test_order_concept_name.name  AS test,
		l.name  AS "health_facility",
        (SELECT SUM(IF(test_order_concept.concept_id =219907, 1, 0))

            from visit v
			INNER JOIN person p ON p.person_id=v.patient_id
			INNER JOIN encounter test_order_encounter ON test_order_encounter.visit_id=v.visit_id
			INNER JOIN orders test_order_order ON test_order_order.encounter_id=test_order_encounter.encounter_id
			INNER JOIN concept test_order_concept ON test_order_concept.concept_id=test_order_order.concept_id
            LEFT JOIN visit_attribute va ON va.visit_id = v.visit_id AND va.attribute_type_id =7
			LEFT JOIN location lo on lo.uuid = va.value_reference
			WHERE lo.location_id = l.location_id

        )AS "number_of_requests",
        (SELECT SUM(IF(test_order_concept.concept_id =219907, 1, 0))

            from visit v
			INNER JOIN person p ON p.person_id=v.patient_id
			INNER JOIN encounter test_order_encounter ON test_order_encounter.visit_id=v.visit_id
			INNER JOIN orders test_order_order ON test_order_order.encounter_id=test_order_encounter.encounter_id
			INNER JOIN concept test_order_concept ON test_order_concept.concept_id=test_order_order.concept_id
            INNER JOIN lb_sample_order so ON so.order_id = test_order_order.order_id AND so.sample_id IN(SELECT sample_id FROM lb_sample_status WHERE (category = 'REJECTED_LABORATORY' OR category ='REJECTED_REGISTRATION'))
			INNER JOIN visit_attribute va ON va.visit_id = v.visit_id AND va.attribute_type_id =7
			LEFT JOIN location lo on lo.uuid = va.value_reference
			WHERE lo.location_id = l.location_id


        )AS "number_of_rejects",
        "" AS "percentage_of_rejects",
        group_concat(cn.name) AS "rejection_reason"

		FROM lb_sample sp

        -- Addressing vipimo vilivyoagizwa
     	INNER JOIN lb_sample_order so ON so.sample_id=sp.sample_id
     	INNER JOIN orders test_order_order ON test_order_order.order_id=so.order_id
     	INNER JOIN concept test_order_concept ON test_order_concept.concept_id=test_order_order.concept_id AND test_order_concept.concept_id =219907
     	INNER JOIN concept_name test_order_concept_name ON test_order_concept_name.concept_id=test_order_concept.concept_id AND test_order_concept_name.concept_name_type='FULLY_SPECIFIED'

     	LEFT JOIN lb_sample_status spstatus ON spstatus.sample_id = sp.sample_id
		LEFT JOIN concept c ON c.uuid = spstatus.status
		LEFT JOIN concept_name cn ON cn.concept_id = c.concept_id and cn.concept_name_type = 'FULLY_SPECIFIED'
     	INNER JOIN visit v ON v.visit_id = sp.visit_id

        -- Addressing hospital
        LEFT JOIN visit_attribute va ON va.visit_id = v.visit_id AND va.attribute_type_id =7
        LEFT JOIN location l on l.uuid = va.value_reference

		WHERE v.voided=0 AND CAST(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT') AS DATE) BETWEEN "2023-03-03" AND "2023-12-31" AND l.name IS NOT NULL
		GROUP BY l.location_id,test

         UNION

        SELECT
 		test_order_concept_name.name  AS test,
 		l.name  AS "health_facility",
         (SELECT SUM(IF(test_order_concept.concept_id =219907, 1, 0))

             from visit v
 			INNER JOIN encounter test_order_encounter ON test_order_encounter.visit_id=v.visit_id
 			INNER JOIN orders test_order_order ON test_order_order.encounter_id=test_order_encounter.encounter_id
 			INNER JOIN concept test_order_concept ON test_order_concept.concept_id=test_order_order.concept_id
            WHERE v.visit_id NOT IN(SELECT va.visit_id FROM visit_attribute va WHERE va.attribute_type_id = 7)
			AND CAST(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT') AS DATE) BETWEEN "2023-03-03" AND "2023-12-31"


         )AS "number_of_requests",
         (SELECT SUM(IF(test_order_concept.concept_id =219907, 1, 0))

             from visit v
 			INNER JOIN encounter test_order_encounter ON test_order_encounter.visit_id=v.visit_id
 			INNER JOIN orders test_order_order ON test_order_order.encounter_id=test_order_encounter.encounter_id
 			INNER JOIN concept test_order_concept ON test_order_concept.concept_id=test_order_order.concept_id
			INNER JOIN lb_sample_order so ON so.order_id = test_order_order.order_id AND so.sample_id IN(SELECT sample_id FROM lb_sample_status WHERE (category = 'REJECTED_LABORATORY' OR category ='REJECTED_REGISTRATION'))
            WHERE v.visit_id NOT IN(SELECT va.visit_id FROM visit_attribute va WHERE va.attribute_type_id = 7)
			AND CAST(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT') AS DATE) BETWEEN "2023-03-03" AND "2023-12-31"

         )AS "number_of_rejects",
         "" AS "percentage_of_rejects",
         group_concat(cn.name) AS "rejection_reason"

 		FROM lb_sample sp

         -- Addressing vipimo vilivyoagizwa
      	INNER JOIN lb_sample_order so ON so.sample_id=sp.sample_id
      	INNER JOIN orders test_order_order ON test_order_order.order_id=so.order_id
      	INNER JOIN concept test_order_concept ON test_order_concept.concept_id=test_order_order.concept_id AND test_order_concept.concept_id =219907
      	INNER JOIN concept_name test_order_concept_name ON test_order_concept_name.concept_id=test_order_concept.concept_id AND test_order_concept_name.concept_name_type='FULLY_SPECIFIED'

      	LEFT JOIN lb_sample_status spstatus ON spstatus.sample_id = sp.sample_id
 		LEFT JOIN concept c ON c.uuid = spstatus.status
 		LEFT JOIN concept_name cn ON cn.concept_id = c.concept_id and cn.concept_name_type = 'FULLY_SPECIFIED'
      	INNER JOIN visit v ON v.visit_id = sp.visit_id

        -- Addressing hospital
         LEFT JOIN visit_attribute va ON va.visit_id = v.visit_id AND va.attribute_type_id =7
         LEFT JOIN location l on l.uuid = va.value_reference

 		WHERE v.voided=0 AND CAST(CONVERT_TZ(v.date_started,'Etc/GMT+3','GMT') AS DATE) BETWEEN "2023-03-03" AND "2023-12-31" AND l.name IS NULL
 		GROUP BY l.location_id,test
        )	AS A


